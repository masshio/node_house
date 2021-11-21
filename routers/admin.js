const express = require('express');
const router = express.Router();

router.post('/login',require('../controller/admin').login)

module.exports = router;