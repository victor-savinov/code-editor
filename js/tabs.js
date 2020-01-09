function newTab(name = 'untitled', id) {
  let tab = document.createElement('span'),
      tab_close = document.createElement('span'),
      tab_id = id;

  if (document.querySelector('.tab.focused'))
    document.querySelector('.tab.focused').classList.remove('focused');

  tab.classList.add('tab');
  tab.classList.add('focused');
  tab.innerText = name;

  tab.index = function() {
    return Array.from(this.parentNode.children).indexOf(this);
  };

  tab.onclick = function (event) {
    if (event.target == tab) {
      if (document.querySelector('.tab.focused'))
        document.querySelector('.tab.focused').classList.remove('focused');

      this.classList.add('focused');

      code_editor__files.openFile(tab_id);
    }
  };

  tab_close.classList.add('tab__close');
  tab_close.onclick = function (event) {
    event.preventDefault();

    if (event.target.parentNode == document.querySelector('.tab.focused')) {
      if (document.querySelector('.tab.focused').index() > 0)
        document.querySelectorAll('.tab')[document.querySelector('.tab.focused').index() - 1].click();
      else if (document.querySelector('.tab.focused').index() < document.querySelectorAll('.tab').length - 1)
        document.querySelectorAll('.tab')[document.querySelector('.tab.focused').index() + 1].click();
      else
        code_editor__files.newFile('untitled', ['']);
    }

    tab.remove();
    code_editor__files.removeFile(tab_id);
  };

  tab.appendChild(tab_close);
  document.querySelector('.header__section--align-start').appendChild(tab);
}
