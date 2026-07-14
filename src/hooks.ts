import type { PluginAction } from '../../../platform/pluginRuntime/runtime/pluginActionTypes';
import type { PluginRuntimeContext } from '../../../platform/pluginRuntime/runtime/pluginRuntimeContext';
import type { PluginParticipantChangeEvent, PluginRuntimeHooks } from '../../../platform/pluginRuntime/types';
import {
  COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID,
  parseCommunityPermanentMemberTagConfig
} from './config';

const BOT_ARRIVAL_ACTIONS = new Set<PluginParticipantChangeEvent['action']>(['join', 'add', 'membership_approved']);

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
