import { markdownInstructions } from "./instructions.js";
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
    GetIssuesByCharacterNameSchema,
    GetMovieByIdSchema
} from "./schemas.js";
import { ApiResponse, CharacterResponse, CharacterSearchResult, IssueResponse } from "./types.js";
import { createEmptyResponse, createStandardResponse, DEFAULT_FIELD_LISTS, formatResourceId, generateComicsHtml, getResourceById, getResourcesList, httpRequest, performDcComicsSearch, serializeQueryParams } from "./utils.js";

export const dcComicsTools = {
    get_characters: {
        description: `Fetch DC Comics characters with optional filters. ${markdownInstructions}`,
        schema: GetCharactersSchema,
        handler: async (args: any) => {
            const argsParsed = GetCharactersSchema.parse(args);
            // Use the helper function to get a list of characters
            const res = await getResourcesList('/characters', argsParsed, 'CHARACTER');
            return CharactersResponseSchema.parse(res);
        }
    },
    get_character_by_id: {
        description: `Fetch a DC Comics character by ID. ${markdownInstructions}`,
        schema: GetCharacterByIdSchema,
        handler: async (args: any) => {
            const argsParsed = GetCharacterByIdSchema.parse(args);
            // Use the helper function to get a character by ID
            const res = await getResourceById<ApiResponse>(
                'CHARACTER', 
                argsParsed.characterId, 
                argsParsed.field_list
            );
            
            // Validate the response and results
            const characterResponse: CharacterResponse = {
                ...ResponseStatusSchema.parse(res),
                results: CharacterSchema.parse(res.results)
            };
            
            return characterResponse;
        }
    },
    get_issues_for_character: {
        description: `Fetch DC Comics issues (comics) filtered by character ID and optional filters. ${markdownInstructions}`,
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
        description: `Fetches lists of DC Comics issues (comics) with optional filters. ${markdownInstructions}`,
        schema: GetIssuesSchema,
        handler: async (args: any) => {
            const argsParsed = GetIssuesSchema.parse(args);
            // Use the helper function to get a list of issues
            const res = await getResourcesList('/issues', argsParsed, 'ISSUE');
            return IssuesResponseSchema.parse(res);
        }
    },
    get_issue_by_id: {
        description: `Fetch a single DC Comics issue (comic) by ID. ${markdownInstructions}`,
        schema: GetIssueByIdSchema,
        handler: async (args: any) => {
            const argsParsed = GetIssueByIdSchema.parse(args);
            // Use the helper function to get an issue by ID
            const res = await getResourceById<ApiResponse>(
                'ISSUE', 
                argsParsed.issueId, 
                argsParsed.field_list
            );
            
            // Validate the response and results
            const issueResponse: IssueResponse = {
                ...ResponseStatusSchema.parse(res),
                results: IssueSchema.parse(res.results)
            };
            
            return issueResponse;
        }
    },
    get_characters_for_issue: {
        description: `Fetch DC Comics characters for a given issue/comic. ${markdownInstructions}`,
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
    get_issues_by_character_name: {
        description: `Fetch DC Comics issues featuring a specific character by name directly. ${markdownInstructions}`,
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
    get_movies: {
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
    },
    get_movie_by_id: {
        description: `Fetch a DC Comics movie by ID. 
            ${markdownInstructions}
        `,
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
    },
    search: {
        description: `Search across DC Comics resources (characters, issues/comics, volumes, etc). 
            Use "resources" to specify the types of resources to search. For example, if a user asks for "Batman comics",
            you can use "query=Batman" and "resources=character,issue" to get both character data and issues. If a
            user asks for multiple characters or other multiple resources, you can use
            query="Batman, Superman" and resources="character,issue" (or others as appropriate) to get both character data and issues.
            - Use "field_list" to specify which fields to return in the response. For example, if you want to get the name and
            description of the characters.
            ${markdownInstructions}
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