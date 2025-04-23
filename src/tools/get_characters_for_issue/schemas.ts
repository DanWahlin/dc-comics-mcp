// /tools/get_characters_for_issue/schemas.ts
import { z } from 'zod';

// Characters for issue schema - extends issue ID schema with pagination
export const GetCharactersForIssueSchema = z.object({
  issueId: z.number().describe('Unique identifier for the issue'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});