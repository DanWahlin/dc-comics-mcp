import { markdownInstructions } from "../../instructions.js";
import { MovieSchema, MoviesResponseSchema, ResponseStatusSchema } from "../schemas.js";
import { GetMovieByIdSchema } from "./schemas.js";
import { createStandardResponse, getResourceById } from "../../utils.js";
import { ApiResponse } from "../../types.js";

export const get_movie_by_id = {
    description: `Fetch a DC Comics movie by ID. ${markdownInstructions}`,
    schema: GetMovieByIdSchema,
    handler: async (args: any) => {
        const argsParsed = GetMovieByIdSchema.parse(args);
        // Use the helper function to get a movie by ID
        const res = await getResourceById<ApiResponse>(
            'MOVIE', 
            argsParsed.movieId, 
            argsParsed.field_list
        );
        
        return createStandardResponse(MoviesResponseSchema, {
            ...res,
            number_of_total_results: 1,
            number_of_page_results: 1,
            limit: 1,
            offset: 0
        });
    }
};