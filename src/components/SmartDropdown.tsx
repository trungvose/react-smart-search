import React, { Component } from "react";
import { SearchResultItem } from "../model/search-result";
import "./SmartDropdown.css";

export interface SearchProps {
  maxItem?: number;
  placeHolder?: string;
  isLoading: boolean;
  items: SearchResultItem[];
}

export interface SearchState {
  selectedItem: string;
  keyword: string;
  showSuggestion: boolean;
  slicedItems: SearchResultItem[];
}

interface Callback {
  (item: string): void;
}

export default class SmartDropdown extends Component<SearchProps, SearchState> {
  static defaultProps: SearchProps = {
    maxItem: 5,
    isLoading: false,
    items: [],
  };

  state: SearchState = {
    selectedItem: "",
    slicedItems: [],
    keyword: "",
    showSuggestion: false,
  };

  componentWillReceiveProps() {
    let { maxItem, items } = this.props;

    this.setState({
      slicedItems: items.slice(0, maxItem),
    });
  }

  renderSearchResult() {
    let { isLoading, maxItem, items } = this.props;

    if (isLoading) {
      return this.renderItem("Loading...");
    }

    if (!items.length) {
      return this.renderItem(`${this.state.keyword} not found.`);
    }

    let elements = this.state.slicedItems.map((item) => {
      return this.renderItem(item.name, this.selectItem);
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
    console.log(selectedItem);
    this.setState({
      selectedItem,
    });
    this.hideSuggestion();
  }

  showAll() {
    this.setState({
      slicedItems: this.props.items,
    });
  }

  renderItem(text: string, onClick?: Callback, additionalClass = "") {
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
    let { placeHolder } = this.props;
    return (
      <div className="search-container">
        <div className="search-textbox">
          <input
            value={this.state.selectedItem}
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
