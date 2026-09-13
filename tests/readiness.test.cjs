const assert = require('node:assert/strict');
const { test } = require('node:test');
const plugin = require('../dist').default;

test('reconciles enabled scopes once at initial readiness using only the host queue', async () => {
  const queued = [];
  const hooks = plugin.registerHooks({
    listEnabledScopes: async () => [{ scopeId: 'scope-fixture' }],
    enqueuePluginJob: async job => queued.push(job)
  });
  await hooks.onRuntimeReady({ firstReadyForIdentity: false });
  assert.deepEqual(queued, []);
  await hooks.onRuntimeReady({ firstReadyForIdentity: true });
  assert.deepEqual(queued, [{ jobName: 'reconcile-covered-groups', scopeId: 'scope-fixture', payload: { trigger: 'runtime-ready' } }]);
});
