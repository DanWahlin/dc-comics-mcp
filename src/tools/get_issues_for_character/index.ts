import { markdownInstructions } from "../../instructions.js";
import { IssuesResponseSchema } from "../schemas.js";
import { GetIssuesForCharacterSchema } from "./schemas.js";
import { createEmptyResponse, DEFAULT_FIELD_LISTS, formatResourceId, performDcComicsSearch } from "../../utils.js";

export const get_issues_for_character = {
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
};