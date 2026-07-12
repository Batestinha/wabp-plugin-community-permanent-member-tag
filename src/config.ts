import { z } from 'zod';

export const COMMUNITY_PERMANENT_MEMBER_TAG_PLUGIN_ID = 'official.community-permanent-member-tag';
export const COMMUNITY_PERMANENT_MEMBER_TAG_MAX_LENGTH = 30;

export const communityPermanentMemberTagConfigSchema = z.object({
  memberTag: z.string().trim().max(COMMUNITY_PERMANENT_MEMBER_TAG_MAX_LENGTH).default(''),
  applyOnBotJoin: z.boolean().default(true),
  exemptGroupChatIds: z.array(z.string().trim().min(1)).default([])
}).strict();

export type CommunityPermanentMemberTagConfig = z.infer<typeof communityPermanentMemberTagConfigSchema>;

export function parseCommunityPermanentMemberTagConfig(input: unknown): CommunityPermanentMemberTagConfig {
  return communityPermanentMemberTagConfigSchema.parse(input);
}
