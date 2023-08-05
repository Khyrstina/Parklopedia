
var skipLink = document.querySelector('.skip-link');
skipLink.addEventListener('click', function (e) {
  e.preventDefault();
  document.querySelector(skipLink.getAttribute('href')).focus();
});

var menu = document.querySelector('#main-nav');
document.querySelector('#menu-trigger').addEventListener('click', function (e) {
  menu.classList.toggle('active');
});