import { get_characters } from './get_characters/index.js';
import { get_character_by_id } from './get_character_by_id/index.js';
import { get_issues_for_character } from './get_issues_for_character/index.js';
import { get_issues } from './get_issues/index.js';
import { get_issue_by_id } from './get_issue_by_id/index.js';
import { get_characters_for_issue } from './get_characters_for_issue/index.js';
import { get_issues_by_character_name } from './get_issues_by_character_name/index.js';
import { get_movies } from './get_movies/index.js';
import { get_movie_by_id } from './get_movie_by_id/index.js';
import { search } from './search/index.js';

export const dcComicsTools = {
    get_characters,
    get_character_by_id,
    get_issues_for_character,
    get_issues,
    get_issue_by_id,
    get_characters_for_issue,
    get_issues_by_character_name,
    get_movies,
    get_movie_by_id,
    search
};

export type ToolName = keyof typeof dcComicsTools;