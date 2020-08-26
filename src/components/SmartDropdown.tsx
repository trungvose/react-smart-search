import React, { Component, ChangeEvent } from "react";
import { SearchResultItem } from "../model/search-result";
import "./SmartDropdown.css";
import { Callback } from "../model/callback";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

export interface SearchProps {
  maxItem: number;
  isLoading: boolean;
  items: SearchResultItem[];
  selectedItem?: string;
  placeHolder?: string;
  hasAddPrivilege?: boolean;
  onSelected?: Callback<string>;
  onSearch?: Callback<string>;
  addNewOption?: Callback<string>;
}

export interface SearchState {
  keyword: string;
  showSuggestion: boolean;
  slicedItems: SearchResultItem[];
}

export default class SmartDropdown extends Component<SearchProps, SearchState> {
  keywordChange$ = new Subject<string>();

  static defaultProps: SearchProps = {
    maxItem: 5,
    isLoading: false,
    items: [],
    placeHolder: "",
    hasAddPrivilege: false,
    selectedItem: undefined,
  };

  state: SearchState = {
    slicedItems: [],
    keyword: "",
    showSuggestion: false,
  };

  componentDidMount() {
    this.keywordChange$.pipe(debounceTime(300)).subscribe((keyword) => {
      this.search(keyword);
    });
  }

  componentDidUpdate(prevProps: SearchProps) {
    if (this.props.items !== prevProps.items) {
      let { maxItem, items } = this.props;

      this.setState({
        slicedItems: items.slice(0, maxItem),
      });
    }
  }

  componentWillUnmount() {
    this.keywordChange$.subscribe();
  }

  renderSearchResult() {
    let { isLoading, maxItem, items, selectedItem } = this.props;

    if (isLoading) {
      return this.renderItem("Loading...");
    }

    if (!items.length) {
      return this.renderNotFound();
    }

    let elements = this.state.slicedItems.map((item) => {
      let isSelected = selectedItem === item.name;
      return this.renderItem(
        item.name,
        this.selectItem,
        isSelected ? "active" : ""
      );
    });

    let isRenderAllItems = items.length === this.state.slicedItems.length;
    if (!isRenderAllItems && maxItem && items.length > maxItem) {
      elements.push(
        this.renderItem(
          `${items.length - maxItem} more...`,
          this.showAll,
          "text-right"
        )
      );
    }

    return elements;
  }

  selectItem(selectedItem: string) {
    let { onSelected } = this.props;
    if (typeof onSelected === "function") {
      onSelected(selectedItem);
    }
    this.hideSuggestion();
  }

  search(keyword: string) {
    this.setState({
      keyword,
    });
    let { onSearch } = this.props;
    if (onSearch) {
      onSearch(keyword);
    }
  }

  showAll() {
    this.setState({
      slicedItems: this.props.items,
    });
  }

  renderNotFound() {
    return (
      <li className={`list-group-item d-flex`}>
        <span className="flex-grow-1">"{this.state.keyword}" not found.</span>
        {this.props.hasAddPrivilege && (
          <button
            className="btn btn-primary btn-sm"
            onClick={this.addAndSelectKeyword.bind(this)}
          >
            Add & Select
          </button>
        )}
      </li>
    );
  }

  addAndSelectKeyword() {
    let { addNewOption } = this.props;
    if (addNewOption) {
      this.setState({
        showSuggestion: false,
      });
      addNewOption(this.state.keyword);
    }
  }

  renderItem(text: string, onClick?: Callback<string>, additionalClass = "") {
    return (
      <li
        key={text}
        onClick={onClick?.bind(this, text)}
        className={`list-group-item ${additionalClass}`}
      >
        {text}
      </li>
    );
  }

  showSuggestion() {
    let { maxItem, items } = this.props;
    this.setState({
      showSuggestion: true,
      slicedItems: items.slice(0, maxItem),
    });
  }

  hideSuggestion() {
    this.setState({
      showSuggestion: false,
    });
  }

  render() {
    let { placeHolder, selectedItem } = this.props;
    return (
      <div className="search-container">
        <div className="search-textbox">
          <input
            value={selectedItem}
            onFocus={this.showSuggestion.bind(this)}
            className="form-control custom-caret"
            placeholder={placeHolder}
            readOnly
          ></input>
        </div>
        {this.state.showSuggestion && (
          <div className="search-dropdown-container">
            <div className="search-input">
              <input
                onChange={(e) => this.keywordChange$.next(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Search"
              ></input>
            </div>
            <ul className="list-group list-group-flush search-result-container">
              {this.renderSearchResult()}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
