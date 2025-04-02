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
    SearchResponseSchema,
    GenerateComicsHtmlSchema,
    HtmlResponseSchema,
    ResponseStatusSchema,
    MovieSchema,
    MoviesResponseSchema,
    GetMoviesSchema,
    ResourcePrefix
} from "./schemas.js";
import { formatResourceId, generateComicsHtml, httpRequest, serializeQueryParams } from "./utils.js";
import { z } from "zod";

// Define interfaces for API responses
interface ApiResponse extends z.infer<typeof ResponseStatusSchema> {
    results: any;
}

interface CharacterResponse extends ApiResponse {
    results: z.infer<typeof CharacterSchema>;
}

interface IssueResponse extends ApiResponse {
    results: z.infer<typeof IssueSchema>;
}

export const dcComicsTools = {
    get_characters: {
        description: 'Fetch DC Comics characters with optional filters',
        schema: GetCharactersSchema,
        handler: async (args: any) => {
            const argsParsed = GetCharactersSchema.parse(args);
            // Add field_list parameter to specify which fields to return
            const params = {
                ...serializeQueryParams(argsParsed),
                field_list: 'aliases,character_enemies,character_friends,id,image,movies,name,powers,real_name,team_enemies,team_friends'
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
                field_list: 'aliases,character_enemies,character_friends,id,image,movies,name,powers,real_name,team_enemies,team_friends'
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
        description: 'Fetch DC Comics issues filtered by character ID and optional filters',
        schema: GetIssuesForCharacterSchema,
        handler: async (args: any) => {
            const { characterId, ...rest } = GetIssuesForCharacterSchema.parse(args);
            // Format character ID with the proper prefix
            const formattedId = formatResourceId('CHARACTER', characterId);
            
            const res = await httpRequest(`/issues`, {
                ...serializeQueryParams(rest),
                filter: `character:${formattedId}`
            });
            return IssuesResponseSchema.parse(res);
        }
    },
    get_issues: {
        description: 'Fetches lists of DC Comics issues with optional filters',
        schema: GetIssuesSchema,
        handler: async (args: any) => {
            const argsParsed = GetIssuesSchema.parse(args);
            const res = await httpRequest(`/issues`, serializeQueryParams(argsParsed));
            return IssuesResponseSchema.parse(res);
        }
    },
    get_issue_by_id: {
        description: 'Fetch a single DC Comics issue by ID',
        schema: GetIssueByIdSchema,
        handler: async (args: any) => {
            const argsParsed = GetIssueByIdSchema.parse(args);
            // Format issue ID with the proper prefix
            const formattedId = formatResourceId('ISSUE', argsParsed.issueId);
            
            const res = await httpRequest<ApiResponse>(`/issue/${formattedId}`);
            
            // Validate the response and results
            const issueResponse: IssueResponse = {
                ...ResponseStatusSchema.parse(res),
                results: IssueSchema.parse(res.results)
            };
            
            return issueResponse;
        }
    },
    get_characters_for_issue: {
        description: 'Fetch DC Comics characters for a given issue',
        schema: GetCharactersForIssueSchema,
        handler: async (args: any) => {
            const { issueId, ...rest } = GetCharactersForIssueSchema.parse(args);
            // Format issue ID with the proper prefix
            const formattedId = formatResourceId('ISSUE', issueId);
            
            // First fetch the issue to get character references
            const issueRes = await httpRequest<ApiResponse>(`/issue/${formattedId}`);
            
            // Verify issue has character_credits
            const validatedIssue = ResponseStatusSchema.parse(issueRes);
            const issueResults = IssueSchema.parse(issueRes.results);
            
            // Check if the issue has character_credits
            if (!issueResults.character_credits || issueResults.character_credits.length === 0) {
                return CharactersResponseSchema.parse({
                    status_code: 1,
                    error: "OK",
                    number_of_total_results: 0,
                    number_of_page_results: 0,
                    limit: rest.limit || 20,
                    offset: rest.offset || 0,
                    results: []
                });
            }
            
            // Extract character IDs and ensure they have the correct prefix
            const characterIds = issueResults.character_credits.map((char: any) => {
                // Extract the ID from api_detail_url
                const matches = char.api_detail_url.match(/\/(\d+)\/$/);
                return matches ? formatResourceId('CHARACTER', parseInt(matches[1])) : null;
            }).filter(Boolean).join(',');
            
            // Fetch the characters using the IDs
            const params = {
                ...serializeQueryParams(rest),
                filter: `id:${characterIds}`,
                field_list: 'aliases,character_enemies,character_friends,id,image,movies,name,powers,real_name,team_enemies,team_friends'
            };
            
            const res = await httpRequest(`/characters`, params);
            
            return CharactersResponseSchema.parse(res);
        }
    },
    search: {
        description: 'Search across DC Comics resources (characters, issues, volumes, etc)',
        schema: SearchSchema,
        handler: async (args: any) => {
            const { query, resources, limit, offset } = SearchSchema.parse(args);
            
            // Instead of using a separate utility function, call httpRequest directly
            const params = serializeQueryParams({
                query,
                resources,
                limit,
                offset
            });
            
            // Make the API request to the search endpoint
            const res = await httpRequest('/search', params);
            
            // Validate the response with the SearchResponseSchema
            return SearchResponseSchema.parse(res);
        }
    },
    generate_comics_html: {
        description: 'Create an HTML page displaying DC Comics issues with their images',
        schema: GenerateComicsHtmlSchema,
        handler: async (args: any) => {
            const argsParsed = GenerateComicsHtmlSchema.parse(args);
            const pageTitle = argsParsed.title || 'DC Comics';
            
            // Remove title from query parameters
            const { title, ...queryParams } = argsParsed;
            
            // Fetch comics data from DC Comics API
            const res = await httpRequest(`/issues`, serializeQueryParams(queryParams));
            const issuesData = IssuesResponseSchema.parse(res);
            
            // Generate HTML
            const html = generateComicsHtml(issuesData.results, pageTitle);
            
            // Return both the HTML and metadata about the result
            return HtmlResponseSchema.parse({
                html,
                count: issuesData.number_of_page_results,
                total: issuesData.number_of_total_results,
                message: `Generated HTML view for ${issuesData.number_of_page_results} issues (out of ${issuesData.number_of_total_results} total matches)`
            });
        }
    },
    get_movies: {
        description: 'Fetch DC Comics movies with optional filters',
        schema: GetMoviesSchema,
        handler: async (args: any) => {
            const argsParsed = GetMoviesSchema.parse(args);
            
            // Set default field_list if not provided
            if (!argsParsed.field_list) {
                argsParsed.field_list = 'id,name,deck,description,image,release_date,runtime,rating,box_office_revenue,total_revenue,budget,studios,writers,producers';
            }
            
            const res = await httpRequest('/movies', serializeQueryParams(argsParsed));
            
            return MoviesResponseSchema.parse({
                status_code: res.status_code || 1,
                error: res.error || 'OK',
                number_of_total_results: res.number_of_total_results,
                number_of_page_results: res.number_of_page_results,
                limit: res.limit,
                offset: res.offset,
                results: Array.isArray(res.results) ? res.results : [res.results]
            });
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
            
            // Set default field_list if not provided
            const params: any = {};
            if (field_list) {
                params.field_list = field_list;
            } else {
                params.field_list = 'id,name,deck,description,image,release_date,runtime,rating,box_office_revenue,total_revenue,budget,studios,writers,producers';
            }
            
            const res = await httpRequest<ApiResponse>(`/movie/${formattedId}`, params);
            
            // Validate and return the movie data
            return {
                status_code: res.status_code || 1,
                error: res.error || 'OK',
                number_of_total_results: 1,
                number_of_page_results: 1,
                limit: 1,
                offset: 0,
                results: MovieSchema.parse(res.results)
            };
        }
    }
};

export type ToolName = keyof typeof dcComicsTools;