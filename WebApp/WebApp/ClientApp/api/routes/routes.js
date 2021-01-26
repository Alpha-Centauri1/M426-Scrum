var express = require('express');
var router = express.Router();

const routesProvider = require('../src/providers/routesProvider');
const routesService = require('../src/services/routesService');

router.get('/', function (req, res, next) {
    routesService(req.query.from, req.query.to, req.query.when, routesProvider)
    .then(result => res.send(result))
    .catch(error => {
        res.statusMessage = error;
    });
});

module.exports = router;