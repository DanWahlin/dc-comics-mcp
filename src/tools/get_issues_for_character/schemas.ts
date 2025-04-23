// /tools/get_issues_for_character/schemas.ts
import { z } from 'zod';

// Issues for character schema - extends character ID schema with pagination
export const GetIssuesForCharacterSchema = z.object({
  characterId: z.number().describe('Unique identifier for the character'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});