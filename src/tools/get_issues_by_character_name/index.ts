import { markdownInstructions } from "../../instructions.js";
import { IssuesResponseSchema } from "../schemas.js";
import { GetIssuesByCharacterNameSchema } from "./schemas.js";
import { DEFAULT_FIELD_LISTS, performDcComicsSearch } from "../../utils.js";

export const get_issues_by_character_name = {
    description: `Search for DC Comics issues (comics) by character name. This is a user-friendly alternative to searching by ID. ${markdownInstructions}`,
    schema: GetIssuesByCharacterNameSchema,
    handler: async (args: any) => {
        const { filter, ...rest } = GetIssuesByCharacterNameSchema.parse(args);
        
        // Set default field_list if not provided
        let fieldList = rest.field_list || DEFAULT_FIELD_LISTS.ISSUE;
        
        // Search for issues with the character name
        const issueSearchResults = await performDcComicsSearch(
            filter, 
            'issue', 
            fieldList,
            rest.limit,
            rest.offset
        );
        
        return IssuesResponseSchema.parse(issueSearchResults);
    }
};