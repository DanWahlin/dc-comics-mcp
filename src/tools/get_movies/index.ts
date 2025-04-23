import { markdownInstructions } from "../../instructions.js";
import { MoviesResponseSchema } from "../schemas.js";
import { GetMoviesSchema } from "./schemas.js";
import { createStandardResponse, getResourcesList } from "../../utils.js";

export const get_movies = {
    description: `
            Fetch DC Comics movies with optional filters. To filter based
            on the movie title/name, use the "filter" parameter. For example, to get movies with "Batman" in the title
            you can pass "filter=name:Batman,deck:Batman".
            ${markdownInstructions}
        `,
    schema: GetMoviesSchema,
    handler: async (args: any) => {
        const argsParsed = GetMoviesSchema.parse(args);
        // Use the helper function to get a list of movies
        const res = await getResourcesList('/movies', argsParsed, 'MOVIE');
        
        return createStandardResponse(MoviesResponseSchema, {
            ...res,
            results: Array.isArray(res.results) ? res.results : [res.results]
        });
    }
};