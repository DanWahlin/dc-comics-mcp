import { markdownInstructions } from "../../instructions.js";
import { CharactersResponseSchema } from "../schemas.js";
import { GetCharactersSchema } from "./schemas.js";
import { getResourcesList } from "../../utils.js";

export const get_characters = {
    description: `Fetch DC Comics characters with optional filters. ${markdownInstructions}`,
    schema: GetCharactersSchema,
    handler: async (args: any) => {
        const argsParsed = GetCharactersSchema.parse(args);
        // Use the helper function to get a list of characters
        const res = await getResourcesList('/characters', argsParsed, 'CHARACTER');
        return CharactersResponseSchema.parse(res);
    }
};