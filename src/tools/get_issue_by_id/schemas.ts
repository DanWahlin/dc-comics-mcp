// /tools/get_issue_by_id/schemas.ts
import { z } from 'zod';

// Issue by ID schema
export const GetIssueByIdSchema = z.object({
  issueId: z.number().describe('Unique identifier for the issue'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});