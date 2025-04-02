// schemas.ts
import { z } from 'zod';

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
  aliases: z.string().optional().describe('List of aliases the character is known by. A \\n (newline) seperates each alias.'),
  api_detail_url: z.string().optional().describe('URL pointing to the character detail resource.'),
  birth: z.string().optional().describe('A date, if one exists, that the character was born on. Not an origin date.'),
  character_enemies: z.array(z.any()).optional().describe('List of characters that are enemies with this character.'),
  character_friends: z.array(z.any()).optional().describe('List of characters that are friends with this character.'),
  count_of_issue_appearances: z.number().optional().describe('Number of issues this character appears in.'),
  creators: z.array(z.any()).optional().describe('List of the real life people who created this character.'),
  date_added: z.string().optional().describe('Date the character was added to Comic Vine.'),
  date_last_updated: z.string().optional().describe('Date the character was last updated on Comic Vine.'),
  deck: z.string().optional().describe('Brief summary of the character.'),
  description: z.string().optional().describe('Description of the character.'),
  first_appeared_in_issue: z.object({}).optional().describe('Issue where the character made its first appearance.'),
  gender: z.union([z.literal('Male'), z.literal('Female'), z.literal('Other')]).optional().describe('Gender of the character.'),
  id: z.number().describe('Unique ID of the character.'),
  image: ImageSchema.optional().describe('Main image of the character.'),
  issue_credits: z.array(z.any()).optional().describe('List of issues this character appears in.'),
  issues_died_in: z.array(z.any()).optional().describe('List of issues this character died in.'),
  movies: z.array(z.any()).optional().describe('Movies the character was in.'),
  name: z.string().describe('Name of the character.'),
  origin: z.string().optional().describe('The origin of the character. Human, Alien, Robot ...etc'),
  powers: z.array(z.any()).optional().describe('List of super powers a character has.'),
  publisher: z.object({}).optional().describe('The primary publisher a character is attached to.'),
  real_name: z.string().optional().describe('Real name of the character.'),
  site_detail_url: z.string().optional().describe('URL pointing to the character on Comic Vine.'),
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
  aliases: z.string().optional().describe('List of aliases the issue is known by.'),
  api_detail_url: z.string().optional().describe('URL pointing to the issue detail resource.'),
  character_credits: z.array(z.any()).optional().describe('A list of characters that appear in this issue.'),
  characters_died_in: z.array(z.any()).optional().describe('A list of characters that died in this issue.'),
  concept_credits: z.array(z.any()).optional().describe('A list of concepts that appear in this issue.'),
  cover_date: z.string().optional().describe('The publish date printed on the cover of an issue.'),
  date_added: z.string().optional().describe('Date the issue was added to Comic Vine.'),
  date_last_updated: z.string().optional().describe('Date the issue was last updated on Comic Vine.'),
  deck: z.string().optional().describe('Brief summary of the issue.'),
  description: z.string().optional().describe('Description of the issue.'),
  disbanded_teams: z.array(z.any()).optional().describe('A list of teams that disbanded in this issue.'),
  first_appearance_characters: z.array(z.any()).optional().describe('A list of characters in which this issue is the first appearance of the character.'),
  first_appearance_concepts: z.array(z.any()).optional().describe('A list of concepts in which this issue is the first appearance of the concept.'),
  first_appearance_locations: z.array(z.any()).optional().describe('A list of locations in which this issue is the first appearance of the location.'),
  first_appearance_objects: z.array(z.any()).optional().describe('A list of objects in which this issue is the first appearance of the object.'),
  first_appearance_storyarcs: z.array(z.any()).optional().describe('A list of storyarcs in which this issue is the first appearance of the story arc.'),
  first_appearance_teams: z.array(z.any()).optional().describe('A list of teams in which this issue is the first appearance of the team.'),
  has_staff_review: z.boolean().optional(),
  id: z.number().describe('Unique ID of the issue.'),
  image: ImageSchema.optional().describe('Main image of the issue.'),
  issue_number: z.string().optional().describe('The number assigned to the issue within the volume set.'),
  location_credits: z.array(z.any()).optional().describe('List of locations that appeared in this issue.'),
  name: z.string().optional().describe('Name of the issue.'),
  object_credits: z.array(z.any()).optional().describe('List of objects that appeared in this issue.'),
  person_credits: z.array(z.any()).optional().describe('List of people that worked on this issue.'),
  site_detail_url: z.string().optional().describe('URL pointing to the issue on Comic Vine.'),
  store_date: z.string().optional().describe('The date the issue was first sold in stores.'),
  story_arc_credits: z.array(z.any()).optional().describe('List of story arcs this issue appears in.'),
  team_credits: z.array(z.any()).optional().describe('List of teams that appear in this issue.'),
  teams_disbanded_in: z.array(z.any()).optional().describe('List of teams that disbanded in this issue.'),
  volume: z.object({}).optional().describe('The volume this issue is a part of.')
});

// Issues list response
export const IssuesResponseSchema = ResponseStatusSchema.extend({
  results: z.array(IssueSchema)
});

// Volume schema
export const VolumeSchema = z.object({
  aliases: z.string().optional().describe('List of aliases the volume is known by.'),
  api_detail_url: z.string().optional().describe('URL pointing to the volume detail resource.'),
  character_credits: z.array(z.any()).optional().describe('A list of characters that appear in this volume.'),
  concept_credits: z.array(z.any()).optional().describe('A list of concepts that appear in this volume.'),
  count_of_issues: z.number().optional().describe('Number of issues included in this volume.'),
  date_added: z.string().optional().describe('Date the volume was added to Comic Vine.'),
  date_last_updated: z.string().optional().describe('Date the volume was last updated on Comic Vine.'),
  deck: z.string().optional().describe('Brief summary of the volume.'),
  description: z.string().optional().describe('Description of the volume.'),
  first_issue: z.object({}).optional().describe('The first issue in this volume.'),
  id: z.number().describe('Unique ID of the volume.'),
  image: ImageSchema.optional().describe('Main image of the volume.'),
  last_issue: z.object({}).optional().describe('The last issue in this volume.'),
  location_credits: z.array(z.any()).optional().describe('List of locations that appeared in this volume.'),
  name: z.string().describe('Name of the volume.'),
  object_credits: z.array(z.any()).optional().describe('List of objects that appeared in this volume.'),
  person_credits: z.array(z.any()).optional().describe('List of people that worked on this volume.'),
  publisher: z.object({}).optional().describe('The primary publisher a volume is attached to.'),
  site_detail_url: z.string().optional().describe('URL pointing to the volume on Comic Vine.'),
  start_year: z.string().optional().describe('The first year this volume appeared in comics.'),
  team_credits: z.array(z.any()).optional().describe('List of teams that appear in this volume.')
});

// Volumes list response
export const VolumesResponseSchema = ResponseStatusSchema.extend({
  results: z.array(VolumeSchema)
});

// Publisher schema
export const PublisherSchema = z.object({
  aliases: z.string().optional().describe('List of aliases the publisher is known by.'),
  api_detail_url: z.string().optional().describe('URL pointing to the publisher detail resource.'),
  characters: z.array(z.any()).optional().describe('Characters related to the publisher.'),
  date_added: z.string().optional().describe('Date the publisher was added to Comic Vine.'),
  date_last_updated: z.string().optional().describe('Date the publisher was last updated on Comic Vine.'),
  deck: z.string().optional().describe('Brief summary of the publisher.'),
  description: z.string().optional().describe('Description of the publisher.'),
  id: z.number().describe('Unique ID of the publisher.'),
  image: ImageSchema.optional().describe('Main image of the publisher.'),
  location_address: z.string().optional().describe('Street address of the publisher.'),
  location_city: z.string().optional().describe('City the publisher resides in.'),
  location_state: z.string().optional().describe('State the publisher resides in.'),
  name: z.string().describe('Name of the publisher.'),
  site_detail_url: z.string().optional().describe('URL pointing to the publisher on Comic Vine.'),
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
  resource_type: z.string().describe('The type of resource the result is mapped to.'),
  id: z.number().describe('Unique ID of the resource.'),
  name: z.string().describe('Name of the resource.'),
  api_detail_url: z.string().optional().describe('URL pointing to the detail resource.'),
  image: ImageSchema.optional().describe('Main image of the resource.'),
  deck: z.string().optional().describe('Brief summary of the resource.')
});

// Search response
export const SearchResponseSchema = ResponseStatusSchema.extend({
  results: z.array(SearchResultSchema)
});

// Team schema
export const TeamSchema = z.object({
  aliases: z.string().optional().describe('List of aliases the team is known by.'),
  api_detail_url: z.string().optional().describe('URL pointing to the team detail resource.'),
  character_enemies: z.array(z.any()).optional().describe('List of characters that are enemies with this team.'),
  character_friends: z.array(z.any()).optional().describe('List of characters that are friends with this team.'),
  characters: z.array(z.any()).optional().describe('Characters related to the team.'),
  count_of_issue_appearances: z.number().optional().describe('Number of issues this team appears in.'),
  count_of_team_members: z.number().optional().describe('Number of team members in this team.'),
  date_added: z.string().optional().describe('Date the team was added to Comic Vine.'),
  date_last_updated: z.string().optional().describe('Date the team was last updated on Comic Vine.'),
  deck: z.string().optional().describe('Brief summary of the team.'),
  description: z.string().optional().describe('Description of the team.'),
  disbanded_in_issues: z.array(z.any()).optional().describe('List of issues this team disbanded in.'),
  first_appeared_in_issue: z.object({}).optional().describe('Issue where the team made its first appearance.'),
  id: z.number().describe('Unique ID of the team.'),
  image: ImageSchema.optional().describe('Main image of the team.'),
  issue_credits: z.array(z.any()).optional().describe('List of issues this team appears in.'),
  issues_disbanded_in: z.array(z.any()).optional().describe('List of issues this team disbanded in.'),
  movies: z.array(z.any()).optional().describe('Movies the team was in.'),
  name: z.string().describe('Name of the team.'),
  publisher: z.object({}).optional().describe('The primary publisher a team is attached to.'),
  site_detail_url: z.string().optional().describe('URL pointing to the team on Comic Vine.'),
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
export const GetCharactersSchema = z.object({
  name: z.string().optional().describe('Character name filter'),
  nameStartsWith: z.string().optional().describe('Filter characters by name starting with this value'),
  modifiedSince: z.string().optional().describe('Return only characters modified since this date'),
  series: z.string().optional().describe('Return only characters in this series ID'),
  events: z.string().optional().describe('Return only characters in this event ID'),
  stories: z.string().optional().describe('Return only characters in this story ID'),
  orderBy: z.string().optional().describe('Order results by this field'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

export const GetCharacterByIdSchema = z.object({
  characterId: z.number().describe('Unique identifier for the character')
});

export const GetIssuesSchema = z.object({
  format: z.string().optional().describe('Filter by issue format'),
  name: z.string().optional().describe('Filter by issue name'),
  dateDescriptor: z.string().optional().describe('Filter by date descriptor'),
  dateRange: z.string().optional().describe('Filter by date range'),
  title: z.string().optional().describe('Filter by title'),
  titleStartsWith: z.string().optional().describe('Filter by title starting with'),
  issueNumber: z.string().optional().describe('Filter by issue number'),
  characters: z.string().optional().describe('Filter by character IDs'),
  creators: z.string().optional().describe('Filter by creator IDs'),
  orderBy: z.string().optional().describe('Order results by this field'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

export const GetIssueByIdSchema = z.object({
  issueId: z.number().describe('Unique identifier for the issue')
});

export const GetIssuesForCharacterSchema = GetCharacterByIdSchema.extend({
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

export const GetCharactersForIssueSchema = GetIssueByIdSchema.extend({
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

export const SearchSchema = z.object({
  query: z.string().describe('Search query string'),
  resources: z.string().optional().describe('Comma-separated list of resource types to search for'),
  limit: z.number().min(1).max(100).optional().describe('Limit results (max 100)'),
  offset: z.number().optional().describe('Skip the specified number of resources in the result set')
});

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

