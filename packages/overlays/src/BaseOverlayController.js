import { render } from '@lion/core';

/**
 * This is the interface for a controller
 */
export class BaseOverlayController {
  get isShown() {
    return this.__isShown;
  }

  set isShown(value) {
    this.__isShown = value;
  }

  get content() {
    return this.__content;
  }

  set content(value) {
    this.__content = value;
  }

  get contentTemplate() {
    return this.__contentTemplate;
  }

  set contentTemplate(value) {
    if (typeof value !== 'function') {
      throw new Error('.contentTemplate needs to be a function');
    }
    this.__contentTemplate = value;
    if (!this.content) {
      this.content = document.createElement('div');
    }
    this.__renderTemplate();
  }

  get contentData() {
    return this.__contentData;
  }

  set contentData(value) {
    if (!this.contentTemplate) {
      throw new Error('.contentData can only be used if there is a .contentTemplate function');
    }
    this.__contentData = value;
    this.__renderTemplate();
  }

  get contentNode() {
    return this.__contentNode;
  }

  set contentNode(value) {
    this.__contentNode = value;
    this.content = value;
  }

  constructor(params = {}) {
    this.__fakeExtendsEventTarget();
    this.isShown = false;

    this.__setupContent(params);
  }

  async show() {
    if (this.isShown === true) {
      return;
    }
    this.isShown = true;
    this.dispatchEvent(new Event('show'));
  }

  async hide() {
    if (this.isShown === false) {
      return;
    }
    this.isShown = false;
    this.dispatchEvent(new Event('hide'));
  }

  // eslint-disable-next-line class-methods-use-this
  switchIn() {}

  // eslint-disable-next-line class-methods-use-this
  switchOut() {}

  __setupContent(params) {
    if (params.contentTemplate && params.contentNode) {
      throw new Error('You can only provide a .contentTemplate or a .contentNode but not both');
    }
    if (params.contentTemplate) {
      this.contentTemplate = params.contentTemplate;
    }
    if (params.contentNode) {
      this.contentNode = params.contentNode;
    }
  }

  __renderTemplate() {
    render(this.contentTemplate(this.contentData), this.content);
    this.__contentNode = this.content.firstElementChild;
  }

  // TODO: this method has to be removed when EventTarget polyfill is available on IE11
  __fakeExtendsEventTarget() {
    const delegate = document.createDocumentFragment();
    ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
      this[funcName] = (...args) => delegate[funcName](...args);
    });
  }
}
