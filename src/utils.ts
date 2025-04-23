import { config } from 'dotenv';
import { z } from 'zod';
import { ResourcePrefix, ResponseStatusSchema, SearchResponseSchema } from './tools/schemas.js';
config();

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY as string;
const COMIC_VINE_API_BASE = process.env.COMIC_VINE_API_BASE as string;

if (!COMIC_VINE_API_KEY) throw new Error('Missing COMIC_VINE_API_KEY env variable');
if (!COMIC_VINE_API_BASE) throw new Error('Missing COMIC_VINE_API_BASE env variable');

// Define default field lists for different resource types
export const DEFAULT_FIELD_LISTS = {
    CHARACTER: 'aliases,character_enemies,character_friends,id,image,movies,name,powers,real_name,team_enemies,team_friends',
    ISSUE: 'id,name,image,issue_number,cover_date,description,character_credits',
    MOVIE: 'id,name,deck,description,image,release_date,runtime,rating,box_office_revenue,total_revenue,budget,studios,writers,producers'
};

// Helper function to create standardized API responses
export function createStandardResponse<T extends z.ZodType>(
    responseSchema: T, 
    dataOrError: Partial<z.infer<typeof ResponseStatusSchema>> & { results: any },
    defaultLimit = 20
): z.infer<T> {
    return responseSchema.parse({
        status_code: dataOrError.status_code || 1,
        error: dataOrError.error || 'OK',
        number_of_total_results: dataOrError.number_of_total_results || (Array.isArray(dataOrError.results) ? dataOrError.results.length : 1),
        number_of_page_results: dataOrError.number_of_page_results || (Array.isArray(dataOrError.results) ? dataOrError.results.length : 1),
        limit: dataOrError.limit || defaultLimit,
        offset: dataOrError.offset || 0,
        results: dataOrError.results || []
    });
}

// Helper function to create an empty results response
export function createEmptyResponse<T extends z.ZodType>(
    responseSchema: T,
    limit = 20,
    offset = 0
): z.infer<T> {
    return responseSchema.parse({
        status_code: 1,
        error: "OK",
        number_of_total_results: 0,
        number_of_page_results: 0,
        limit: limit,
        offset: offset,
        results: []
    });
}

/**
 * Helper function for fetching resources by ID with proper formatting
 * @param resourceType Type of resource (e.g., 'CHARACTER', 'ISSUE', 'MOVIE')
 * @param id Numeric ID of the resource
 * @param fieldList Optional field list to include in response
 * @param defaultFields Default fields to use if fieldList not provided
 * @returns Promise with the API response
 */
export async function getResourceById<T = any>(
    resourceType: keyof typeof ResourcePrefix,
    id: number,
    fieldList?: string,
    defaultFields?: string
): Promise<T> {
    // Format resource ID with the proper prefix
    const formattedId = formatResourceId(resourceType, id);
    
    // Set up parameters with default field list if not provided
    const params = {
        field_list: fieldList || (defaultFields || DEFAULT_FIELD_LISTS[resourceType as keyof typeof DEFAULT_FIELD_LISTS] || '')
    };
    
    // Make the API request
    const resourcePath = resourceType.toLowerCase();
    return await httpRequest<T>(`/${resourcePath}/${formattedId}`, params);
}

/**
 * Helper function to standardize parameter handling for list requests
 * @param endpoint API endpoint to request
 * @param args Request parameters
 * @param defaultResourceType Resource type for default field list
 * @returns Promise with the API response
 */
export async function getResourcesList<T = any>(
    endpoint: string,
    args: Record<string, any>,
    defaultResourceType?: keyof typeof DEFAULT_FIELD_LISTS
): Promise<T> {
    // Ensure field_list is set with defaults if not provided
    if (defaultResourceType && !args.field_list) {
        args.field_list = DEFAULT_FIELD_LISTS[defaultResourceType];
    }
    
    // Make the API request
    return await httpRequest<T>(endpoint, serializeQueryParams(args));
}

// API utility functions that can be used by multiple tools
// Reusable function for performing searches across DC Comics resources
export async function performDcComicsSearch(query: string, resources?: string, field_list?: string, limit?: number, offset?: number) {
    // Create params object with all available search parameters
    const params = serializeQueryParams({
        query,
        resources,
        field_list,
        limit,
        offset
    });
    
    // Make the API request to the search endpoint
    const res = await httpRequest('/search', params);
    
    // Process the results to ensure null names are handled correctly
    if (res.results && Array.isArray(res.results)) {
        res.results = res.results.map((item: { name: string | null }) => {
            // Ensure name is an empty string if it's null
            if (item.name === null) {
                item.name = '';
            }
            return item;
        });
    }
    
    // Validate the response with the SearchResponseSchema
    return SearchResponseSchema.parse(res);
}

// Helper function to format resource IDs with their proper prefix
export function formatResourceId(resourceType: keyof typeof ResourcePrefix, id: number): string {
    const prefix = ResourcePrefix[resourceType];
    return `${prefix}-${id}`;
  }

export function serializeQueryParams(params: Record<string, any>): Record<string, string | number | undefined> {
  const result: Record<string, string | number | undefined> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      result[key] = typeof value === 'boolean' ? String(value) : value;
    }
  }
  return result;
}

export async function httpRequest<T = any>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(`${COMIC_VINE_API_BASE}${endpoint}`);
  
  // Set format to json and add API key
  url.searchParams.set('format', 'json');
  url.searchParams.set('api_key', COMIC_VINE_API_KEY);

  // Add other parameters
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Comic Vine API error: ${res.status} - ${text}`);
  }

  return res.json() as Promise<T>;
}

/**
 * Generates an HTML page displaying comic issues with their cover images
 * 
 * @param issues Array of issue objects from the Comic Vine API
 * @param title Title for the HTML page
 * @returns HTML string
 */
export function generateComicsHtml(issues: any[], title: string): string {
  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(title)}</title>
      <style>
          body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              padding: 20px;
              margin: 0;
          }
          .header {
              background-color: #0282f9;  /* DC Comics blue */
              color: white;
              padding: 20px;
              margin-bottom: 20px;
              text-align: center;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          h1 {
              margin: 0;
          }
          .subheader {
              text-align: center;
              color: #666;
              margin-bottom: 20px;
          }
          .comics-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 20px;
              max-width: 1400px;
              margin: 0 auto;
          }
          .comic-card {
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              overflow: hidden;
              width: 300px;
              transition: transform 0.3s, box-shadow 0.3s;
          }
          .comic-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          }
          .comic-image-container {
              height: 450px;
              overflow: hidden;
              position: relative;
              background-color: #f0f0f0;
          }
          .comic-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s;
          }
          .comic-card:hover .comic-image {
              transform: scale(1.05);
          }
          .comic-info {
              padding: 15px;
          }
          .comic-title {
              font-weight: bold;
              margin-bottom: 5px;
              font-size: 1.1em;
          }
          .comic-issue {
              color: #666;
              font-size: 0.9em;
              margin-bottom: 8px;
          }
          .comic-description {
              font-size: 0.85em;
              color: #444;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
              margin-top: 8px;
          }
          .comic-date {
              font-size: 0.8em;
              color: #777;
              margin-top: 8px;
          }
          .footer {
              text-align: center;
              margin-top: 30px;
              padding: 20px;
              color: #666;
              font-size: 0.8em;
          }
          .empty-state {
              text-align: center;
              padding: 50px;
              color: #666;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <h1>${escapeHtml(title)}</h1>
      </div>
      <div class="subheader">
          <p>Showing ${issues.length} issues</p>
      </div>
      <div class="comics-container">
  `;

  if (issues.length === 0) {
    html += `
      <div class="empty-state">
          <h2>No issues found</h2>
          <p>Try adjusting your search parameters</p>
      </div>
      `;
  } else {
    issues.forEach(issue => {
      // Get the best available image URL
      const imgUrl = issue.image ? (issue.image.super_url || issue.image.screen_large_url || issue.image.medium_url) : '';
      const title = issue.name || issue.volume?.name || 'Unknown Title';
      const issueNumber = issue.issue_number || 'N/A';

      // Format date if available
      let dateStr = '';
      if (issue.cover_date) {
        const date = new Date(issue.cover_date);
        if (!isNaN(date.getTime())) {
          dateStr = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }

      // Get short description if available
      const description = issue.deck || issue.description || '';
      const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags

      html += `
          <div class="comic-card">
              <div class="comic-image-container">
                  <img class="comic-image" src="${imgUrl}" alt="${escapeHtml(title)}" onerror="this.src='https://comicvine.gamespot.com/a/uploads/original/0/40/1017179-noimage.png';">
              </div>
              <div class="comic-info">
                  <div class="comic-title">${escapeHtml(title)}</div>
                  <div class="comic-issue">Issue ${issueNumber}</div>
                  ${dateStr ? `<div class="comic-date">Cover Date: ${dateStr}</div>` : ''}
                  ${cleanDescription ? `<div class="comic-description">${escapeHtml(cleanDescription.substring(0, 150))}${cleanDescription.length > 150 ? '...' : ''}</div>` : ''}
              </div>
          </div>
          `;
    });
  }

  html += `
      </div>
      <div class="footer">
          <p>Data provided by Comic Vine. © ${new Date().getFullYear()} DC Comics</p>
      </div>
  </body>
  </html>
  `;

  return html;
}

/**
* Helper function to escape HTML special characters
*/
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
