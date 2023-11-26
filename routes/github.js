var express = require('express');
var router = express.Router();

/* GET About page. */
router.get('/', function(req, res, next) {
  res.redirect('https://github.com/Khyrstina');
});

module.exports = router;
