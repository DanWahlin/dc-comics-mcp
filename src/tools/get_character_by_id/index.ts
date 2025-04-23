// /tools/get_character_by_id/index.ts
import { markdownInstructions } from "../../instructions.js";
import { CharacterSchema, ResponseStatusSchema } from "../schemas.js";
import { GetCharacterByIdSchema } from "./schemas.js";
import { getResourceById } from "../../utils.js";
import { ApiResponse, CharacterResponse } from "../../types.js";

export const get_character_by_id = {
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
};