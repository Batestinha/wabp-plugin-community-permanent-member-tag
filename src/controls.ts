import { defineControl } from '../../../../packages/plugin-sdk/src/controls';
import type { ControlDescriptor, ControlSchemaMetadata, ControlUiHint } from '../../../../packages/plugin-sdk/src/controls-types';
import { COMMUNITY_PERMANENT_MEMBER_TAG_MAX_LENGTH, COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID } from './config';

function control(
  path: string,
  label: string,
  description: string,
  order: number,
  schema: ControlSchemaMetadata,
  ui: ControlUiHint,
  defaultValue?: unknown
): ControlDescriptor {
  return defineControl({
    id: `plugin.${COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID}.${path}`,
    label,
    description,
    plane: 'plugin-scope-config',
    domain: 'official-plugin-settings',
    section: 'Permanent Member Tag',
    order,
    visibility: 'bot_admin',
    configurable: true,
    storage: { kind: 'plugin-scope-config', pluginId: COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID, path },
    schema,
    ui: { helpText: description, ...ui },
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    restartRequirement: 'NO_RESTART',
    dangerous: false,
    sensitivity: { sensitive: false, redact: 'none' },
    auditAction: 'operator_console.plugin_config.update',
    relatedCommandIds: [],
    relatedActionIds: []
  });
}

export const communityPermanentMemberTagControls: ControlDescriptor[] = [
  control('memberTag', 'Member tag', 'Bot member tag to apply in covered WhatsApp groups.', 20, {
    type: 'string',
    max: COMMUNITY_PERMANENT_MEMBER_TAG_MAX_LENGTH
  }, { widget: 'text' }, ''),
  control('applyOnBotJoin', 'Apply when bot joins', 'Apply the configured tag whenever WhatsApp reports the bot joined a covered group.', 30, { type: 'boolean' }, { widget: 'toggle' }, true),
  control('exemptGroupChatIds', 'Exempt groups', 'Covered group chat IDs where the plugin should not set the bot member tag.', 40, { type: 'array', items: { type: 'string' } }, { widget: 'tags' }, [])
];
