import { markdownInstructions } from "../../instructions.js";
import { IssueSchema, ResponseStatusSchema } from "../schemas.js";
import { GetIssueByIdSchema } from "./schemas.js";
import { getResourceById } from "../../utils.js";
import { ApiResponse, IssueResponse } from "../../types.js";

export const get_issue_by_id = {
    description: `Fetch a single DC Comics issue by ID. ${markdownInstructions}`,
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
};