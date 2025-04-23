import { markdownInstructions } from "../../instructions.js";
import { SearchSchema } from "./schemas.js";
import { performDcComicsSearch } from "../../utils.js";

export const search = {
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
};