import type { HookPlugin as BotPlugin } from '../../../../packages/plugin-sdk/src/hook-plugin';
import { createCommunityPermanentMemberTagHooks } from './hooks';
import { communityPermanentMemberTagManifest } from './manifest';

export const communityPermanentMemberTagPlugin: BotPlugin = {
  manifest: communityPermanentMemberTagManifest,
  registerHooks(context) {
    return createCommunityPermanentMemberTagHooks(context);
  }
};

export default communityPermanentMemberTagPlugin;

