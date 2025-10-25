import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const jobApplicationTool = createTool({
  id: 'apply-to-job',
  description: 'Apply to a job using the job URL and cover letter.',
  inputSchema: z.object({
    jobUrl: z.string().describe('The URL of the job listing'),
    coverLetter: z.string().describe('The cover letter to submit with the application'),
    userEmail: z.string().describe('Your email address for the application'),
  }),
  outputSchema: z.object({
    status: z.string(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    return await applyToJob(
      context.jobUrl,
      context.coverLetter,
      context.userEmail
    );
  },
});

const applyToJob = async (
  jobUrl: string,
  coverLetter: string,
  userEmail: string
): Promise<{ status: string; message: string }> => {
  // Simulate submitting the job application by logging the data
  console.log(`Submitting application for job: ${jobUrl}`);
  console.log(`Cover Letter: ${coverLetter}`);
  console.log(`User Email: ${userEmail}`);

  // Simulate success message
  return { status: 'Success', message: `Successfully prepared your application for the job. Visit ${jobUrl} to apply.` };
};
