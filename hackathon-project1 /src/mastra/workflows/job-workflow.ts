
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { jobSearchTool } from '../tools/job-search-tool';

// Wrap the tool into a step
const jobSearchStep = createStep({
  id: 'job-search-step',
  description: 'Search for jobs based on user preferences.',
  inputSchema: z.object({
    location: z.string().describe('Preferred job location'),
    role: z.string().describe('Desired job title or role'),
    skills: z.array(z.string()).describe('Skills required for the role'),
    experience: z.string().describe('Experience level'),
    coverLetter: z.string().describe('The cover letter to submit with the application'),
    userEmail: z.string().describe('User email address for the application'),
  }),
  outputSchema: jobSearchTool.outputSchema,
  execute: async ({ inputData }) => {
    // Provide only the fields the underlying tool expects, while keeping coverLetter/userEmail in the step input
    const toolInput = {
      location: inputData.location,
      role: inputData.role,
      skills: inputData.skills,
      experience: inputData.experience,
    };
    const result = await jobSearchTool.execute(toolInput);
    return result;
  },
});

// Step for applying to a job
const applyForJob = createStep({
  id: 'apply-for-job',
  description: 'Apply to a job using the job URL and cover letter.',
  inputSchema: z.object({
    jobUrl: z.string().describe('The URL of the job listing'),
    coverLetter: z.string().describe('The cover letter to submit with the application'),
    userEmail: z.string().describe('User email address for the application'),
  }),
  outputSchema: z.object({
    status: z.string(),
    message: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log('Applying to job at:', inputData.jobUrl);
    console.log('Cover Letter:', inputData.coverLetter);
    console.log('User Email:', inputData.userEmail);

    return {
      status: 'Success',
      message: `Successfully prepared your application for the job. Visit ${inputData.jobUrl} to apply.`,
    };
  },
});

// Create the workflow
const jobApplicationWorkflow = createWorkflow({
  id: 'job-application-workflow',
  inputSchema: z.object({
    location: z.string().describe('Preferred job location'),
    role: z.string().describe('Desired job title or role'),
    skills: z.array(z.string()).describe('Skills required for the role'),
    experience: z.string().describe('Experience level'),
    coverLetter: z.string().describe('Cover letter for job application'),
    userEmail: z.string().describe('User email'),
  }),
  outputSchema: z.object({
    status: z.string(),
    message: z.string(),
  }),
})
  .then(jobSearchStep)   // ✅ now it’s a Step, not a Tool
  .then(applyForJob);

jobApplicationWorkflow.commit();

export { jobApplicationWorkflow };
