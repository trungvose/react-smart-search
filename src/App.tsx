import React, { Component } from "react";
import SmartDropdown from "./components/SmartDropdown";
import "./App.css";
import { SearchResultItem, MOCK_RESULTS } from "./model/search-result";
import { of } from "rxjs";
import { delay, finalize } from "rxjs/operators";

interface AppState {
  standardSelected: string;
  standardItems: SearchResultItem[];
  isLoadingStandardItems: boolean;
}
export default class App extends Component<{}, AppState> {
  state: AppState = {
    standardSelected: "",
    standardItems: MOCK_RESULTS,
    isLoadingStandardItems: false,
  };

  standardSelected(item: string) {
    console.log(item);
    this.setState({
      standardSelected: item,
    });
  }

  getCountries(keyword: string) {
    let filteredResults = MOCK_RESULTS.filter((x) =>
      x.name.toLowerCase().includes(keyword.trim().toLowerCase())
    );
    return of(filteredResults).pipe(
      delay(300),
      finalize(() => {
        this.setState({
          isLoadingStandardItems: false,
        });
      })
    );
  }

  standardSearch(keyword: string) {
    this.setState({
      isLoadingStandardItems: true,
    });
    this.getCountries(keyword).subscribe((results) => {
      this.setState({
        standardItems: results,
      });
    });
  }

  addNewOption(option: string) {
    this.setState({
      standardSelected: option,
    });
    this.getCountries("").subscribe((results) => {
      this.setState({
        standardItems: [
          {
            name: option,
          },
          ...results,
        ],
      });
    });
  }

  render() {
    let {
      isLoadingStandardItems,
      standardSelected,
      standardItems,
    } = this.state;
    return (
      <React.Fragment>
        <main className="main-container flex-shrink-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h3 className="text-right">
                  Search non existing / Add n Select
                </h3>
                <SmartDropdown
                  placeHolder="Select a location"
                  isLoading={isLoadingStandardItems}
                  items={standardItems}
                  hasAddPrivilege={true}
                  selectedItem={standardSelected}
                  addNewOption={this.addNewOption.bind(this)}
                  onSelected={this.standardSelected.bind(this)}
                  onSearch={this.standardSearch.bind(this)}
                ></SmartDropdown>
              </div>
            </div>
          </div>
        </main>
        <footer className="footer mt-auto py-3">
          <div className="container">
            <span className="text-muted">@Trung Vo</span>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}
