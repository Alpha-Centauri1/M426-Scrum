async function placesService(destination, placesProvider) {
    return placesProvider(destination)
        .then(response => {
            return response;
        })
        .catch(error => {
            return Promise.reject(new Error(error));
        });
}

module.exports = placesService;