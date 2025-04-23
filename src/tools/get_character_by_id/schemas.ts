// /tools/get_character_by_id/schemas.ts
import { z } from 'zod';

// Character by ID schema
export const GetCharacterByIdSchema = z.object({
  characterId: z.number().describe('Unique identifier for the character'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});