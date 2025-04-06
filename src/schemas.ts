// schemas.ts
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

// A lot of optional properties due to data returned by the API. 
// Many cases where there is missing data so having a required property
// would cause issues.

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
  id: z.number().optional().default(() => Math.floor(1000000 + Math.random() * 9000000)).describe('Unique ID of the character.'),
  image: ImageSchema.optional().describe('Main image of the character.'),
  issue_credits: z.array(z.any()).optional().describe('List of issues this character appears in.'),
  issues_died_in: z.array(z.any()).optional().describe('List of issues this character died in.'),
  movies: z.array(z.any()).optional().describe('Movies the character was in.'),
  name: z.string().optional().default('Unknown Character').describe('Name of the character.'),
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
  id: z.number().optional().default(() => Math.floor(1000000 + Math.random() * 9000000)).describe('Unique ID of the issue.'),
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
  id: z.number().optional().default(() => Math.floor(1000000 + Math.random() * 9000000)).describe('Unique ID of the movie.'),
  image: ImageSchema.optional().describe('Main image of the movie.'),
  locations: z.array(z.any()).optional().describe('Locations related to the movie.'),
  name: z.string().optional().default('Unknown Movie').describe('Name of the movie.'),
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

// Volume schema
export const VolumeSchema = z.object({
  aliases: z.string().nullable().optional().describe('List of aliases the volume is known by.'),
  api_detail_url: z.string().nullable().optional().describe('URL pointing to the volume detail resource.'),
  character_credits: z.array(z.any()).optional().describe('A list of characters that appear in this volume.'),
  concept_credits: z.array(z.any()).optional().describe('A list of concepts that appear in this volume.'),
  count_of_issues: z.number().optional().describe('Number of issues included in this volume.'),
  date_added: z.string().nullable().optional().describe('Date the volume was added to Comic Vine.'),
  date_last_updated: z.string().nullable().optional().describe('Date the volume was last updated on Comic Vine.'),
  deck: z.string().nullable().optional().describe('Brief summary of the volume.'),
  description: z.string().nullable().optional().describe('Description of the volume.'),
  first_issue: z.union([z.object({}), z.null()]).optional().describe('The first issue in this volume.'),
  id: z.number().optional().default(() => Math.floor(1000000 + Math.random() * 9000000)).describe('Unique ID of the volume.'),
  image: ImageSchema.optional().describe('Main image of the volume.'),
  last_issue: z.union([z.object({}), z.null()]).optional().describe('The last issue in this volume.'),
  location_credits: z.array(z.any()).optional().describe('List of locations that appeared in this volume.'),
  name: z.string().optional().default('Unknown Volume').describe('Name of the volume.'),
  object_credits: z.array(z.any()).optional().describe('List of objects that appeared in this volume.'),
  person_credits: z.array(z.any()).optional().describe('List of people that worked on this volume.'),
  publisher: z.union([z.object({}), z.null()]).optional().describe('The primary publisher a volume is attached to.'),
  site_detail_url: z.string().nullable().optional().describe('URL pointing to the volume on Comic Vine.'),
  start_year: z.string().nullable().optional().describe('The first year this volume appeared in comics.'),
  team_credits: z.array(z.any()).optional().describe('List of teams that appear in this volume.')
});

// Volumes list response
export const VolumesResponseSchema = ResponseStatusSchema.extend({
  results: z.array(VolumeSchema)
});

// Publisher schema
export const PublisherSchema = z.object({
  aliases: z.string().nullable().optional().describe('List of aliases the publisher is known by.'),
  api_detail_url: z.string().nullable().optional().describe('URL pointing to the publisher detail resource.'),
  characters: z.array(z.any()).optional().describe('Characters related to the publisher.'),
  date_added: z.string().nullable().optional().describe('Date the publisher was added to Comic Vine.'),
  date_last_updated: z.string().nullable().optional().describe('Date the publisher was last updated on Comic Vine.'),
  deck: z.string().nullable().optional().describe('Brief summary of the publisher.'),
  description: z.string().nullable().optional().describe('Description of the publisher.'),
  id: z.number().optional().default(() => Math.floor(1000000 + Math.random() * 9000000)).describe('Unique ID of the publisher.'),
  image: ImageSchema.optional().describe('Main image of the publisher.'),
  location_address: z.string().nullable().optional().describe('Street address of the publisher.'),
  location_city: z.string().nullable().optional().describe('City the publisher resides in.'),
  location_state: z.string().nullable().optional().describe('State the publisher resides in.'),
  name: z.string().optional().default('Unknown Publisher').describe('Name of the publisher.'),
  site_detail_url: z.string().nullable().optional().describe('URL pointing to the publisher on Comic Vine.'),
  story_arcs: z.array(z.any()).optional().describe('List of story arcs tied to this publisher.'),
  teams: z.array(z.any()).optional().describe('List of teams this publisher is a member of.'),
  volumes: z.array(z.any()).optional().describe('List of volumes this publisher has put out.')
});

// Publishers list response
export const PublishersResponseSchema = ResponseStatusSchema.extend({
  results: z.array(PublisherSchema)
});

// Search results schema
export const SearchResultSchema = z.object({
  resource_type: z.string().optional().default('unknown').describe('The type of resource the result is mapped to.'),
  id: z.number().optional().default(() => Math.floor(1000000 + Math.random() * 9000000)).describe('Unique ID of the resource.'),
  name: z.string().nullable().optional().describe('Name of the resource.'),
  api_detail_url: z.string().optional().describe('URL pointing to the detail resource.'),
  image: ImageSchema.optional().describe('Main image of the resource.'),
  deck: z.string().nullable().optional().describe('Brief summary of the resource.')
});

// Search response
export const SearchResponseSchema = ResponseStatusSchema.extend({
  results: z.array(SearchResultSchema)
});

// Team schema
export const TeamSchema = z.object({
  aliases: z.string().nullable().optional().describe('List of aliases the team is known by.'),
  api_detail_url: z.string().nullable().optional().describe('URL pointing to the team detail resource.'),
  character_enemies: z.array(z.any()).optional().describe('List of characters that are enemies with this team.'),
  character_friends: z.array(z.any()).optional().describe('List of characters that are friends with this team.'),
  characters: z.array(z.any()).optional().describe('Characters related to the team.'),
  count_of_issue_appearances: z.number().optional().describe('Number of issues this team appears in.'),
  count_of_team_members: z.number().optional().describe('Number of team members in this team.'),
  date_added: z.string().nullable().optional().describe('Date the team was added to Comic Vine.'),
  date_last_updated: z.string().nullable().optional().describe('Date the team was last updated on Comic Vine.'),
  deck: z.string().nullable().optional().describe('Brief summary of the team.'),
  description: z.string().nullable().optional().describe('Description of the team.'),
  disbanded_in_issues: z.array(z.any()).optional().describe('List of issues this team disbanded in.'),
  first_appeared_in_issue: z.union([z.object({}), z.null()]).optional().describe('Issue where the team made its first appearance.'),
  id: z.number().optional().default(() => Math.floor(1000000 + Math.random() * 9000000)).describe('Unique ID of the team.'),
  image: ImageSchema.optional().describe('Main image of the team.'),
  issue_credits: z.array(z.any()).optional().describe('List of issues this team appears in.'),
  issues_disbanded_in: z.array(z.any()).optional().describe('List of issues this team disbanded in.'),
  movies: z.array(z.any()).optional().describe('Movies the team was in.'),
  name: z.string().optional().default('Unknown Team').describe('Name of the team.'),
  publisher: z.union([z.object({}), z.null()]).optional().describe('The primary publisher a team is attached to.'),
  site_detail_url: z.string().nullable().optional().describe('URL pointing to the team on Comic Vine.'),
  story_arc_credits: z.array(z.any()).optional().describe('List of story arcs this team appears in.'),
  volume_credits: z.array(z.any()).optional().describe('List of comic volumes this team appears in.')
});

// Teams list response
export const TeamsResponseSchema = ResponseStatusSchema.extend({
  results: z.array(TeamSchema)
});

// HTML response schema
export const HtmlResponseSchema = z.object({
  html: z.string(),
  count: z.number(),
  total: z.number(),
  message: z.string()
});

// Input schemas for tool parameters

// Character by ID schema
export const GetCharacterByIdSchema = z.object({
  characterId: z.number().describe('Unique identifier for the character'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Characters list schema
export const GetCharactersSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Issue by ID schema
export const GetIssueByIdSchema = z.object({
  issueId: z.number().describe('Unique identifier for the issue'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Issues list schema
export const GetIssuesSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Issues for character schema - extends character ID schema with pagination
export const GetIssuesForCharacterSchema = z.object({
  characterId: z.number().describe('Unique identifier for the character'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

// Characters for issue schema - extends issue ID schema with pagination
export const GetCharactersForIssueSchema = z.object({
  issueId: z.number().describe('Unique identifier for the issue'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

// Get issues by character name schema (for more user-friendly searching)
export const GetIssuesByCharacterNameSchema = z.object({
  filter: z.string().describe('Name of the character (e.g., "Superman", "Batman")'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

// Search schema
export const SearchSchema = z.object({
  query: z.string().describe('Search query string'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  resources: z
    .string()
    .optional()
    .describe('Comma-separated list of resource types to search for. Available options are: character, concept, origin, object, location, issue, story_arc, volume, publisher, person, team, video'),
  limit: z.number().min(1).max(100).optional().default(10).describe('Limit results (max 100, defaults to 10)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

// HTML generation schema
export const GenerateComicsHtmlSchema = z.object({
  title: z.string().optional().describe('Custom title for the HTML page'),
  // Include relevant parameters from GetIssuesSchema
  name: z.string().optional().describe('Filter by issue name'),
  issueNumber: z.string().optional().describe('Filter by issue number'),
  characters: z.string().optional().describe('Filter by character IDs'),
  creators: z.string().optional().describe('Filter by creator IDs'),
  orderBy: z.string().optional().describe('Order results by this field'),
  limit: z.number().optional().default(20).describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

// Movie by ID schema
export const GetMovieByIdSchema = z.object({
  movieId: z.number().describe('Unique identifier for the movie'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Movies list schema
export const GetMoviesSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., name:asc)'),
  filter: z.string().optional().describe(`
    Filter results by field values:
    Single: field:value (example: filter=name:Batman), 
    Multiple: field:value,field:value (example: filter=name:Batman,deck:Batman),
    Date: field:start|end
  `)
});

// Movies by character schema
export const GetMoviesByCharacterSchema = z.object({
  filter: z.string().describe('Name of the character (e.g., "filter=name:Batman,deck:Batman")'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

// Publisher by ID schema
export const GetPublisherByIdSchema = z.object({
  publisherId: z.number().describe('Unique identifier for the publisher'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Publishers list schema
export const GetPublishersSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Team by ID schema
export const GetTeamByIdSchema = z.object({
  teamId: z.number().describe('Unique identifier for the team'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Teams list schema
export const GetTeamsSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Volume by ID schema
export const GetVolumeByIdSchema = z.object({
  volumeId: z.number().describe('Unique identifier for the volume'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Volumes list schema
export const GetVolumesSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Concept by ID schema
export const GetConceptByIdSchema = z.object({
  conceptId: z.number().describe('Unique identifier for the concept'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Concepts list schema
export const GetConceptsSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Location by ID schema
export const GetLocationByIdSchema = z.object({
  locationId: z.number().describe('Unique identifier for the location'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Locations list schema
export const GetLocationsSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Object by ID schema
export const GetObjectByIdSchema = z.object({
  objectId: z.number().describe('Unique identifier for the object'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Objects list schema
export const GetObjectsSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Story Arc by ID schema
export const GetStoryArcByIdSchema = z.object({
  storyArcId: z.number().describe('Unique identifier for the story arc'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Story Arcs list schema
export const GetStoryArcsSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Person by ID schema
export const GetPersonByIdSchema = z.object({
  personId: z.number().describe('Unique identifier for the person'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// People list schema
export const GetPeopleSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end')
});

// Video by ID schema
export const GetVideoByIdSchema = z.object({
  videoId: z.number().describe('Unique identifier for the video'),
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated')
});

// Videos list schema
export const GetVideosSchema = z.object({
  format: z.string().optional().describe('The data format of the response: xml, json, or jsonp'),
  field_list: z.string().optional().describe('List of field names to include in the response, comma-separated'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set'),
  sort: z.string().optional().describe('Field and direction to sort by (e.g., field:asc or field:desc)'),
  filter: z.string().optional().describe('Filter results by field values. Single: field:value, Multiple: field:value,field:value, Date: field:start|end'),
  subscriber_only: z.boolean().optional().describe('Filter for subscriber-only content'),
  video_type: z.string().optional().describe('Filters results by video_type ID')
});

