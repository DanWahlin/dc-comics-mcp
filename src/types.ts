import { z } from "zod";
import { CharacterSchema, IssueSchema, ResponseStatusSchema, SearchResultSchema } from "./schemas";

// Define interfaces for API responses
export interface ApiResponse extends z.infer<typeof ResponseStatusSchema> {
    results: any;
}

export interface CharacterResponse extends ApiResponse {
    results: z.infer<typeof CharacterSchema>;
}

export interface IssueResponse extends ApiResponse {
    results: z.infer<typeof IssueSchema>;
}

// Extend SearchResultSchema with the properties we need to access
// This provides type safety for the search result properties we're using
export interface CharacterSearchResult extends z.infer<typeof SearchResultSchema> {
    character_credits?: Array<{ name: string }>;
    movies?: Array<{ name: string }>;
}