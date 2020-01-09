function disableNativeSelection(event) {
  event.preventDefault();
}

const objectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
  s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));

document.querySelector('.menu-bar__toggle-fullscreen').onclick = function () {
  document.documentElement.requestFullscreen();
};

document.querySelector('.menu-bar__toggle-menu-bar').onclick = function () {
  let menu_bar = document.querySelector('.menu-bar');

  if (menu_bar.classList.contains('hidden'))
    menu_bar.classList.remove('hidden');
  else
    menu_bar.classList.add('hidden');
};

document.querySelector('.menu-bar__toggle-tree-view').onclick = function () {
  let menu_bar = document.querySelector('.aside');

  if (menu_bar.classList.contains('hidden'))
    menu_bar.classList.remove('hidden');
  else
    menu_bar.classList.add('hidden');
};

document.querySelector('.menu-bar__increase-font-size').onclick = function () {
  code_editor.increaseFontSize();
};

document.querySelector('.menu-bar__decrease-font-size').onclick = function () {
  code_editor.decreaseFontSize();
};
