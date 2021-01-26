const fetch = require('node-fetch');

function routesProvider(from, to, when) {
    if (typeof from === 'string' && typeof to === 'string' && typeof when === 'string') {

        var requestOptions = {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
                'x-rapidapi-key': 'a92f939ca7mshec996243eb746bcp149912jsn47a516f9dcae',
                'Content-Type': 'application/json'
            },
            redirect: 'follow'
        };
    
        return fetch("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/CH/CHF/en-GB/" + from + "/" + to + "/" + when, requestOptions)
            .then(response => {
                return response.json();
            })
            .catch(error => {
                return Promise.reject(new Error(error));
            });

    } else {
        throw new Error('Expecting from, to and when to be of type string, actual is ' + typeof from + ', ' + typeof to + ' and ' + typeof when);
    }
}

module.exports = routesProvider;