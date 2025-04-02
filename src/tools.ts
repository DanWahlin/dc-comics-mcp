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
    ResponseStatusSchema
} from "./schemas.js";
import { generateComicsHtml, httpRequest, serializeQueryParams } from "./utils.js";
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
            const res = await httpRequest('/characters', serializeQueryParams(argsParsed));
            return CharactersResponseSchema.parse(res);
        }
    },
    get_character_by_id: {
        description: 'Fetch a DC Comics character by ID',
        schema: GetCharacterByIdSchema,
        handler: async (args: any) => {
            const argsParsed = GetCharacterByIdSchema.parse(args);
            const res = await httpRequest<ApiResponse>(`/character/${argsParsed.characterId}`);
            
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
            const res = await httpRequest(`/issues`, {
                ...serializeQueryParams(rest),
                filter: `character:${characterId}`
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
            const res = await httpRequest<ApiResponse>(`/issue/${argsParsed.issueId}`);
            
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
            // First fetch the issue to get character references
            const issueRes = await httpRequest<ApiResponse>(`/issue/${issueId}`);
            
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
            
            // Extract character IDs
            const characterIds = issueResults.character_credits.map((char: any) => {
                // Extract the ID from api_detail_url
                const matches = char.api_detail_url.match(/\/(\d+)\/$/);
                return matches ? matches[1] : null;
            }).filter(Boolean).join(',');
            
            // Fetch the characters using the IDs
            const res = await httpRequest(`/characters`, {
                ...serializeQueryParams(rest),
                filter: `id:${characterIds}`
            });
            
            return CharactersResponseSchema.parse(res);
        }
    },
    search: {
        description: 'Search across DC Comics resources (characters, issues, volumes, etc)',
        schema: SearchSchema,
        handler: async (args: any) => {
            const argsParsed = SearchSchema.parse(args);
            const res = await httpRequest(`/search`, serializeQueryParams(argsParsed));
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
    }
};

export type ToolName = keyof typeof dcComicsTools;