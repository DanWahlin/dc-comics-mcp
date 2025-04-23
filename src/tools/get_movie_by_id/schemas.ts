// /tools/get_movie_by_id/schemas.ts
import { z } from 'zod';

// Movie by ID schema
export const GetMovieByIdSchema = z.object({
  movieId: z.number().describe('Unique identifier for the movie'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});