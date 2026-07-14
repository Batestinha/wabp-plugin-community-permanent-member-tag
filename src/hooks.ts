import type { PluginAction } from '../../../platform/pluginRuntime/runtime/pluginActionTypes';
import type { PluginRuntimeContext } from '../../../platform/pluginRuntime/runtime/pluginRuntimeContext';
import type { PluginJobEvent, PluginParticipantChangeEvent, PluginRuntimeHooks } from '../../../platform/pluginRuntime/types';
import {
  COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID,
  parseCommunityPermanentMemberTagConfig
} from './config';

const BOT_ARRIVAL_ACTIONS = new Set<PluginParticipantChangeEvent['action']>(['join', 'add', 'membership_approved']);
export const COMMUNITY_MEMBER_TAG_RECONCILE_JOB = 'reconcile-covered-groups';

export function createCommunityPermanentMemberTagHooks(context: PluginRuntimeContext): PluginRuntimeHooks {
  return {
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
      const config = parseCommunityPermanentMemberTagConfig(await context.configFor(event.scopeId, event.actorWid));
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
  const botWids = new Set([
    event.botWid,
    ...(event.botWids ?? [])
  ].filter((value): value is string => Boolean(value)));
  if (botWids.size === 0) {
    return false;
  }
  return event.affectedWids.some((wid) => botWids.has(wid));
}
