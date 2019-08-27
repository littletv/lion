import { expect, html, fixture } from '@open-wc/testing';
import sinon from 'sinon';

export const runBaseOverlaySuite = (generateCtrl, { name }) => {
  describe(`${name}`, () => {
    describe('shown', () => {
      it('has .isShown which defaults to false', () => {
        const ctrl = generateCtrl();
        expect(ctrl.isShown).to.be.false;
      });

      it('has async show() which shows the overlay', async () => {
        const ctrl = generateCtrl();
        await ctrl.show();
        expect(ctrl.isShown).to.be.true;
        expect(ctrl.show()).to.be.instanceOf(Promise);
      });

      it('has async hide() which hides the overlay', async () => {
        const ctrl = generateCtrl();
        await ctrl.hide();
        expect(ctrl.isShown).to.be.false;
        expect(ctrl.hide()).to.be.instanceOf(Promise);
      });

      it('fires "show" event once overlay becomes shown', async () => {
        const showSpy = sinon.spy();
        const ctrl = generateCtrl();
        ctrl.addEventListener('show', showSpy);
        await ctrl.show();
        expect(showSpy.callCount).to.equal(1);
        await ctrl.show();
        expect(showSpy.callCount).to.equal(1);
      });

      it('fires "hide" event once overlay becomes hidden', async () => {
        const hideSpy = sinon.spy();
        const ctrl = generateCtrl();
        ctrl.addEventListener('hide', hideSpy);
        await ctrl.show();
        await ctrl.hide();
        expect(hideSpy.callCount).to.equal(1);
        await ctrl.hide();
        expect(hideSpy.callCount).to.equal(1);
      });
    });

    describe('.contentTemplate', () => {
      it('has .content<Node> as a wrapper for a render target', () => {
        const ctrl = generateCtrl({
          contentTemplate: () => html``,
        });
        expect(ctrl.content).dom.to.equal('<div></div>');
      });

      it('throws if trying to assign a non function value to .contentTemplate', () => {
        const ctrl = generateCtrl();
        expect(() => {
          ctrl.contentTemplate = '';
        }).to.throw('.contentTemplate needs to be a function');
      });

      it('has .contentTemplate<Function> to render into .content', () => {
        const ctrl = generateCtrl({
          contentTemplate: () => html`
            <p>my content</p>
          `,
        });
        expect(ctrl.content).dom.to.equal('<div><p>my content</p></div>');
      });

      it('has .contentData which triggers a updates of the overlay content', () => {
        const ctrl = generateCtrl({
          contentTemplate: ({ username = 'default user' } = {}) => html`
            <p>my content - ${username}</p>
          `,
        });
        expect(ctrl.content).dom.to.equal('<div><p>my content - default user</p></div>');

        ctrl.contentData = { username: 'foo user' };
        expect(ctrl.content).dom.to.equal('<div><p>my content - foo user</p></div>');
      });
    });

    describe('.contentNode', () => {
      it('accepts an .contentNode<Node> to directly set content', async () => {
        const ctrl = generateCtrl({
          contentNode: await fixture('<p>direct node</p>'),
        });
        expect(ctrl.content).dom.to.equal('<p>direct node</p>');
      });

      it('throws if .contentData gets used without a .contentTemplate', () => {
        const ctrl = generateCtrl();
        expect(() => {
          ctrl.contentData = {};
        }).to.throw('.contentData can only be used if there is a .contentTemplate');
      });
    });

    describe('setup', () => {
      it('throws if .contentTemplate and .contentNode get passed on', async () => {
        const node = await fixture('<p>direct node</p>');
        expect(() => {
          generateCtrl({
            contentTemplate: () => '',
            contentNode: node,
          });
        }).to.throw('You can only provide a .contentTemplate or a .contentNode but not both');
      });
    });

    describe('invoker', () => {
      // same as content just with invoker
    });

    describe('switching', () => {
      it('has a switchOut/In function', () => {
        const ctrl = generateCtrl();
        expect(ctrl.switchIn).to.be.a('function');
        expect(ctrl.switchOut).to.be.a('function');
      });
    });
  });
};
