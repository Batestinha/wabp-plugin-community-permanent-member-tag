import type { PluginManifest } from '../../../platform/pluginRuntime/manifest';
import { communityPermanentMemberTagConfigSchema, COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID } from './config';
import { communityPermanentMemberTagMessages } from './messages';

export const communityPermanentMemberTagManifest: PluginManifest = {
  pluginId: COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID,
  kind: 'managed_group',
  version: '0.1.0',
  coreApiRange: '>=0.2.0',
  messageNamespace: COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID,
  descriptionKey: 'official.community-permanent-member-tag.description',
  defaultMessages: communityPermanentMemberTagMessages,
  commands: [],
  eventSubscriptions: ['participant.change'],
  requiredPermissions: ['plugin.configure'],
  requiredBotCapabilities: [],
  configSchema: communityPermanentMemberTagConfigSchema,
  dangerousActions: ['group.setMemberTag'],
  backgroundJobs: [],
  cancellation: { workflows: [] },
  assistant: {
    summary: 'Keeps the bot per-group WhatsApp member tag aligned with an operator-configured scope value.',
    useCases: [
      'Explain the configured bot member tag for a managed scope.',
      'Apply the configured tag retroactively across groups covered by a scope.',
      'Keep the bot tag consistent when the bot joins a newly covered group.'
    ],
    prerequisites: [
      'The plugin must be enabled in the target scope.',
      'The live bot runtime must expose the private group member tag transport bridge.',
      'The bot must be a member of each target WhatsApp group.'
    ],
    limitations: [
      'The WhatsApp Web member tag setter is private and may be unavailable after WhatsApp Web updates.',
      'This plugin sets only the bot account member tag, not tags for other group members.'
    ]
  }
};
