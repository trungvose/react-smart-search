import React, { Component } from "react";
import SmartDropdown from "./components/SmartDropdown";
import "./App.css";
import { SearchResultItem } from "./model/search-result";

interface State {
  items: SearchResultItem[];
}
export default class App extends Component {
  state: State = {
    items: [
      {
        name: "Singapore",
      },
      {
        name: "Malaysia",
      },
      {
        name: "Indonesia",
      },
      {
        name: "Phillipines",
      },
      {
        name: "Thailand",
      },
      {
        name: "Vietnam",
      },
      {
        name: "Laos",
      },
      {
        name: "Cambodia",
      },
      {
        name: "Brunei",
      },
    ],
  };
  render() {
    return (
      <React.Fragment>
        <main className="main-container flex-shrink-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h3 className="text-right">Standard Drop-down</h3>
                <SmartDropdown
                  placeHolder="Select a location"
                  isLoading={false}
                  items={this.state.items}
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
