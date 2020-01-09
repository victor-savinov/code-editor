document.querySelector('.aside').style.width = '200px';

function resizeAside(event) {
  document.querySelector('.aside').style.width = event.clientX + 'px';
}

document.querySelector('.aside__resize').onmousedown = function(event) {
  if (event.button == 0) {
    event.preventDefault();

    window.addEventListener('selectstart', disableNativeSelection);
    window.addEventListener('mousemove', resizeAside);
  }
}


window.addEventListener('mouseup', function(event) {
  event.preventDefault();

  window.removeEventListener('selectstart', disableNativeSelection);
  window.removeEventListener('mousemove', resizeAside);
});
