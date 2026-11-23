import type { MessageCatalog } from '@wabs/plugin-sdk/i18n';

export const communityPermanentMemberTagMessages: MessageCatalog = {
  'official.community-permanent-member-tag.description': 'Keeps the bot’s own WhatsApp member tag consistent across selected groups. It applies the configured tag when a group comes into scope and can reapply it when the bot joins.',
  'official.community-permanent-member-tag.help.feature.title': 'Sticky Member Tags',
  'official.community-permanent-member-tag.help.feature.summary': 'Set the bot’s member tag for the groups in a scope and choose which groups are exempt.',
  'official.community-permanent-member-tag.help.sync.title': 'Sync the bot member tag',
  'official.community-permanent-member-tag.help.sync.summary': 'Apply the configured scope tag when groups are covered or the bot joins.',
  'official.community-permanent-member-tag.help.sync.instruction': 'This feature runs automatically; administrators set the label and exemptions in the operator console.'
};
