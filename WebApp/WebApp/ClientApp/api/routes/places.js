var express = require('express');
var router = express.Router();

const placesProvider = require('../src/providers/placesProvider');
const placesService = require('../src/services/placesService');

router.get('/', function (req, res, next) {
    placesService(req.query.query, placesProvider)
    .then(result => res.send(result))
    .catch(error => {
        res.statusMessage = error;
    });
});

module.exports = router;