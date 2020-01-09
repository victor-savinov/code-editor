document.addEventListener('keydown', function (event) {
  //console.log(event.keyCode, event);

  if (event.keyCode == 79 && event.ctrlKey == true) {
    event.preventDefault();

    document.querySelector('.input-file').click();
  } /*else if (event.keyCode == 78 && event.ctrlKey == true) {
    event.preventDefault();

    code_editor__files.newFile('untitled', ['']);
  }*/else if (event.keyCode == 18) {
    event.preventDefault();

    document.querySelector('.menu-bar__toggle-menu-bar').click();
  } else if (event.keyCode == 220 && event.ctrlKey == true) {
    event.preventDefault();

    document.querySelector('.menu-bar__toggle-tree-view').click();
  } else if (event.keyCode == 187 && event.ctrlKey == true && event.shiftKey == true) {
    event.preventDefault();

    document.querySelector('.menu-bar__increase-font-size').click();
  } else if (event.keyCode == 189 && event.ctrlKey == true && event.shiftKey == true) {
    event.preventDefault();

    document.querySelector('.menu-bar__decrease-font-size').click();
  }
});
