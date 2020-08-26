import React, { Component } from "react";
import SmartDropdown from "./components/SmartDropdown";
import "./App.css";
import { SearchResultItem, MOCK_RESULTS } from "./model/search-result";

interface AppState {
  standardSelected: string;
  items: SearchResultItem[];
}
export default class App extends Component<{}, AppState> {
  state: AppState = {
    standardSelected: "",
    items: MOCK_RESULTS,
  };

  standardSelected(item: string) {
    console.log(item);
    this.setState({
      standardSelected: item,
    });
  }

  render() {
    return (
      <React.Fragment>
        <main className="main-container flex-shrink-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h3 className="text-right">Standard Drop-down</h3>
                <SmartDropdown
                  selectedItem={this.state.standardSelected}
                  placeHolder="Select a location"
                  isLoading={false}
                  items={this.state.items}
                  onSelected={this.standardSelected.bind(this)}
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
