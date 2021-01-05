function PlacesProvider(destination) {
    if (typeof destination === 'string') {

        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow'
        };
    
        return fetch("http://localhost:9000/places?query=" + destination, requestOptions)
            .then(response => response.json())
            .catch(error => {
                console.log(error);
            });

    } else {
        throw new Error('Expecting destination to be of type string, actual is ' + typeof destination);
    }
}

export default PlacesProvider;