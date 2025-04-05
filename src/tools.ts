import { 
    CharacterSchema,
    CharactersResponseSchema,
    GetCharacterByIdSchema, 
    GetCharactersSchema, 
    GetIssueByIdSchema,
    GetIssuesForCharacterSchema, 
    GetCharactersForIssueSchema,
    GetIssuesSchema,
    IssuesResponseSchema,
    IssueSchema,
    SearchSchema,
    ResponseStatusSchema,
    MoviesResponseSchema,
    GetMoviesSchema,
    GetIssuesByCharacterNameSchema
} from "./schemas.js";
import { ApiResponse, CharacterResponse, CharacterSearchResult, IssueResponse } from "./types.js";
import { createEmptyResponse, createStandardResponse, DEFAULT_FIELD_LISTS, formatResourceId, generateComicsHtml, httpRequest, performDcComicsSearch, serializeQueryParams } from "./utils.js";
import { z } from "zod";

export const dcComicsTools = {
    get_characters: {
        description: 'Fetch DC Comics characters with optional filters',
        schema: GetCharactersSchema,
        handler: async (args: any) => {
            const argsParsed = GetCharactersSchema.parse(args);
            // Add field_list parameter to specify which fields to return
            const params = {
                ...serializeQueryParams(argsParsed),
                field_list: argsParsed.field_list || DEFAULT_FIELD_LISTS.CHARACTER
            };
            const res = await httpRequest('/characters', params);
            return CharactersResponseSchema.parse(res);
        }
    },
    get_character_by_id: {
        description: 'Fetch a DC Comics character by ID',
        schema: GetCharacterByIdSchema,
        handler: async (args: any) => {
            const argsParsed = GetCharacterByIdSchema.parse(args);
            // Format character ID with the proper prefix
            const formattedId = formatResourceId('CHARACTER', argsParsed.characterId);
            
            // Add field_list parameter to specify which fields to return
            const params = {
                field_list: argsParsed.field_list || DEFAULT_FIELD_LISTS.CHARACTER
            };
            const res = await httpRequest<ApiResponse>(`/character/${formattedId}`, params);
            
            // Validate the response and results
            const characterResponse: CharacterResponse = {
                ...ResponseStatusSchema.parse(res),
                results: CharacterSchema.parse(res.results)
            };
            
            return characterResponse;
        }
    },
    get_issues_for_character: {
        description: 'Fetch DC Comics issues (comics) filtered by character ID and optional filters',
        schema: GetIssuesForCharacterSchema,
        handler: async (args: any) => {
            const { characterId, ...rest } = GetIssuesForCharacterSchema.parse(args);
            // Format character ID with the proper prefix
            const formattedId = formatResourceId('CHARACTER', characterId);
            
            // First get character details to confirm it exists
            const characterSearchResults = await performDcComicsSearch(formattedId, 'character', 'id,name');
            
            // Check if character was found
            if (!characterSearchResults.results || characterSearchResults.results.length === 0) {
                return createEmptyResponse(IssuesResponseSchema, rest.limit, rest.offset);
            }
            
            // Now search for issues with this character
            // Use character name for better search results
            const characterName = characterSearchResults.results[0].name || '';
            
            // Set default field_list if not provided
            let fieldList = rest.field_list || DEFAULT_FIELD_LISTS.ISSUE;
            
            // Search for issues featuring this character
            const issueSearchResults = await performDcComicsSearch(
                characterName, 
                'issue', 
                fieldList,
                rest.limit,
                rest.offset
            );
            
            return IssuesResponseSchema.parse(issueSearchResults);
        }
    },
    get_issues: {
        description: 'Fetches lists of DC Comics issues (comics) with optional filters',
        schema: GetIssuesSchema,
        handler: async (args: any) => {
            const argsParsed = GetIssuesSchema.parse(args);
            // Set default field_list if not provided
            if (!argsParsed.field_list) {
                argsParsed.field_list = DEFAULT_FIELD_LISTS.ISSUE;
            }
            const res = await httpRequest(`/issues`, serializeQueryParams(argsParsed));
            return IssuesResponseSchema.parse(res);
        }
    },
    get_issue_by_id: {
        description: 'Fetch a single DC Comics issue (comic) by ID',
        schema: GetIssueByIdSchema,
        handler: async (args: any) => {
            const argsParsed = GetIssueByIdSchema.parse(args);
            // Format issue ID with the proper prefix
            const formattedId = formatResourceId('ISSUE', argsParsed.issueId);
            
            const params = {
                field_list: argsParsed.field_list || DEFAULT_FIELD_LISTS.ISSUE
            };
            
            const res = await httpRequest<ApiResponse>(`/issue/${formattedId}`, params);
            
            // Validate the response and results
            const issueResponse: IssueResponse = {
                ...ResponseStatusSchema.parse(res),
                results: IssueSchema.parse(res.results)
            };
            
            return issueResponse;
        }
    },
    get_characters_for_issue: {
        description: 'Fetch DC Comics characters for a given issue/comic',
        schema: GetCharactersForIssueSchema,
        handler: async (args: any) => {
            const { issueId, ...rest } = GetCharactersForIssueSchema.parse(args);
            // Format issue ID with the proper prefix
            const formattedId = formatResourceId('ISSUE', issueId);
            
            // First fetch the issue to get character credits using search functionality
            const issueSearchResults = await performDcComicsSearch(formattedId, 'issue', 'id,name,character_credits');
            
            // Check if issue was found
            if (!issueSearchResults.results || issueSearchResults.results.length === 0) {
                return createEmptyResponse(CharactersResponseSchema, rest.limit, rest.offset);
            }
            
            const issueResults = issueSearchResults.results[0] as CharacterSearchResult;
            
            // Check if the issue has character_credits
            if (!issueResults.character_credits || !Array.isArray(issueResults.character_credits) || issueResults.character_credits.length === 0) {
                return createEmptyResponse(CharactersResponseSchema, rest.limit, rest.offset);
            }
            
            // Extract character names to search for
            const characterNames = issueResults.character_credits.map((char: { name: string }) => char.name).join(' OR ');
            
            // Use search to find the characters
            const characterSearchResults = await performDcComicsSearch(
                characterNames, 
                'character', 
                rest.field_list || DEFAULT_FIELD_LISTS.CHARACTER,
                rest.limit,
                rest.offset
            );
            
            return createStandardResponse(CharactersResponseSchema, characterSearchResults);
        }
    },
    get_movies: {
        description: 'Fetch DC Comics movies with optional filters',
        schema: GetMoviesSchema,
        handler: async (args: any) => {
            const argsParsed = GetMoviesSchema.parse(args);
            
            // Set default field_list if not provided
            if (!argsParsed.field_list) {
                argsParsed.field_list = DEFAULT_FIELD_LISTS.MOVIE;
            }
            
            const res = await httpRequest('/movies', serializeQueryParams(argsParsed));
            
            return createStandardResponse(MoviesResponseSchema, {
                ...res,
                results: Array.isArray(res.results) ? res.results : [res.results]
            });
        }
    },
    get_movies_by_character: {
        description: 'Fetch DC Comics movies featuring a specific character',
        schema: z.object({
            filter: z.string().describe('Name of the character (e.g., "Batman")'),
            limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
            offset: z.number().optional().describe('Skip the specified number of resources in the result set')
        }),
        handler: async (args: any) => {
            const { filter, limit, offset } = args;
            
            // Step 1: Find the character by name using the search function
            const searchResults = await performDcComicsSearch(filter, 'character,movie', 'id,name,movies');
            
            // Check if character was found
            if (!searchResults.results || searchResults.results.length === 0) {
                return createEmptyResponse(MoviesResponseSchema, limit, offset);
            }
            
            // Get the first matching character
            const character = searchResults.results[0] as CharacterSearchResult;
            
            // Step 2: Check if the character has movies
            if (!character.movies || !Array.isArray(character.movies) || character.movies.length === 0) {
                return createEmptyResponse(MoviesResponseSchema, limit, offset);
            }
            
            // Step 3: Extract movie names to search for
            const movieNames = character.movies.map((movie: { name: string }) => movie.name).join(' OR ');
            
            // Step 4: Use search to find the complete movie data
            const movieSearchResults = await performDcComicsSearch(
                movieNames, 
                'movie', 
                DEFAULT_FIELD_LISTS.MOVIE,
                limit,
                offset
            );
            
            return createStandardResponse(MoviesResponseSchema, movieSearchResults);
        }
    },
    get_movie_by_id: {
        description: 'Fetch a DC Comics movie by ID',
        schema: z.object({
            movieId: z.number().describe('Unique identifier for the movie'),
            field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
        }),
        handler: async (args: any) => {
            const { movieId, field_list } = args;
            // Format movie ID with the proper prefix
            const formattedId = formatResourceId('MOVIE', movieId);
            
            // Set up parameters
            const params = {
                field_list: field_list || DEFAULT_FIELD_LISTS.MOVIE
            };
            
            const res = await httpRequest<ApiResponse>(`/movie/${formattedId}`, params);
            
            return createStandardResponse(MoviesResponseSchema, {
                ...res,
                number_of_total_results: 1,
                number_of_page_results: 1,
                limit: 1,
                offset: 0
            });
        }
    },
    get_issues_by_character_name: {
        description: 'Fetch DC Comics issues featuring a specific character by name directly',
        schema: GetIssuesByCharacterNameSchema,
        handler: async (args: any) => {
            const { filter, field_list, limit, offset } = GetIssuesByCharacterNameSchema.parse(args);
            
            // Search for issues with this character name
            const issueSearchResults = await performDcComicsSearch(
                filter, 
                'issue', 
                field_list || DEFAULT_FIELD_LISTS.ISSUE,
                limit,
                offset
            );
            
            return IssuesResponseSchema.parse(issueSearchResults);
        }
    },
    search: {
        description: `Search across DC Comics resources (characters, issues/comics, volumes, etc). 
            Use "resources" to specify the types of resources to search. For example, if a user asks for "Batman comics",
            you can use "query=Batman" and "resources=character,issue" to get both character data and issues.
        `,
        schema: SearchSchema,
        handler: async (args: any) => {
            const argsParsed = SearchSchema.parse(args);
            // Use the existing performDcComicsSearch function instead of duplicating logic
            return await performDcComicsSearch(
                argsParsed.query,
                argsParsed.resources,
                argsParsed.field_list,
                argsParsed.limit,
                argsParsed.offset
            );
        }
    },
};

export type ToolName = keyof typeof dcComicsTools;