import { expect, html, fixture } from '@open-wc/testing';
import sinon from 'sinon';

export const runBaseOverlaySuite = (generateFn, { name }) => {
  describe(`${name}`, () => {
    describe('shown', () => {
      it('has .isShown which defaults to false', () => {
        const ctrl = generateFn();
        expect(ctrl.isShown).to.be.false;
      });

      it('has async show() which shows the overlay', async () => {
        const ctrl = generateFn();
        await ctrl.show();
        expect(ctrl.isShown).to.be.true;
        expect(ctrl.show()).to.be.instanceOf(Promise);
      });

      it('has async hide() which hides the overlay', async () => {
        const ctrl = generateFn();
        await ctrl.hide();
        expect(ctrl.isShown).to.be.false;
        expect(ctrl.hide()).to.be.instanceOf(Promise);
      });

      it('fires "show" event once overlay becomes shown', async () => {
        const showSpy = sinon.spy();
        const ctrl = generateFn();
        ctrl.addEventListener('show', showSpy);
        await ctrl.show();
        expect(showSpy.callCount).to.equal(1);
        await ctrl.show();
        expect(showSpy.callCount).to.equal(1);
      });

      it('fires "hide" event once overlay becomes hidden', async () => {
        const hideSpy = sinon.spy();
        const ctrl = generateFn();
        ctrl.addEventListener('hide', hideSpy);
        await ctrl.show();
        await ctrl.hide();
        expect(hideSpy.callCount).to.equal(1);
        await ctrl.hide();
        expect(hideSpy.callCount).to.equal(1);
      });
    });

    describe('content', () => {
      it('has .content<Node> as a wrapper for a render target', () => {
        const ctrl = generateFn();
        expect(ctrl.content).dom.to.equal('<div style="display: inline-block;></div>');
      });

      it('has .contentTemplate<Function> to render into .content', () => {
        const ctrl = generateFn();
        ctrl.contentTemplate = () => html`
          <p>my content</p>
        `;
        expect(ctrl.content).dom.to.equal(
          '<div style="display: inline-block;><p>my content</p></div>',
        );
      });

      it('has sync() to update the overlay content', () => {
        const ctrl = generateFn();
        ctrl.contentTemplate = data => html`
          <p>my content - ${data}</p>
        `;
        ctrl.sync({ data: 'my data' });
        expect(ctrl.content).dom.to.equal(
          '<div style="display: inline-block;><p>my content - my data</p></div>',
        );
      });

      it('accepts an .contentNode<Node> to directly set content', async () => {
        const ctrl = generateFn();
        ctrl.contentNode = await fixture('<p>direct node</p>');
        expect(ctrl.content).dom.to.equal('<p>direct node</p>');
      });

      it('throws if sync() gets used without a .contentTemplate', () => {
        const ctrl = generateFn();
        expect(() => ctrl.sync()).to.throw(
          '.sync() can only be used if there is a .contentTemplate',
        );
      });
    });

    describe('invoker', () => {
      // same as content just with invoker
    });

    describe('switching', () => {
      it('has a switchOut/In function', () => {
        const ctrl = generateFn();
        expect(ctrl.switchIn).to.be.a('function');
        expect(ctrl.switchOut).to.be.a('function');
      });
    });
  });
};
