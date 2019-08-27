import { runBaseOverlaySuite } from '../test-suites/BaseOverlayController.suite.js';
import { BaseOverlayController } from '../src/BaseOverlayController.js';

runBaseOverlaySuite((...args) => new BaseOverlayController(...args), {
  name: 'BaseOverlayController',
});
