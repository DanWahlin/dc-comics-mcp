// /tools/search/schemas.ts
import { z } from 'zod';

// Search schema
export const SearchSchema = z.object({
  query: z.string().describe('Search query string'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  resources: z
    .string()
    .optional()
    .describe('Comma-separated list of resource types to search for. Available options are: character, concept, origin, object, location, issue, story_arc, volume, publisher, person, team, video'),
  limit: z.number().min(1).max(100).optional().describe('Limit results'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});