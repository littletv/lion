import { expect, html, fixture } from '@open-wc/testing';

import { DynamicOverlayController } from '../src/DynamicOverlayController.js';
import { GlobalOverlayController } from '../src/GlobalOverlayController.js';
import { LocalOverlayController } from '../src/LocalOverlayController.js';

function expectGlobalShown() {
  expect(document.body.querySelector('.global-overlays')).lightDom.to.equal(/* html */ `
    <p>Content</p>
  `);
}
function expectGlobalHidden() {
  expect(document.body.querySelectorAll('.global-overlays').length).to.equal(0);
}

function expectLocalShown(el) {
  expect(el).dom.to.equal(/* html */ `
    <div>
      <div style="display: inline-block"><button>Invoker</button></div>
      <div style="display: inline-block">Content</div>
    </div>
  `);
}
function expectLocalHidden(el) {
  expect(el).dom.to.equal(/* html */ `
    <div>
      <div style="display: inline-block"><button>Invoker</button></div>
      <div style="display: inline-block"></div>
    </div>
  `);
}

function expectToBeHidden(what, el) {
  if (what.indexOf('global') === 0) {
    expectGlobalHidden();
  } else {
    expectLocalHidden(el);
  }
}

function expectToBeShown(what, el) {
  if (what.indexOf('global') === 0) {
    expectGlobalShown();
  } else {
    expectLocalShown(el);
  }
}

function canSwitchBetween(from, to, msg, options) {
  it(`can switch from ${from} to ${to} and back ${msg} while being hidden`, async () => {
    const ctrl = new DynamicOverlayController();
    if (from.indexOf('global') === 0) {
      ctrl.add(from, new GlobalOverlayController(options));
    } else {
      ctrl.add(from, new LocalOverlayController(options));
    }
    if (to.indexOf('global') === 0) {
      ctrl.add(to, new GlobalOverlayController(options));
    } else {
      ctrl.add(to, new LocalOverlayController(options));
    }

    const el = await fixture(html`
      <div>
        ${ctrl.invoker} ${ctrl.content}
      </div>
    `);

    expectToBeHidden(from, el);
    expectToBeHidden(to, el);

    await ctrl.switchTo(to);
    await ctrl.show();
    expectToBeHidden(from, el);
    expectToBeShown(to, el);

    await ctrl.hide();
    await ctrl.switchTo(from);
    await ctrl.show();
    expectToBeShown(from, el);
    expectToBeHidden(to, el);
  });
}

describe('Dynamic Global and Local Overlay Controller switching', () => {
  let nodesOptions;
  let templatesOptions;

  beforeEach(async () => {
    const invokerNode = await fixture('<button>Invoker</button>');
    const contentNode = await fixture(`<p>Content</p>`);

    nodesOptions = {
      invokerNode,
      contentNode,
    };
    templatesOptions = {
      contentTemplate: () => html`
        <p>Content</p>
      `,
      invokerTemplate: () => html`
        <button>Invoker</button>
      `,
    };
  });

  describe('switching', () => {
    canSwitchBetween('local', 'global', 'with templates', templatesOptions);
    canSwitchBetween('local', 'local1', 'with templates', templatesOptions);
    canSwitchBetween('global', 'local', 'with templates', templatesOptions);
    canSwitchBetween('global', 'global1', 'with templates', templatesOptions);

    canSwitchBetween('local', 'global', 'with nodes', nodesOptions);
    canSwitchBetween('local', 'local1', 'with nodes', nodesOptions);
    canSwitchBetween('global', 'local', 'with nodes', nodesOptions);
    canSwitchBetween('global', 'global1', 'with nodes', nodesOptions);
  });
});
