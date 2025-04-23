import { markdownInstructions } from "../../instructions.js";
import { IssuesResponseSchema } from "../schemas.js";
import { GetIssuesSchema } from "./schemas.js";
import { getResourcesList } from "../../utils.js";

export const get_issues = {
    description: `Fetches lists of DC Comics issues (comics) with optional filters. ${markdownInstructions}`,
    schema: GetIssuesSchema,
    handler: async (args: any) => {
        const argsParsed = GetIssuesSchema.parse(args);
        // Use the helper function to get a list of issues
        const res = await getResourcesList('/issues', argsParsed, 'ISSUE');
        return IssuesResponseSchema.parse(res);
    }
};