import React, { Component } from 'react';
import PlacesService from '../services/PlacesService';
import PlacesProvider from '../providers/PlacesProvider';

export class Counter extends Component {
  static displayName = Counter.name;

  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  componentWillMount() {
    this.callAPI();
  }

  callAPI() {
    PlacesService("Germany", PlacesProvider)
    .then(response => {
      console.log(response);
    });
    this.setState({ apiResponse: 'Hey' });
  }

  render() {
    return (
      <div>
        <h1>Counter</h1>
        <p>{this.state.apiResponse}</p>
      </div>
    );
  }
}
