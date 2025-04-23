// /tools/get_movies/schemas.ts
import { z } from 'zod';

// Movies list schema
export const GetMoviesSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., name:asc)'),
  filter: z.string().optional().describe(`
    Filter results by field values:
    Single: field:value (example: filter=name:Batman), 
    Multiple: field:value,field:value (example: filter=name:Batman,deck:Batman),
    Date: field:start|end
  `)
});