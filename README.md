<div align="center">

<img src="./images/batman.jpg" alt="" align="center" width="125" />

# DC Comics MCP Server

[![Open project in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-blue?style=flat-square&logo=github)](https://codespaces.new/danwahlin/dc-comics-mcp?hide_repo_select=true&ref=main&quickstart=true)
![Node version](https://img.shields.io/badge/Node.js->=20-3c873a?style=flat-square)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#features) • [Tools](#tools) • [Setup](#setup) • [Configuring an MCP Host](#configuring-an-mcp-host)

</div>

MCP Server for the [Comic Vine API](https://comicvine.gamespot.com/api/), enabling interaction with DC Comics characters and issues data. *The main goal of the project is to show how an MCP server can be used to interact with APIs.*

> **Note**: All data and images returned by this MCP server are fetched from the [Comic Vine API](https://comicvine.gamespot.com/api/). This project is not affiliated with Comic Vine or DC Comics in any way. Documentation for the Comic Vine API can be found [here](https://comicvine.gamespot.com/api/documentation#toc-0-2).

<div align="center">
  <a href="https://youtu.be/vBoqsLysHTg" target="_blank">
    <img src="./images/animated-dc-comics-image.png" alt="DC Comics MCP Server Demo" width="640">
    <br>
    <em>Click to view demo video</em>
  </a>
</div>

<a name="features"></a>
## 🔧 Features

- **List DC Comics Characters**: Supports filters like `name`, `nameStartsWith`, `limit`, and more.
- **Fetch a DC Comics Character by ID**: Get detailed info on any character using their `characterId`.
- **Search Across Resources**: Search for characters, issues, volumes, and more using the `search` tool.
- **Fetch Issues for a Character**: Get a list of comic issues featuring a specific character.
- **Tool-based MCP integration**: Register this server with Model Context Protocol (MCP) tools (VS Code, Claude, etc.).
- **Environment Configuration**: Use `.env` file to manage environment variables like `COMIC_VINE_API_KEY` and `COMIC_VINE_API_BASE`.

<a name="tools"></a>
## 🧰 Tools

### 1. `get_characters` 🔍🦸‍♂️
- **Description**: Fetch DC Comics characters with optional filters.
- **Inputs**:
  - `name` (optional string): Filter characters by name.
  - `nameStartsWith` (optional string): Filter characters whose names start with the specified string.
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
  - `modifiedSince` (optional string): Filter characters modified since this date.
  - `series`, `events`, `stories` (optional string): Filter by related entities.
  - `orderBy` (optional string): Fields to order the results by.
  - `limit` (optional number): Maximum number of results to return (1–100).
  - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with matching characters.

### 2. `get_character_by_id` 🆔🦸
- **Description**: Fetch a DC Comics character by their unique ID.
- **Inputs**:
  - `characterId` (number): The unique ID of the character.
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
- **Returns**: JSON response with the character's details.

### 3. `get_issues_for_character` 📚🎭
- **Description**: Fetch issues featuring a specific character.
- **Inputs**:
  - `characterId` (number): The unique ID of the character.
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
  - `limit` (optional number): Maximum number of results to return (1–100).
  - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with issues featuring the specified character.

### 4. `get_issues` 📖🕵️‍♂️
- **Description**: Fetch lists of DC Comics issues with optional filters.
- **Inputs**:
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
  - `format` (optional string): Filter by the issue format.
  - `name` (optional string): Filter by issue name.
  - `dateDescriptor`, `dateRange` (optional string): Filter by date.
  - `title`, `titleStartsWith` (optional string): Filter by title.
  - `issueNumber` (optional string): Filter by issue number.
  - `characters`, `creators` (optional string): Filter by related entities.
  - `orderBy` (optional string): Fields to order the results by.
  - `limit` (optional number): Maximum number of results to return (1–100).
  - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with matching issues.

### 5. `get_issue_by_id` 🆔📘
- **Description**: Fetch a single DC Comics issue by its unique ID.
- **Inputs**:
  - `issueId` (number): The unique ID of the issue.
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
- **Returns**: JSON response with the issue details.

### 6. `get_characters_for_issue` 🦸‍♀️📖
- **Description**: Fetch DC Comics characters appearing in a specific issue.
- **Inputs**:
  - `issueId` (number): The unique ID of the issue.
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
  - `limit` (optional number): Maximum number of results to return (1–100).
  - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with characters appearing in the specified issue.

### 7. `get_issues_by_character_name` 🦸‍♂️📚
- **Description**: Fetch DC Comics issues featuring a specific character by name directly.
- **Inputs**:
  - `filter` (string): Name of the character or other filter criteria (e.g., "Batman", "Superman").
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
  - `limit` (optional number): Maximum number of results to return (1–100).
  - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with issues featuring the specified character.

### 8. `get_movies` 🎬🦸
- **Description**: Fetch DC Comics movies with optional filters.
- **Inputs**:
  - `filter` (optional string): Filter movies by name or other criteria (e.g., "name:Batman,deck:Batman").
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
  - `limit` (optional number): Maximum number of results to return (1–100).
  - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with matching movies.

### 9. `get_movie_by_id` 🎥🆔
- **Description**: Fetch a DC Comics movie by its unique ID.
- **Inputs**:
  - `movieId` (number): The unique ID of the movie.
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
- **Returns**: JSON response with the movie details.

### 10. `search` 🔎📚
- **Description**: Search across DC Comics resources (characters, issues, volumes, etc.).
- **Inputs**:
  - `query` (string): Search query string.
  - `resources` (optional string): Comma-separated list of resource types to search for (e.g., "character,issue").
  - `field_list` (optional string): List of fields to include in the response, comma-separated.
  - `limit` (optional number): Maximum number of results to return (1–100).
  - `offset` (optional number): Number of results to skip for pagination.
- **Returns**: JSON response with search results.

<a name="setup"></a>
## 🛠️ Setup

Sign up for a [Comic Vine API](https://comicvine.gamespot.com/api/) key.

If you want to run it directly in an MCP host, jump to the [Use with Claude Desktop](#use-with-claude-desktop) or [Use with GitHub Copilot](#use-with-github-copilot) sections.

### Run the Server Locally with MCP Inspector

If you'd like to run MCP Inspector locally to test the server, follow these steps:

1. Clone this repository:

    ```bash
    git clone https://github.com/DanWahlin/dc-comics-mcp
    ```

1. Rename `.env.template ` to `.env`.

1. Add your Comic Vine API key to the `.env` file.

    ```bash
    COMIC_VINE_API_KEY=YOUR_API_KEY
    COMIC_VINE_API_BASE=https://comicvine.gamespot.com/api
    ```
1. Install the required dependencies and build the project.

    ```bash
    npm install
    npm run build
    ```

1. (Optional) To try out the server using MCP Inspector run the following command:

    ```bash
    # Start the MCP Inspector
    npx @modelcontextprotocol/inspector node build/index.js
    ```

    Visit the MCP Inspector URL shown in the console in your browser. Change `Arguments` to `dist/index.js` and select `Connect`. Select `List Tools` to see the available tools.

<a name="configuring-an-mcp-host"></a>
## Configuring an MCP Host

### Use with Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dc-comics-mcp": {
      "type": "stdio",
      "command": "npx",
      // "command": "node",
      "args": [
          "-y",
          "@codewithdan/dc-comics-mcp"
          // "/PATH/TO/dc-comics-mcp/dist/index.js"
      ],
      "env": {
        "COMIC_VINE_API_KEY": "YOUR_API_KEY",
        "COMIC_VINE_API_BASE": "https://comicvine.gamespot.com/api"
      }
    }
  }
}
```

### Use with GitHub Copilot (VS Code Insiders)

> **Note**: If you already have the MCP server enabled with Claude Desktop, add `chat.mcp.discovery.enabled: true` in your VS Code settings and it will discover existing MCP server lists.

Add the following to your `settings.json` file (note that you can also add it to the `.vscode/mcp.json` file if you want it for a specific repo):

   ```json
   "mcp": {
      "inputs": [
          {
              "type": "promptString",
              "id": "comic-vine-api-key",
              "description": "Comic Vine API Key",
              "password": true
          }
      ],
      "servers": {
        "dc-comics-mcp": {
            "command": "npx",
            // "command": "node",
            "args": [
                "-y",
                "@codewithdan/dc-comics-mcp"
                // "/PATH/TO/dc-comics-mcp/dist/index.js"
            ],
            "env": {
                "COMIC_VINE_API_KEY": "${input:comic-vine-api-key}",
                "COMIC_VINE_API_BASE": "https://comicvine.gamespot.com/api"
            }
        }
      }
   }
   ```

### Using Tools in GitHub Copilot

1. Now that the mcp server is discoverable, open GitHub Copilot and select the `Agent` mode (not `Chat` or `Edits`).
2. Select the "refresh" button in the Copilot chat text field to refresh the server list.
3. Select the "🛠️" button to see all the possible tools, including the ones from this repo.
4. Put a question in the chat that would naturally invoke one of the tools, for example: 

    ```
    Show 10 Batman comics. Include cover images.

    What teams has Batman been part of?
    
    Show me Wonder Woman's appearances in Justice League comics.

    Show me some Superman comics. Include cover images.
    
    Who are the top 5 villains in the DC universe? Include images.
    
    Find comics where Joker and Batman appear together.
    
    Show me the most recent Flash comics.
    
    What are the most popular Aquaman story arcs? Include images.
    
    Display Green Lantern comics from the 1990s.
    
    Show some of Darkseid's appearances in comics. Include cover images.
    
    Show me comics featuring the Suicide Squad.
    
    Find crossover events with Justice League and Teen Titans.
    
    List comics where Harley Quinn is the main character. Show cover images.
    
    Show me the origin story comics for Wonder Woman. Include cover images.

    What movies has Batman been in? Show movie images.
    ```

    > **Note**: If you see "Sorry, the response was filtered by the Responsible AI Service.", try running it again or rephrasing the prompt.

### Examples: Using the DC Comics MCP Tools in GitHub Copilot

  `What movies has Batman been in? Show movie images.`

  ![GitHub Copilot example with DC Comics MCP tools](./images/ghcp-example.png)

  `Show 10 Batman comics. Include cover image URLs.`

  ![GitHub Copilot example with DC Comics MCP tools](./images/ghcp-example-batman.png)


