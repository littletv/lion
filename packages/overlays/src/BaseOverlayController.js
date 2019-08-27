/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */

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
    this.__contentTemplate = value;
  }

  get contentNode() {
    return this.__contentNode;
  }

  set contentNode(value) {
    this.__contentNode = value;
  }

  constructor() {
    this.isShown = false;
    // TODO: do actual setup for templates/nodes
  }

  async show() {}

  async hide() {}

  sync() {}

  syncInvoker() {}

  switchIn() {}

  switchOut() {}
}
