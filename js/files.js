function Files() {
  var files = {};

  function getGrammarStatus(id) {
    let grammar = 'Plain Text',
        file_extension = files[id].name.match(/(?:\.([^.]+))?$/)[0];

    if (file_extension == '.html')
      grammar = 'HTML';
    else if (file_extension == '.js')
      grammar = 'JavaScript';
    else if (file_extension == '.css')
      grammar = 'CSS';

    document.querySelector('.footer__section__grammar-status').innerText = grammar;
  }

  function createTreeView(id) {
    let tree_view = document.querySelector('.aside__content__tree-view');

    tree_view.innerHTML = '';

    for (let i in files) {
      let tree_view_component = document.createElement('span'),
          focused_component_id = i;

      tree_view_component.innerHTML = files[i].name;
      tree_view_component.onclick = function () {
        console.log(focused_component_id);
      };

      if (i == id)
        tree_view_component.classList.add('focused');

      tree_view.appendChild(tree_view_component);
    }
  }

  function newFile(name = 'untitled', content) {
    let id = String(objectId());

    files[id] = {
      name: name,
      content: content
    };

    newTab(name, id);
    code_editor.setText(content);
    getGrammarStatus(id);
    createTreeView(id);
  }

  document.querySelector('.input-file').onchange = function(event) {
    let input = document.querySelector('.input-file'),
      reader = new FileReader();

    reader.onload = function() {
      newFile(input.files[0].name, reader.result.replace(/\r\n/g, '\n').split(/\n/g));
    };

    //for (let i in input.files)
    reader.readAsText(input.files[0]);
  };

  this.openFile = function(id) {
    code_editor.setText(files[id].content);

    getGrammarStatus(id);
    createTreeView(id);
  };

  this.newFile = newFile;

  this.removeFile = function(id) {
    delete files[id];
  };

  document.querySelector('.menu-bar__new-file').onclick = function() {
    code_editor__files.newFile('untitled', ['']);
  };

  document.querySelector('.menu-bar__open-file').onclick = function() {
    document.querySelector('.input-file').click();
  };

  document.querySelector('.menu-bar__close-tab').onclick = function() {
    document.querySelector('.tab.focused .tab__close').click();
  };

  document.querySelector('.menu-bar__close-all-tabs').onclick = function() {
    while (document.querySelector('.tab'))
      document.querySelector('.tab .tab__close').click();
  };
}
