async function PlacesService(destination, PlacesProvider) {
    return PlacesProvider(destination);
}

export default PlacesService;