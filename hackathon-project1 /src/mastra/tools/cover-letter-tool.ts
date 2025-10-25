import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const coverLetterTool = createTool({
  id: 'generate-cover-letter',
  description: 'Generate a personalized cover letter for a job application.',
  inputSchema: z.object({
    role: z.string().describe('The job role you are applying for'),
    skills: z.array(z.string()).describe('List of your skills'),
    experience: z.string().describe('Your experience level (e.g., "Junior", "Senior")'),
    company: z.string().describe('Company name you are applying to'),
  }),
  outputSchema: z.object({
    coverLetter: z.string(),
  }),
  execute: async ({ context }) => {
    return await generateCoverLetter(
      context.role,
      context.skills,
      context.experience,
      context.company
    );
  },
});

const generateCoverLetter = async (
  role: string,
  skills: string[],
  experience: string,
  company: string
): Promise<{ coverLetter: string }> => {
  const skillsStr = skills.join(', ');

  // Basic template for the cover letter
  const coverLetter = `
    Dear Hiring Manager at ${company},

    I am excited to apply for the ${role} position at your company. I believe my skills in ${skillsStr} make me a great fit for this role. 

    I have ${experience} experience in this field, and I am eager to bring my expertise to your team. I am confident that I can contribute effectively to your organization's goals.

    Thank you for considering my application. I look forward to discussing how I can add value to your team.

    Sincerely,
    [Your Name]
  `;

  return { coverLetter };
};
