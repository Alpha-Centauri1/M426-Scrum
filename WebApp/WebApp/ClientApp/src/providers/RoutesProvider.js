function RoutesProvider(from, to, when) {
    if (typeof from === 'string' && typeof to === 'string' && typeof when === 'string') {

        var requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow'
        };
    
        return fetch("http://localhost:9000/routes?from=" + from + "&to=" + to + "&when=" + when, requestOptions)
            .then(response => response.json())
            .catch(error => {
                console.log(error);
            });

    } else {
        throw new Error('Expecting from, to and when to be of type string, actual is ' + typeof from + ', ' + typeof to + ' and ' + typeof when);
    }
}

export default RoutesProvider;