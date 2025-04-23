import { markdownInstructions } from "../../instructions.js";
import { CharactersResponseSchema } from "../schemas.js";
import { GetCharactersForIssueSchema } from "./schemas.js";
import { createEmptyResponse, createStandardResponse, DEFAULT_FIELD_LISTS, formatResourceId, performDcComicsSearch } from "../../utils.js";
import { CharacterSearchResult } from "../../types.js";

export const get_characters_for_issue = {
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
};