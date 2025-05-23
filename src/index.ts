#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { dcComicsTools, ToolName } from './tools/tools.js';
import { instructions } from './instructions.js';

const server = new Server(
  {
    name: 'dc-comics-mcp',
    version: '1.2.2',
    description: 'An MCP Server to retrieve DC Comics information via the Comic Vine API.',
  },
  {
    capabilities: {
      tools: {},
    },
    instructions
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  // Use console.error to log the request since stdout is reserved for JSON-RPC communication
  console.error('Processing tool list request');
  return {
    tools: Object.entries(dcComicsTools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.schema),
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Use console.error to log the request since stdout is reserved for JSON-RPC communication
  console.error(`Processing tool request: ${request.params.name}`);

  if (!request.params.arguments) {
    throw new Error('Arguments are required');
  }

  const { name, arguments: args } = request.params;

  if (!(name in dcComicsTools)) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const tool = dcComicsTools[name as ToolName];

  if (!tool) {
    throw new Error(`Tool not found: ${name}`);
  }
  
  try {
    const result = await tool.handler(args);
    
    console.error(`Completed tool request: ${name}`);

    // Special handling for HTML content from generate_comics_html tool
    if (name === 'generate_comics_html' && 'html' in result) {
      return {
        content: [
          { 
            type: 'text', 
            text: result.html 
          }
        ],
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result) }],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error processing ${name}: ${error.message}`);
    }
    throw error;
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DC Comics MCP Server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});