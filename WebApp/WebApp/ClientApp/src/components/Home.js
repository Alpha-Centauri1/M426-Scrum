import React, { Component } from 'react';
import PlacesService from '../services/PlacesService';
import PlacesProvider from '../providers/PlacesProvider';
import MapChart from "./MapChart/MapChart";
import './MapChart/MapChart.css';
import ReactTooltip from "react-tooltip";


export class Home extends Component {
  static displayName = Home.name;

  constructor(props) {
    super(props);
    this.state = { apiResponse: "", content: "", airports: [], searchAirports: [] };
  }

  componentWillMount() {
    this.callAPI();
    this.getAirportData();
  }

  callAPI = () => {
    PlacesService("United States", PlacesProvider)
      .then(response => {
        console.log(response);
      });
    this.setState({ apiResponse: 'Hey' });
  }

  setContent = (_content) => {
    this.setState({ content: _content });
  }

  getAirportData = () => {
    fetch('airports.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(response => {
        return response.json();
      })
      .then(response => {
        let airportData = [];
        let airportSearchTerm = [];
        response.forEach(airport => {
          airportData.push({id: airport.Airport_ID, name: airport.Name, city: airport.City, country: airport.Country, icao: airport.ICAO, longitude: airport.Longitude, latitude: airport.Latitude});
          airportSearchTerm.push({title: airport.Name, description: airport.City + ', ' + airport.Country});
        });
        this.setState({airports: airportData, searchAirports: airportSearchTerm });
      });
  }


  render() {
    return (
      <div className="mapContainer">
        <MapChart setTooltipContent={this.setContent} />
        <ReactTooltip>{this.state.content}</ReactTooltip>
      </div>
    );
  }
}
