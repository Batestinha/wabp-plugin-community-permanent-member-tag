const { test } = require('node:test');
const assert = require('node:assert/strict');
const plugin = require('../dist/index.js').default;
const base = { pluginId: plugin.manifest.pluginId, scopeId: 'scope', chatId: 'group@g.us', receivedAt: new Date(), eventId: 'fixture-event', action: 'join', botIdentityIds: ['bot'], affectedIdentities: [{ identityId: 'bot' }] };

test('uses the stored member tag and preserves exempt groups', async () => {
  const hooks = plugin.registerHooks({ configFor: async () => ({ memberTag: 'Saved custom tag', exemptGroupChatIds: ['exempt@g.us'] }) });
  assert.deepEqual(await hooks.onGroupScopeCovered(base), [{ type: 'group.setMemberTag', groupWid: base.chatId, tag: 'Saved custom tag', reason: plugin.manifest.pluginId }]);
  assert.equal(await hooks.onGroupScopeCovered({ ...base, chatId: 'exempt@g.us' }), undefined);
});

test('only reapplies on bot arrivals when the scope setting allows it', async () => {
  const hooks = plugin.registerHooks({ configFor: async () => ({ memberTag: 'My tag' }) });
  assert.equal((await hooks.onParticipantChange(base)).length, 1);
  assert.equal(await hooks.onParticipantChange({ ...base, affectedIdentities: [{ identityId: 'other-person' }] }), undefined);
  assert.equal(await hooks.onParticipantChange({ ...base, action: 'leave' }), undefined);
  const disabled = plugin.registerHooks({ configFor: async () => ({ memberTag: 'My tag', applyOnBotJoin: false }) });
  assert.equal(await disabled.onParticipantChange(base), undefined);
});

test('resolves every covered group configuration independently without changing stored choices', async () => {
  const settings = { parent: { memberTag: 'Parent tag' }, child: { memberTag: 'Child tag' }, blank: { memberTag: '' } };
  const snapshot = structuredClone(settings);
  const hooks = plugin.registerHooks({ configFor: async scope => settings[scope], coveredGroupsForScope: async () => Object.keys(settings).map(scopeId => ({ scopeId, groupWid: scopeId + '@g.us' })) });
  const result = await hooks.onPluginJob({ ...base, jobName: 'reconcile-covered-groups' });
  assert.deepEqual(result.map(action => [action.groupWid, action.tag]), [['parent@g.us', 'Parent tag'], ['child@g.us', 'Child tag']]);
  assert.deepEqual(settings, snapshot);
  assert.equal(await hooks.onPluginJob({ ...base, jobName: 'unrelated-job' }), undefined);
});
