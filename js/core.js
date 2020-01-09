function Editor(query, options) {
  let container = document.querySelector(query),
    cursor_position = [0, -1],
    cursor_animation = false,
    selection = [
      [0, 0],
      [0, 0]
    ],
    click_position = 0,
    character_width = 0,
    text_data = [],
    tab_length = 2,
    font_size = 16,
    line_height = 24;

  this.getText = function() {
    return text_data;
  };

  this.setText = function(data) {
    document.querySelector('.editor__viewer .editor__viewer').innerHTML = '';
    document.querySelector('.editor__gutter-container').innerHTML = '';

    for (let i = 0, l = data.length; i < l; i++) {
      newSimpleLine();
    }

    text_data = data;

    renderer();
    cursor_position[0] = 0;
    cursor_position[1] = 0;
    lineFocus();
  }

  this.clear = function() {
    document.querySelector('.editor__viewer .editor__viewer').innerHTML = '';
    document.querySelector('.editor__gutter-container').innerHTML = '';
  };

  this.increaseFontSize = function() {
    font_size++;
    line_height = font_size * 1.5;

    document.documentElement.setAttribute('style',
      '--editor-font-size: ' + font_size + 'px;' +
      '--editor-line-height: ' + line_height + 'px;'
    );

    charResize();
    moveCursor();
  };

  this.decreaseFontSize = function() {
    font_size--;
    line_height = font_size * 1.5;

    document.documentElement.setAttribute('style',
      '--editor-font-size: ' + font_size + 'px;' +
      '--editor-line-height: ' + line_height + 'px;'
    );

    charResize();
    moveCursor();
  };

  /* -- GUTTER ------------------------------------------------------------ */

  let gutter = document.createElement('div');

  gutter.classList.add('editor__gutter-container');

  container.appendChild(gutter);

  function newGutterCell() {
    let cell = document.createElement('div');

    cell.innerHTML = document.querySelectorAll('.editor__line').length + 1;
    cell.classList.add('editor__gutter-cell');

    cell.index = function() {
      return Array.from(this.parentNode.children).indexOf(this);
    };

    gutter.appendChild(cell);
  }


  /* -- VIEWER ------------------------------------------------------------ */

  let viewer_container = document.createElement('div'),
    viewer = document.createElement('div');

  viewer_container.classList.add('editor__viewer');
  viewer.classList.add('editor__viewer');

  container.appendChild(viewer_container);
  viewer_container.appendChild(viewer);

  viewer.onmousedown = function(event) {
    if (event.button == 0) {
      event.preventDefault();

      window.addEventListener('selectstart', disableNativeSelection);

      if (event.target.classList.contains('editor__line')) {
        let line = event.target;

        click_position = Math.round((event.clientX - viewer_container.offsetLeft) / character_width);

        cursor_position[0] = click_position;
        cursor_position[1] = line.index();

        lineFocus();
      } else if (event.target.classList.contains('editor__viewer')) {
        click_position = Math.round((event.clientX - viewer_container.offsetLeft) / character_width);

        cursor_position[0] = click_position;
        cursor_position[1] = document.querySelector('.editor__line:last-child').index();

        lineFocus();
      }
    }
  };

  window.addEventListener('mouseup', function() {
    window.removeEventListener('selectstart', disableNativeSelection);

    if (!event.target.classList.contains('editor__viewer') && !event.target.classList.contains('editor__line'))
      lineBlur();
  });


  /* -- TEXTAREA ---------------------------------------------------------- */

  function convert(string) {
    let new_string = '',
      characters = ['<', '>'],
      new_characters = ['&lt;', '&gt;'];

    for (let i in string) {
      let character = string[i];

      if (characters.indexOf(character) != -1)
        character = new_characters[characters.indexOf(character)];

      new_string += character;
    }

    return new_string;
  }

  function renderer() {
    let lines = document.querySelectorAll('.editor__line');

    for (let i = 0, l = lines.length; i < l; i++)
      lines[i].innerHTML = convert(text_data[i]);
  }

  let textarea = document.createElement('textarea');

  textarea.classList.add('editor__textarea');

  textarea.oninput = function() {
    let line = document.querySelector('.editor__line.focused');

    text_data[line.index()] = this.value;

    renderer();

    cursor_position[0] = textarea.selectionEnd;
    moveCursor(cursor_position[0], cursor_position[1]);
  };

  textarea.onkeydown = function(event) {
    let line = document.querySelector('.editor__line.focused');

    if (event.keyCode == 8 && cursor_position[0] == 0 && typeof text_data[line.index() - 1] == 'string') {
      event.preventDefault();

      let new_cursor_position_x = text_data[line.index() - 1].length;

      text_data[line.index() - 1] += text_data[line.index()];
      removeLine(line.index());
      cursor_position[0] = new_cursor_position_x;
      textarea.selectionEnd = cursor_position[0];
      textarea.selectionStart = cursor_position[0];
      moveCursor();
    }

    if ([38, 40].indexOf(event.keyCode) != -1) {
      event.preventDefault();

      let lines = document.querySelectorAll('.editor__line');

      if (event.keyCode == 38 && lines[cursor_position[1] - 1])
        cursor_position[1]--;
      else if (event.keyCode == 40 && lines[cursor_position[1] + 1])
        cursor_position[1]++;

      lineFocus();
    }

    if ([37, 39].indexOf(event.keyCode) != -1) {
      event.preventDefault();

      let lines = document.querySelectorAll('.editor__line');

      if (event.keyCode == 37) {
        if (cursor_position[0] > 0)
          cursor_position[0]--;
        else if (document.querySelectorAll('.editor__line')[line.index() - 1]) {
          cursor_position[0] = text_data[line.index() - 1].length;
          cursor_position[1] = line.index() - 1;

          lineFocus();
        }
      } else if (event.keyCode == 39) {
        if (cursor_position[0] + 1 <= text_data[cursor_position[1]].length)
          cursor_position[0]++;
        else if (document.querySelectorAll('.editor__line')[line.index() + 1]) {
          cursor_position[0] = 0;
          cursor_position[1] = line.index() + 1;

          lineFocus();
        }
      }

      lineFocus();
    }

    if (event.keyCode == 13) {
      event.preventDefault();

      line.innerHTML = line.innerHTML.substring(0, cursor_position[0]);
      text_data[line.index()] = text_data[line.index()].substring(0, cursor_position[0]);
      textarea.value = textarea.value.substring(cursor_position[0], textarea.value.length);
      cursor_position[0] = 0;
      newLine(line.index() + 1);
    }

    if (event.keyCode == 9) {
      event.preventDefault();

      textarea.value += '&nbsp;';
    }

    renderer();
  };

  viewer_container.appendChild(textarea);


  /* -- CHARACTER SIZE ---------------------------------------------------- */

  let calculator = document.createElement('div');

  calculator.classList.add('editor__character-width');
  calculator.innerHTML = 'abcABC123';

  function charResize() {
    character_width = calculator.offsetWidth / 9.15;
  }

  viewer_container.appendChild(calculator);
  character_width = calculator.offsetWidth / 9.15;


  /* -- SELECTION --------------------------------------------------------- */

  /*
  function unselect() {
    for (let a = document.querySelectorAll('.editor__line.selected'), b = a.length, c = 0; c < b; c++)
      a[c].classList.remove('selected');

    for (let a = document.querySelectorAll('.editor__gutter-cell.selected'), b = a.length, c = 0; c < b; c++)
      a[c].classList.remove('selected');
  }

  function selectStart(event, options = {}) {
    if (event.target.classList.contains('editor__line') || event.target.classList.contains('editor__gutter-cell')) {
      unselect();
      selection[1][0] = event.target.index();

      if (options.started)
        selection[0][0] = event.target.index();
      else
        renderSelect(options.started);
    } else
      unfocus();
  }

  function renderSelect(started) {
    unselect();
    unfocus();

    for (let i = selection[0][0] > selection[1][0] ? selection[1][0] : selection[0][0], l = selection[0][0] > selection[1][0] ? selection[0][0] : selection[1][0]; i <= l; i++)
      document.querySelectorAll('.editor__line')[i].classList.add('selected');

    for (let i = selection[0][0] > selection[1][0] ? selection[1][0] : selection[0][0], l = selection[0][0] > selection[1][0] ? selection[0][0] : selection[1][0]; i <= l; i++)
      document.querySelectorAll('.editor__gutter-cell')[i].classList.add('selected');

    //moveCursor(0, selection[1][0] + ((selection[0][0] < selection[1][0] && (selection[1][0] != document.querySelectorAll('.editor__line').length - 1)) ? 1 : 0));
  }

  container.onmousedown = function(event) {
    if (event.button == 0) {
      window.addEventListener('selectstart', disableNativeSelection);

      selectStart(event, {
        started: true
      });

      container.addEventListener('mousemove', selectStart);
    }
  };

  window.onmouseup = function(event) {
    if (!event.target.classList.contains('editor__line') && !event.target.classList.contains('editor__gutter-cell')) {
      unselect();
      unfocus();
    }

    window.removeEventListener('selectstart', disableNativeSelection);
    container.removeEventListener('mousemove', selectStart);
  }*/


  /* -- CURSOR ------------------------------------------------------------ */

  let cursor = document.createElement('div'),
    cursor_event = new CustomEvent('cursormove', {
      detail: cursor_position
    });

  cursor.classList.add('editor__cursor');

  viewer_container.appendChild(cursor);

  function moveCursor(index) {
    let x = cursor_position[0] * character_width,
      y = cursor_position[1] * line_height;

    cursor.style.animation = 'none';

    if (cursor_animation) {
      clearTimeout(cursor_animation);
      cursor_animation = false;
    }

    cursor_animation = setTimeout(function() {
      cursor.style.animation = '';
    }, 400);

    document.querySelector('.editor__cursor').style.left = x + 'px';
    document.querySelector('.editor__cursor').style.top = y + 'px';

    window.dispatchEvent(cursor_event);
  }


  /* -- LINE -------------------------------------------------------------- */

  function newLine(index) {
    let line = document.createElement('div');

    line.classList.add('editor__line');
    line.innerHTML = textarea.value;

    line.index = function() {
      return Array.from(this.parentNode.children).indexOf(this);
    };

    newGutterCell();

    if (index)
      viewer.insertBefore(line, document.querySelectorAll('.editor__line')[index]);
    else
      viewer.appendChild(line);

    cursor_position[1]++;
    text_data.splice(line.index(), 0, textarea.value);
    lineFocus(line.index());
  }

  function newSimpleLine() {
    let line = document.createElement('div');

    line.classList.add('editor__line');
    line.innerHTML = textarea.value;

    line.index = function() {
      return Array.from(this.parentNode.children).indexOf(this);
    };

    newGutterCell();

    viewer.appendChild(line);
  }

  function removeLine(index) {
    if (document.querySelectorAll('.editor__line').length > 1) {
      cursor_position[1]--;

      text_data.splice(index, 1);

      lineFocus();

      document.querySelectorAll('.editor__line')[index].remove();
      document.querySelector('.editor__gutter-cell:last-child').remove();
    }
  }

  function lineBlur() {
    container.classList.remove('focused');

    if (document.querySelector('.editor__line.focused'))
      document.querySelector('.editor__line.focused').classList.remove('focused');

    if (document.querySelector('.editor__gutter-cell.focused'))
      document.querySelector('.editor__gutter-cell.focused').classList.remove('focused');
  }

  function lineFocus(options) {
    lineBlur();

    container.classList.add('focused');
    document.querySelectorAll('.editor__line')[cursor_position[1]].classList.add('focused');
    document.querySelectorAll('.editor__gutter-cell')[cursor_position[1]].classList.add('focused');

    textarea.value = text_data[cursor_position[1]];
    textarea.focus();
    textarea.selectionEnd = cursor_position[0];
    textarea.selectionStart = cursor_position[0];
    cursor_position[0] = textarea.selectionEnd;

    moveCursor();
  }

  //for (let i = 0; i < 10; i++)
  //newLine();
}
