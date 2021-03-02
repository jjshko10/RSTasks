const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    display: null
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    secondLang: false,
    shift: false,
    cursorPosition: 0
  },

  init() {
    this.elements.display = document.querySelector(".use-keyboard-input");
  
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    document.body.appendChild(this.elements.main);
    this.elements.main.appendChild(this.elements.keysContainer);

   document.querySelectorAll(".use-keyboard-input").forEach((element) => {
     element.addEventListener("blur", (event) => {
       event.preventDefault();
       element.focus();
     });

     element.addEventListener("focus", () => {
       this.open(element.value, (currentValue) => {
         element.value = currentValue;
       });
     });

     element.addEventListener("keydown", (event) => {
       this._triggerKbKeys(event);
     });

     element.addEventListener("keyup", (event) => {
       this._triggerKbKeys(event);
     });

     document.querySelector(".keyboard").addEventListener("mouseenter", () => {
       this.properties.value = element.value;
       this.properties.cursorPosition = this.elements.display.selectionStart;
     });
   });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    let keyLayout = [];

    if (!this.properties.secondLang) {
      if (!this.properties.shift) {
        keyLayout = [
          "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", "br",
          "caps", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "br",
          "shift","a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter", "br",
          "done", "lang", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "br",
          "space"
        ];
      } else {
        keyLayout = [
          "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace", "br",
          "caps", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "{", "}", "br",
          "shift","a", "s", "d", "f", "g", "h", "j", "k", "l", ":", "\"", "enter", "br",
          "done", "lang", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "br",
          "space"
        ];
      }
    } else {
      if (!this.properties.shift) {
        keyLayout = [
          "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace", 'br',
          "caps", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "br",
          "shift", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter", "br",
          "done", "lang", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".", "br",
          "space"
        ];
      } else {
        keyLayout = [
          "ё", "!", '"', "№", ";", "%", ":", "?", "*", "(", ")", "backspace", "br",
          "caps", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "br",
          "shift", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter", "br",
          "done", "lang", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ",", "br",
          "space"
        ];
      }
    }

    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const insertLineBreak = ["br"].indexOf(key) !== -1;
      const keyElement = document.createElement("button");
      
      keyElement.setAttribute("type", "button");
      keyElement.setAttribute("data-code", key);
      keyElement.classList.add("keyboard__key");

      const isActive = (prop, activeClass = "keyboard__key--active") => {
        if (prop === true) {
          keyElement.classList.add(activeClass);
        } else {
          keyElement.classList.remove(activeClass);
        }
      };

      switch (key) {
        case "br":
          keyElement.classList.add("unvisible");
          keyElement.textContent = "";
          break;

        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this._backspace();
          });
        break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            isActive(this.properties.capsLock);
          });
        break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("arrow_circle_up");

          isActive(this.properties.shift);

          keyElement.addEventListener("click", () => {
            this._toggleShift();
          });
        break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this._enter();
          });
        break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this._space();
          });
        break;

        case 'lang':
          keyElement.innerHTML = (this.properties.secondLang === false) ? 'en' : 'ru';

          keyElement.addEventListener('click', () => {
            this._toggleLang();
          });
        break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            this._stringRenew(key);
            this._triggerEvent("oninput");
            this._cursorMove("get");
          });
        break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _heightControl() {
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.capsLock === this.properties.shift) {
          key.textContent = key.textContent.toLowerCase();
        } else {
          key.textContent = key.textContent.toUpperCase();
        }
      }
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this._heightControl();
  },

   _toggleLang() {
    this.properties.secondLang = !this.properties.secondLang;

    this.elements.keysContainer.innerHTML = '';
    this.elements.keysContainer.append(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this._heightControl();
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    this.elements.keysContainer.innerHTML = '';
    this.elements.keysContainer.append(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this._heightControl();
  },

   _stringRenew(char) {
    const newText = (this.properties.capsLock === this.properties.shift)
      ? char.toLowerCase()
      : char.toUpperCase();

    this.properties.value = this.properties.value.substring(0, this.properties.cursorPosition)
      + newText
      + this.properties.value.substring(this.properties.cursorPosition);

    this.properties.cursorPosition += 1;
  },

  _cursorMove(param) {
    if (param === 'set') {
      this.properties.cursorPosition = this.elements.display.selectionStart = this.elements.display.selectionEnd
    }
    if (param === 'get') {
      this.elements.display.selectionStart = this.elements.display.selectionEnd = this.properties.cursorPosition;
    }
  },

  _backspace() {
    this.properties.value = this.properties.value.substring(0, this.properties.cursorPosition - 1)
              + this.properties.value.substring(this.properties.cursorPosition);

    this.properties.cursorPosition = (this.properties.cursorPosition !== 0)
      ? this.properties.cursorPosition - 1
      : 0;

    this._triggerEvent('oninput');
    this._cursorMove('get');
  },

  _enter() {
    this.properties.value = this.properties.value.substring(0, this.properties.cursorPosition)
      + '\n'
      + this.properties.value.substring(this.properties.cursorPosition);

    this._triggerEvent('oninput');
    this.properties.cursorPosition += 1;
    this._cursorMove('get');
  },

  _space() {
    this.properties.value = this.properties.value.substring(0, this.properties.cursorPosition)
      + ' '
      + this.properties.value.substring(this.properties.cursorPosition);

    this._triggerEvent('oninput');
    this.properties.cursorPosition += 1;
    this._cursorMove('get');
  },


  _triggerKbKeys(event) {
    if (/F[0-9]{1,2}/g.test(event.key)) return;

    const simbolKey = (event.key !== '\"')
      ? document.querySelector(`[data-code = "${event.key.toLowerCase()}"]`)
      : document.querySelector(`[data-code = '\"']`);

    const capsKey = document.querySelector(`button[data-code = 'caps']`);
    const shiftKey = document.querySelector(`button[data-code = 'shift']`);
    const backspaceKey = document.querySelector(`button[data-code = 'backspace']`);
    const enterKey = document.querySelector(`button[data-code = 'enter']`);
    const spaceKey = document.querySelector(`button[data-code = 'space']`);

    this._cursorMove('get');

    if (event.type === 'keydown') {
      event.preventDefault();

      switch (event.key) {
        case 'Shift':
          shiftKey.classList.add('active');
          if (event.repeat) return;

          this._toggleShift();
        break;

        case 'CapsLock':
          this._toggleCapsLock();

          (this.properties.capsLock)
            ? capsKey.classList.add('keyboard__key--active')
            : capsKey.classList.remove('keyboard__key--active');

          capsKey.classList.add('active');
        break;

        case 'Backspace':
          backspaceKey.classList.add('active');
          this._backspace();
        break;

        case 'Enter':
          enterKey.classList.add('active');
          this._enter();
        break;

        case ' ':
          spaceKey.classList.add('active');
          this._space();
        break;

        default:
          if (simbolKey) {
            const text = simbolKey.textContent;

            this._stringRenew(text);
            this._triggerEvent('oninput');
            this._cursorMove('get');

            simbolKey.classList.add('active');
          }
        break;
      }
    }


    if (event.type === 'keyup') {
      if (event.key === 'shift') {
        this._toggleShift();

      } else {
        event.preventDefault();
        const activeKey = document.querySelector('.active');
        (activeKey) ? activeKey.classList.remove('active') : '';
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
});