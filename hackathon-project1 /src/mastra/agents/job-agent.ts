import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { jobSearchTool } from '../tools/job-search-tool';
import { coverLetterTool } from '../tools/cover-letter-tool';
import { jobApplicationTool } from '../tools/job-application-tool';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Retrieve the OpenAI API key from environment variables
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error('OpenAI API key is not set in the environment variables.');
}

// Create the Job Agent with the OpenAI provider
export const jobAgent = new Agent({
  name: 'Job Agent',
  instructions: `
    You are a helpful career assistant that provides personalized job search support.

    Your primary function is to help users find jobs that match their career aspirations, write cover letters, and automatically apply to jobs on their behalf.

    When responding:
    - Ask the user for career aspirations, location preferences, skills, experience, and other relevant details.
    - Use job search tools to find job listings based on the user's profile.
    - Offer assistance in writing personalized cover letters for applications.
    - Automatically apply to the relevant job listings on the user's behalf.
    - Keep responses concise, friendly, and professional.

    Use the jobSearchTool, coverLetterTool, and jobApplicationTool to complete the tasks.
  `,
  model: {
    id: 'openai/gpt-3.5-turbo', // Use provider-prefixed model id
    apiKey: openaiApiKey,       // Pass the API key from .env
  },
  tools: { jobSearchTool, coverLetterTool, jobApplicationTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});


