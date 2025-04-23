// /tools/get_issues/schemas.ts
import { z } from 'zod';

// Issues list schema
export const GetIssuesSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});