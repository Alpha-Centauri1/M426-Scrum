import _ from 'lodash'
import { result } from 'lodash'
import React from 'react'
import { Search } from 'semantic-ui-react'
import PlacesService from '../services/PlacesService';
import PlacesProvider from '../providers/PlacesProvider';

const initialState = {
    loading: false,
    results: [],
    value: '',
}

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

function SearchExampleStandard  ()  {
    const [state, dispatch] = React.useReducer(exampleReducer, initialState)
    const { loading, results, value } = state
    let result = [];

    /*
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
            response.forEach(airport => {
                source.push({ title: airport.City + ', ' + airport.Country + ' ' + airport.ICAO, description: airport.Name });
            });
            response.forEach((airport, index) => { if (result.indexOf(airport.City) === -1) result.push(airport.City) });
            result.forEach(city => {

            });
        });
    */

    const handleResult = React.useCallback((e, data) => {
        dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title });
    }, [])

    const timeoutRef = React.useRef()
    const handleSearchChange = React.useCallback((e, data) => {
        let source = [];
        PlacesService(data.value, PlacesProvider)
            .then(response => {
                if (response.hasOwnProperty('Places')) {
                    //response.Places.forEach(place => {
                    //    source.push({ title: place.PlaceName, description: place.CountryName });
                    //});
                    response.Places.forEach((place, index) => { if (result.indexOf(place.PlaceName) === -1) source.push({ title: place.PlaceName, description: place.CountryName })});
                }
            });
            
            console.log(source);

        clearTimeout(timeoutRef.current)
        dispatch({ type: 'START_SEARCH', query: data.value })    

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' })
                return
            }

            console.log(data.value, result.title);

            const re = new RegExp(_.escapeRegExp(data.value), 'i')
            const isMatch = (result) => re.test(result.title)

            dispatch({
                type: 'FINISH_SEARCH',
                results: _.filter(source, isMatch),
            })
        }, 300)
    }, [])
    React.useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
        <Search
            loading={loading}
            onResultSelect={handleResult}
            onSearchChange={handleSearchChange}
            results={results}
            value={value}
        />
    )
}

export default SearchExampleStandard;