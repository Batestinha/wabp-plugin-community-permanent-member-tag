import type { BotPlugin } from '../../../platform/pluginRuntime/types';
import { createCommunityPermanentMemberTagHooks } from './hooks';
import { communityPermanentMemberTagManifest } from './manifest';

export const communityPermanentMemberTagPlugin: BotPlugin = {
  manifest: communityPermanentMemberTagManifest,
  registerHooks(context) {
    return createCommunityPermanentMemberTagHooks(context);
  }
};

export default communityPermanentMemberTagPlugin;

