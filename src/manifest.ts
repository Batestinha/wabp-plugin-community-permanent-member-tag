import type { PluginManifest } from '@wabs/plugin-sdk/manifest';
import { communityPermanentMemberTagConfigSchema, COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID } from './config';
import { communityPermanentMemberTagMessages } from './messages';

export const communityPermanentMemberTagManifest: PluginManifest = {
  pluginId: COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID,
  kind: 'managed_group',
  version: '0.1.2',
  coreApiRange: '^0.3.1',
  messageNamespace: COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID,
  descriptionKey: 'official.community-permanent-member-tag.description',
  defaultMessages: communityPermanentMemberTagMessages,
  commands: [],
  help: {
    featureId: 'member-tags',
    titleKey: 'official.community-permanent-member-tag.help.feature.title',
    summaryKey: 'official.community-permanent-member-tag.help.feature.summary',
    order: 90,
    aliases: ['member tag', 'community tag'],
    topics: [{
      topicId: 'sync-member-tag',
      titleKey: 'official.community-permanent-member-tag.help.sync.title',
      summaryKey: 'official.community-permanent-member-tag.help.sync.summary',
      instructionKeys: ['official.community-permanent-member-tag.help.sync.instruction'],
      keywords: ['tag', 'label', 'community', 'bot'],
      availability: { invocation: 'either', permission: 'plugin.configure' }
    }]
  },
  eventSubscriptions: ['participant.change', 'group.scope.covered', 'plugin.job'],
  requiredPermissions: ['plugin.configure'],
  requiredBotCapabilities: [],
  configSchema: communityPermanentMemberTagConfigSchema,
  dangerousActions: ['group.setMemberTag'],
  backgroundJobs: ['reconcile-covered-groups'],
  cancellation: { workflows: [] },
  assistant: {
    summary: 'Keeps the bot per-group WhatsApp member tag aligned with an operator-configured scope value.',
    useCases: [
      'Explain the configured bot member tag for a managed scope.',
      'Apply the configured tag automatically when a group becomes covered by a managed scope.',
      'Reconcile already-covered groups automatically when the bot runtime starts.',
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
