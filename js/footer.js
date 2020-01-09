window.addEventListener('cursormove', function (event) {
  let data = event.detail;

  document.querySelector('.footer__section__cursor-position').innerHTML = data[0] + ':' + data[1];
});
