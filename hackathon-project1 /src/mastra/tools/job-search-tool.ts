import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const JOB_API_URL = 'https://jobs.github.com/positions.json'; // GitHub Jobs API

export const jobSearchTool = createTool({
  id: 'search-jobs',
  description: 'Search for real-time jobs based on user preferences.',
  inputSchema: z.object({
    location: z.string().describe('Preferred job location'),
    role: z.string().describe('Desired job title or role'),
    skills: z.array(z.string()).describe('List of skills'),
    experience: z.string().describe('Experience level (e.g., "Junior", "Senior")'),
  }),
  outputSchema: z.array(
    z.object({
      jobTitle: z.string(),
      company: z.string(),
      location: z.string(),
      description: z.string(),
      url: z.string(),
    })
  ),
  execute: async ({ context }) => {
    return await searchJobs(
      context.location,
      context.role,
      context.skills,
      context.experience
    );
  },
});

const searchJobs = async (
  location: string,
  role: string,
  skills: string[],
  experience: string
): Promise<any[]> => {
  const jobSearchUrl = `${JOB_API_URL}?description=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`;

  try {
    const response = await fetch(jobSearchUrl);
    const jobs = await response.json();

    return jobs.map((job: any) => ({
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      url: job.url,
    }));
  } catch (error) {
    throw new Error('Error fetching jobs');
  }
};
