// /tools/schemas.ts
import { z } from 'zod';

// Add resource type ID prefixes for API calls
export const ResourcePrefix = {
  ISSUE: 4000,
  CHARACTER: 4005,
  PUBLISHER: 4010,
  CONCEPT: 4015,
  LOCATION: 4020,
  ORIGIN: 4030,
  POWER: 4035,
  CREATOR: 4040,
  STORY_ARC: 4045,
  VOLUME: 4050,
  ITEM: 4055,
  TEAM: 4060,
  MOVIE: 4025
};

// Shared schemas for standard Comic Vine API responses
export const ResponseStatusSchema = z.object({
  status_code: z.number().describe('Result code of the request: 1=OK, 100=Invalid API Key, 101=Object Not Found, 102=Error in URL Format, etc.'),
  error: z.string().describe('A text string representing the status_code'),
  number_of_total_results: z.number().describe('The number of total results matching the filter conditions specified'),
  number_of_page_results: z.number().describe('The number of results on this page'),
  limit: z.number().describe('The value of the limit filter specified, or 100 if not specified'),
  offset: z.number().describe('The value of the offset filter specified, or 0 if not specified')
});

// Image schema
export const ImageSchema = z.object({
  icon_url: z.string().optional(),
  medium_url: z.string().optional(),
  screen_url: z.string().optional(),
  screen_large_url: z.string().optional(),
  small_url: z.string().optional(),
  super_url: z.string().optional(),
  thumb_url: z.string().optional(),
  tiny_url: z.string().optional(),
  original_url: z.string().optional(),
  image_tags: z.string().optional()
});

// Character schema
export const CharacterSchema = z.object({
  aliases: z.string().nullable().optional().describe('List of aliases the character is known by. A \\n (newline) seperates each alias.'),
  api_detail_url: z.string().nullable().optional().describe('URL pointing to the character detail resource.'),
  birth: z.string().nullable().optional().describe('A date, if one exists, that the character was born on. Not an origin date.'),
  character_enemies: z.array(z.any()).optional().describe('List of characters that are enemies with this character.'),
  character_friends: z.array(z.any()).optional().describe('List of characters that are friends with this character.'),
  count_of_issue_appearances: z.number().optional().describe('Number of issues this character appears in.'),
  creators: z.array(z.any()).optional().describe('List of the real life people who created this character.'),
  date_added: z.string().nullable().optional().describe('Date the character was added to Comic Vine.'),
  date_last_updated: z.string().nullable().optional().describe('Date the character was last updated on Comic Vine.'),
  deck: z.string().nullable().optional().describe('Brief summary of the character.'),
  description: z.string().nullable().optional().describe('Description of the character.'),
  first_appeared_in_issue: z.object({}).optional().describe('Issue where the character made its first appearance.'),
  gender: z.union([z.literal('Male'), z.literal('Female'), z.literal('Other'), z.number(), z.string()]).optional().describe('Gender of the character.'),
  id: z.number().optional().describe('Unique ID of the character.'),
  image: ImageSchema.optional().describe('Main image of the character.'),
  issue_credits: z.array(z.any()).optional().describe('List of issues this character appears in.'),
  issues_died_in: z.array(z.any()).optional().describe('List of issues this character died in.'),
  movies: z.array(z.any()).optional().describe('Movies the character was in.'),
  name: z.string().optional().describe('Name of the character.'),
  origin: z.union([z.string(), z.object({}).passthrough()]).nullable().optional().describe('The origin of the character. Human, Alien, Robot ...etc'),
  powers: z.array(z.any()).optional().describe('List of super powers a character has.'),
  publisher: z.object({}).optional().describe('The primary publisher a character is attached to.'),
  real_name: z.string().nullable().optional().describe('Real name of the character.'),
  site_detail_url: z.string().nullable().optional().describe('URL pointing to the character on Comic Vine.'),
  story_arc_credits: z.array(z.any()).optional().describe('List of story arcs this character appears in.'),
  team_enemies: z.array(z.any()).optional().describe('List of teams that are enemies of this character.'),
  team_friends: z.array(z.any()).optional().describe('List of teams that are friends with this character.'),
  teams: z.array(z.any()).optional().describe('List of teams this character is a member of.'),
  volume_credits: z.array(z.any()).optional().describe('List of comic volumes this character appears in.')
});

// Characters list response
export const CharactersResponseSchema = ResponseStatusSchema.extend({
  results: z.array(CharacterSchema)
});

// Issue schema
export const IssueSchema = z.object({
  aliases: z.string().nullable().optional().describe('List of aliases the issue is known by.'),
  api_detail_url: z.string().nullable().optional().describe('URL pointing to the issue detail resource.'),
  character_credits: z.array(z.any()).optional().describe('A list of characters that appear in this issue.'),
  characters_died_in: z.array(z.any()).optional().describe('A list of characters that died in this issue.'),
  concept_credits: z.array(z.any()).optional().describe('A list of concepts that appear in this issue.'),
  cover_date: z.string().nullable().optional().describe('The publish date printed on the cover of an issue.'),
  date_added: z.string().nullable().optional().describe('Date the issue was added to Comic Vine.'),
  date_last_updated: z.string().nullable().optional().describe('Date the issue was last updated on Comic Vine.'),
  deck: z.string().nullable().optional().describe('Brief summary of the issue.'),
  description: z.string().nullable().optional().describe('Description of the issue.'),
  disbanded_teams: z.array(z.any()).optional().describe('A list of teams that disbanded in this issue.'),
  first_appearance_characters: z.array(z.any()).optional().describe('A list of characters in which this issue is the first appearance of the character.'),
  first_appearance_concepts: z.array(z.any()).optional().describe('A list of concepts in which this issue is the first appearance of the concept.'),
  first_appearance_locations: z.array(z.any()).optional().describe('A list of locations in which this issue is the first appearance of the location.'),
  first_appearance_objects: z.array(z.any()).optional().describe('A list of objects in which this issue is the first appearance of the object.'),
  first_appearance_storyarcs: z.array(z.any()).optional().describe('A list of storyarcs in which this issue is the first appearance of the story arc.'),
  first_appearance_teams: z.array(z.any()).optional().describe('A list of teams in which this issue is the first appearance of the team.'),
  has_staff_review: z.boolean().optional(),
  id: z.number().optional().describe('Unique ID of the issue.'),
  image: ImageSchema.optional().describe('Main image of the issue.'),
  issue_number: z.string().nullable().optional().describe('The number assigned to the issue within the volume set.'),
  location_credits: z.array(z.any()).optional().describe('List of locations that appeared in this issue.'),
  name: z.string().nullable().optional().describe('Name of the issue.'),
  object_credits: z.array(z.any()).optional().describe('List of objects that appeared in this issue.'),
  person_credits: z.array(z.any()).optional().describe('List of people that worked on this issue.'),
  site_detail_url: z.string().nullable().optional().describe('URL pointing to the issue on Comic Vine.'),
  store_date: z.string().nullable().optional().describe('The date the issue was first sold in stores.'),
  story_arc_credits: z.array(z.any()).optional().describe('List of story arcs this issue appears in.'),
  team_credits: z.array(z.any()).optional().describe('List of teams that appear in this issue.'),
  teams_disbanded_in: z.array(z.any()).optional().describe('List of teams that disbanded in this issue.'),
  volume: z.union([z.object({}), z.null()]).optional().describe('The volume this issue is a part of.')
});

// Issues list response
export const IssuesResponseSchema = ResponseStatusSchema.extend({
  results: z.array(IssueSchema)
});

// Movie schema
export const MovieSchema = z.object({
  aliases: z.string().nullable().optional().describe('List of aliases the movie is known by.'),
  api_detail_url: z.string().nullable().optional().describe('URL pointing to the movie detail resource.'),
  box_office_revenue: z.union([z.string(), z.number()]).nullable().optional().describe('The total revenue made in the box offices for this movie.'),
  budget: z.union([z.string(), z.number()]).nullable().optional().describe('The cost of making this movie.'),
  characters: z.array(z.any()).optional().describe('Characters related to the movie.'),
  concepts: z.array(z.any()).optional().describe('Concepts related to the movie.'),
  date_added: z.string().nullable().optional().describe('Date the movie was added to Comic Vine.'),
  date_last_updated: z.string().nullable().optional().describe('Date the movie was last updated on Comic Vine.'),
  deck: z.string().nullable().optional().describe('Brief summary of the movie.'),
  description: z.string().nullable().optional().describe('Description of the movie.'),
  distributor: z.string().nullable().optional(),
  has_staff_review: z.boolean().optional(),
  id: z.number().optional().describe('Unique ID of the movie.'),
  image: ImageSchema.optional().describe('Main image of the movie.'),
  locations: z.array(z.any()).optional().describe('Locations related to the movie.'),
  name: z.string().optional().describe('Name of the movie.'),
  producers: z.union([z.array(z.any()), z.null()]).optional().describe('The producers of this movie.'),
  rating: z.string().nullable().optional().describe('The rating of this movie.'),
  release_date: z.string().nullable().optional().describe('Date of the movie.'),
  runtime: z.string().nullable().optional().describe('The length of this movie.'),
  site_detail_url: z.string().nullable().optional().describe('URL pointing to the movie on Comic Vine.'),
  studios: z.union([z.array(z.any()), z.null()]).optional(),
  teams: z.array(z.any()).optional().describe('List of teams this movie is a member of.'),
  things: z.array(z.any()).optional().describe('List of things found in this movie.'),
  total_revenue: z.union([z.string(), z.number()]).nullable().optional().describe('Total revenue generated by this movie.'),
  writers: z.union([z.array(z.any()), z.null()]).optional().describe('Writers for this movie.')
});

// Movies list response
export const MoviesResponseSchema = ResponseStatusSchema.extend({
  results: z.array(MovieSchema)
});

// Search results schema
export const SearchResultSchema = z.object({
  resource_type: z.string().optional().describe('The type of resource the result is mapped to.'),
  id: z.number().optional().describe('Unique ID of the resource.'),
  name: z.string().nullable().optional().describe('Name of the resource.'),
  api_detail_url: z.string().optional().describe('URL pointing to the detail resource.'),
  image: ImageSchema.optional().describe('Main image of the resource.'),
  deck: z.string().nullable().optional().describe('Brief summary of the resource.')
});

// Search response
export const SearchResponseSchema = ResponseStatusSchema.extend({
  results: z.array(SearchResultSchema)
});