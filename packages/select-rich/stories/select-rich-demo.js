import { html, css } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import '@lion/option/lion-option.js';

import '../lion-select-rich.js';
import '../lion-options.js';

class SelectRichDemo extends LionLitElement {
  static get styles() {
    return css`
      .demo-area {
        margin: 50px;
      }
    `;
  }

  static get properties() {
    return {
      colorList: Array,
      hideAdd: Boolean,
    };
  }

  constructor() {
    super();
    this.hideAdd = false;
    this.colorList = [
      {
        label: 'Red',
        value: 'red',
        checked: false,
      },
      {
        label: 'Hotpink',
        value: 'hotpink',
        checked: true,
      },
      {
        label: 'Teal',
        value: 'teal',
        checked: false,
      },
    ];
  }

  render() {
    return html`
      <div class="demo-area">
        <lion-select-rich label="Favorite color" name="color">
          <lion-options slot="input">
            ${this.colorList.map(
              colorObj => html`
                <lion-option .modelValue=${{ value: colorObj.value, checked: colorObj.checked }}
                  >${colorObj.label}</lion-option
                >
              `,
            )}
          </lion-options>
        </lion-select-rich>
        <br /><br />
        ${this.hideAdd
          ? html``
          : html`
              <button @click=${this._addBlue}>Add Blue</button>
            `}
      </div>
    `;
  }

  _addBlue() {
    this.hideAdd = true;
    const newColorList = [...this.colorList];
    newColorList.splice(1, 0, {
      label: 'Blue',
      value: 'blue',
      checked: false,
    });
    this.colorList = newColorList;
  }
}
customElements.define('select-rich-demo', SelectRichDemo);
