const fetch = require('node-fetch');

function placesProvider(destination) {
    if (typeof destination === 'string') {

        var requestOptions = {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': 'a92f939ca7mshec996243eb746bcp149912jsn47a516f9dcae',
                'Content-Type': 'application/json'
            },
            redirect: 'follow'
        };
    
        return fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/CH/CHF/en-GB/?query=" + destination, requestOptions)
            .then(response => {
                return response.json();
            })
            .catch(error => {
                return Promise.reject(new Error(error));
            });

    } else {
        throw new Error('Expecting destination to be of type string, actual is ' + typeof destination);
    }
}

module.exports = placesProvider;