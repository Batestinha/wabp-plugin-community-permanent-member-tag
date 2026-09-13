import type { PluginAction } from '@wabs/plugin-sdk/actions';
import type { PluginHookContext as PluginRuntimeContext } from '@wabs/plugin-sdk/hook-plugin';
import type { PluginJobEvent, PluginParticipantChangeEvent, PluginRuntimeHooks } from '@wabs/plugin-sdk/hooks';
import {
  COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID,
  parseCommunityPermanentMemberTagConfig
} from './config';

const BOT_ARRIVAL_ACTIONS = new Set<PluginParticipantChangeEvent['action']>(['join', 'add', 'membership_approved']);
export const COMMUNITY_MEMBER_TAG_RECONCILE_JOB = 'reconcile-covered-groups';

export function createCommunityPermanentMemberTagHooks(context: PluginRuntimeContext): PluginRuntimeHooks {
  return {
    async onRuntimeReady(event) {
      if (!event.firstReadyForIdentity) return;
      if (!context.listEnabledScopes || !context.enqueuePluginJob) {
        throw new Error('Member tag reconciliation requires host-owned scope and queue capabilities.');
      }
      for (const scope of await context.listEnabledScopes()) {
        await context.enqueuePluginJob({ jobName: COMMUNITY_MEMBER_TAG_RECONCILE_JOB,
          scopeId: scope.scopeId, payload: { trigger: 'runtime-ready' } });
      }
    },
    async onGroupScopeCovered(event) {
      const config = parseCommunityPermanentMemberTagConfig(await context.configFor(event.scopeId));
      if (!config.memberTag.trim()) {
        return;
      }
      if (config.exemptGroupChatIds.includes(event.chatId)) {
        return;
      }
      return [memberTagAction(event.chatId, config.memberTag)];
    },

    async onPluginJob(job) {
      if (job.jobName !== COMMUNITY_MEMBER_TAG_RECONCILE_JOB) {
        return;
      }
      return reconcileCoveredGroups(context, job);
    },

    async onParticipantChange(event) {
      if (!BOT_ARRIVAL_ACTIONS.has(event.action)) {
        return;
      }
      if (!eventBotWasAffected(event)) {
        return;
      }
      const config = parseCommunityPermanentMemberTagConfig(await context.configFor(
        event.scopeId,
        event.actorIdentity?.identityId
      ));
      if (!config.applyOnBotJoin || !config.memberTag.trim()) {
        return;
      }
      if (config.exemptGroupChatIds.includes(event.chatId)) {
        return;
      }
      return [memberTagAction(event.chatId, config.memberTag)];
    }
  };
}

async function reconcileCoveredGroups(context: PluginRuntimeContext, job: PluginJobEvent): Promise<PluginAction[] | void> {
  if (!context.coveredGroupsForScope) {
    return;
  }
  const groups = await context.coveredGroupsForScope(job.scopeId);
  const actions: PluginAction[] = [];
  for (const group of groups) {
    const config = parseCommunityPermanentMemberTagConfig(await context.configFor(group.scopeId));
    if (!config.memberTag.trim()) {
      continue;
    }
    if (config.exemptGroupChatIds.includes(group.groupWid)) {
      continue;
    }
    actions.push(memberTagAction(group.groupWid, config.memberTag));
  }
  return actions;
}

export function memberTagAction(groupWid: string, tag: string): PluginAction {
  return {
    type: 'group.setMemberTag',
    groupWid,
    tag,
    reason: COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID
  };
}

function eventBotWasAffected(event: PluginParticipantChangeEvent): boolean {
  const botIdentityIds = new Set(event.botIdentityIds);
  if (botIdentityIds.size === 0) {
    return false;
  }
  return event.affectedIdentities.some((identity) => botIdentityIds.has(identity.identityId));
}
