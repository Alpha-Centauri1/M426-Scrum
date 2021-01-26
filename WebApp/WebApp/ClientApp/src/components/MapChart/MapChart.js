import React, { memo, useRef, useState, useEffect } from "react";
import _ from 'lodash';
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Line
} from "react-simple-maps";
import { Search, Segment, Step, Button, Icon, Input } from 'semantic-ui-react'
import PlacesService from '../../services/PlacesService';
import PlacesProvider from '../../providers/PlacesProvider';
import RoutesProvider from '../../providers/RoutesProvider';
import RoutesService from '../../services/RoutesService';
import './MapChart.css';
import firebase from 'firebase/app';
import 'firebase/firestore';

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const initialState = {
  loading: false,
  results: [],
  value: ''
}

firebase.initializeApp({
  apiKey: "AIzaSyBAeUTbYIdivZ54w_iyCWG6iU_7ETysLfM",
  authDomain: "flights-ca9a7.firebaseapp.com",
  projectId: "flights-ca9a7",
  storageBucket: "flights-ca9a7.appspot.com",
  messagingSenderId: "460027677107",
  appId: "1:460027677107:web:dc3d37c30b316f8cc5e3c6"
});

const firestore = firebase.firestore();

function exampleReducer(state, action) {
  switch (action.type) {
    case 'CLEAN_QUERY':
      return initialState
    case 'START_SEARCH':
      return { ...state, loading: true, value: action.query }
    case 'FINISH_SEARCH':
      return { ...state, loading: false, results: action.results }
    case 'UPDATE_SELECTION':
      return { ...state, value: action.selection }
    default:
      throw new Error()
  }
}

const MapChart = ({ setTooltipContent }) => {
  const [state, dispatch] = React.useReducer(exampleReducer, initialState)
  const { loading, results, value } = state
  const [active, setActive] = useState('From');
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [fromCoor, setFromCoor] = useState();
  const [toCoor, setToCoor] = useState();
  const [fromId, setFromId] = useState();
  const [toId, setToId] = useState();
  const [oneWayColor, setOneWayColor] = useState('blue');
  const [twoWayColor, setTwoWayColor] = useState('');
  const [departureDate, setDepartureDate] = useState();
  const [arrivalDate, setArrivalDate] = useState();
  let quotes = useRef();
  let result = [];
  let activeSelection = useRef('From');
  let departure = useRef();
  let arrival = useRef();
  let fromCityId = useRef();
  let toCityId = useRef();
  let cities = [];

  const handleResult = React.useCallback((e, data) => {
    dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title });

    if (activeSelection.current === 'From') {
      fetch('airports.json'
        , {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
        .then(response => {
          return response.json();
        })
        .then(response => {
          response.forEach((airport, index) => { if (cities.indexOf(airport.City) === -1) cities.push({ name: airport.City, latitude: airport.Latitude, longitude: airport.Longitude }) });
          cities.forEach(city => {
            if (city.name === data.result.title) {
              setFromCoor([city.longitude, city.latitude]);
            }
          });
        });

      setFromId(data.result.id);
      setFrom(data.result.title);
      fromCityId.current = data.result.id;
    }

    if (activeSelection.current === 'To') {
      fetch('airports.json'
        , {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )
        .then(response => {
          return response.json();
        })
        .then(response => {
          response.forEach((airport, index) => { if (cities.indexOf(airport.City) === -1) cities.push({ name: airport.City, latitude: airport.Latitude, longitude: airport.Longitude }) });
          cities.forEach(city => {
            if (city.name === data.result.title) {
              setToCoor([city.longitude, city.latitude]);
            }
          });
        });
      setToId(data.result.id);
      setTo(data.result.title);
      toCityId.current = data.result.id;
    }
  }, [])

  useEffect(() => {
    var arrival = document.getElementsByClassName("arrival");
    for (let item of arrival) {
      item.style.display = "none";
    }
  }, []);

  const handleStepSelect = React.useCallback((e, { title }) => {
    setActive(title);
    activeSelection.current = title;
  }, []);

  const handleOneWayFlight = React.useCallback((e, data) => {
    var arrival = document.getElementsByClassName("arrival");
    for (let item of arrival) {
      item.style.display = "none";
    }

    setOneWayColor('blue');
    setTwoWayColor('');
  }, []);

  const handleTwoWayFlight = React.useCallback((e, data) => {
    var arrival = document.getElementsByClassName("arrival");
    for (let item of arrival) {
      item.style.display = "flex";
    }

    setTwoWayColor('blue');
    setOneWayColor('');
  }, []);

  const handleDepartureInput = React.useCallback((e, data) => {
    setDepartureDate(data.value);
    departure.current = data.value;
  }, []);

  const handleArrivalInput = React.useCallback((e, data) => {
    setArrivalDate(data.value);
    arrival.current = data.value;
  }, []);

  const handleSearchFlights = React.useCallback((e, data) => {
    let quotesList = [];
    let destinationIds = [];
    let originIds = [];
    let carrierIds = [];
    let destinations = [];
    let origins = [];
    let carriers = [];
    let direct = '';
    let flights = []

    RoutesService(fromCityId.current, toCityId.current, departure.current, RoutesProvider)
      .then(response => {
        response.Quotes.forEach(quote => {
          destinationIds.push(quote.OutboundLeg.DestinationId);
          originIds.push(quote.OutboundLeg.OriginId);
          carrierIds = quote.OutboundLeg.CarrierIds;
          if (quote.Direct) {
            direct = 'Direct';
          } else {
            direct = 'Not direct';
          }
          flights.push({ price: quote.MinPrice, direct: direct });
        })
        response.Places.forEach(place => {
          destinationIds.forEach(quotePlace => {
            if (place.PlaceId === quotePlace) {
              destinations.push(place.Name);
            }
          });
          originIds.forEach(quotePlace => {
            if (place.PlaceId === quotePlace) {
              origins.push(place.Name);
            }
          });
        });
        response.Carriers.forEach(carrier => {
          carrierIds.forEach(quoteCarrier => {
            if (carrier.CarrierId === quoteCarrier) {
              carriers.push(carrier.Name);
            }
          });
        });

        for (let i = 0; i < origins.length; i++) {
          let origin = origins[i];
          let destination = destinations[i];
          let carrier = carriers[i];
          let price = flights[i].price;
          let direct = flights[i].direct;

          if (carriers.length === 1) {
            carrier = carriers[0];
          }

          quotesList.push(
            <Segment className="flight" fluid="true" key={i}>
              <p className="destination">{destination}</p>
              <p className="carrier">{carrier}</p>
              <p className="origin">{origin}</p>
              <p className="direct">{direct}</p>
              <p className="price">CHF {price}</p>
            </Segment>);

          firestore.collection("flights").add({
            origin: origin,
            destination: destination,
            date: departure.current,
            direct: direct,
            carrier: carrier,
            price: price
          })
            .then(function (docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
        }
      });

    quotes.current = quotesList;
  }, []);

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    let source = [];
    PlacesService(data.value, PlacesProvider)
      .then(response => {
        if (response.hasOwnProperty('Places')) {
          response.Places.forEach((place, index) => { if (result.indexOf(place.PlaceName) === -1) source.push({ title: place.PlaceName, description: place.CountryName, id: place.PlaceId }) });
        }
      });

    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i')
      const isMatch = (result) => re.test(result.title)

      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(source, isMatch),
      });

    }, 300)
  }, [])
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])


  return (
    <div>
      <Segment raised className="modal">
        <Step.Group size="mini" widths="2">
          <Step
            onClick={handleStepSelect}
            active={active === 'From'}
            link
            title='From'
            description='Choose your starting point'
          />
          <Step
            onClick={handleStepSelect}
            active={active === 'To'}
            link
            title='To'
            description='Choose your destination'
          />
        </Step.Group>
        <Search
          loading={loading}
          onResultSelect={handleResult}
          onSearchChange={handleSearchChange}
          results={results}
          value={value}
          fluid
          className="search"
          size="tiny"
        />
        <p className="to">From &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {from}</p>
        <p className="to">To &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {to}</p>

        <Button.Group compact fluid>
          <Button icon color={oneWayColor} onClick={handleOneWayFlight}>
            <Icon name='long arrow alternate right' />
          </Button>
          <Button icon color={twoWayColor} onClick={handleTwoWayFlight}>
            <Icon name='exchange' />
          </Button>
        </Button.Group>

        <p className="to">Date of Departure</p>
        <Input
          size="mini"
          fluid
          icon={<Icon name='calendar alternate outline' inverted circular link />}
          placeholder='yyyy-mm-dd'
          onChange={handleDepartureInput}
        />
        <p id="to" className="arrival">Date of Arrival</p>
        <Input
          size="mini"
          fluid
          icon={<Icon className="arrival" name='calendar alternate outline' inverted circular link />}
          placeholder='yyyy-mm-dd'
          onChange={handleArrivalInput}
          className="arrival"
        />
        <br />
        <Button fluid compact color="blue" onClick={handleSearchFlights}>
          GO
        </Button>

        <div className="quotesModal">
          {quotes.current}
        </div>

      </Segment>
      <ComposableMap className="worldMap" data-tip="" projection="geoMercator" projectionConfig={{ scale: 140 }}>
        <ZoomableGroup
          center={[0, 0]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME } = geo.properties;
                    setTooltipContent(`${NAME}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    default: {
                      fill: "#E7ECF2",
                      outline: "none",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    },
                    hover: {
                      fill: "#2389F0",
                      outline: "none",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    },
                    pressed: {
                      fill: "#08E400",
                      outline: "none",
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  }}
                />
              ))
            }
          </Geographies>
          <Line
            from={fromCoor}
            to={toCoor}
            stroke="#2389F0"
            strokeWidth={1}
            strokeLinecap="round"
          />
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);
