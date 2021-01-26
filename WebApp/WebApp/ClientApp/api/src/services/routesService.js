async function routesService(from, to, when, routesProvider) {
    return routesProvider(from, to, when)
        .then(response => {
            return response;
        })
        .catch(error => {
            return Promise.reject(new Error(error));
        });
}

module.exports = routesService;