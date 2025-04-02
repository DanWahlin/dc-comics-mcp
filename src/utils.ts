import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

const COMIC_VINE_API_KEY = process.env.COMIC_VINE_API_KEY as string;
const COMIC_VINE_API_BASE = process.env.COMIC_VINE_API_BASE as string;

if (!COMIC_VINE_API_KEY) throw new Error('Missing COMIC_VINE_API_KEY env variable');
if (!COMIC_VINE_API_BASE) throw new Error('Missing COMIC_VINE_API_BASE env variable');

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
