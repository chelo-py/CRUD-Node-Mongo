const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index'); // Renderiza la pantalla index.js que se encuentra en views
});

router.get('/about', (req, res) => {
    res.render('about') // Renderiza la pantalla about.js que se encuentra en views
})
module.exports = router;