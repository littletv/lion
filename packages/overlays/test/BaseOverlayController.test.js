import { runBaseOverlaySuite } from '../test-suites/BaseOverlayController.suite.js';
import { BaseOverlayController } from '../src/BaseOverlayController.js';

runBaseOverlaySuite(() => new BaseOverlayController(), {
  name: 'BaseOverlayController',
});
