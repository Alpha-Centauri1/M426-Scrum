async function RoutesService(from, to, when, RoutesProvider) {
    return RoutesProvider(from, to, when);
}

export default RoutesService;