// /tools/get_issues_by_character_name/schemas.ts
import { z } from 'zod';

// Get issues by character name schema (for more user-friendly searching)
export const GetIssuesByCharacterNameSchema = z.object({
  filter: z.string().describe('Name of the character (e.g., "Superman", "Batman")'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});