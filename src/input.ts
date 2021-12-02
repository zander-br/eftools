import { basename } from 'path';
import { createPromptModule } from 'inquirer';

const filterContexts = (file: string) => file.match(/Context.cs/g);

const filterProjects = (file: string) => file.match(/.csproj$/g);

const formatContextName = (context: string) =>
  basename(context).replace('Context.cs', '');

const formatProjectName = (project: string) => ({
  name: basename(project),
  location: project,
});

export type JobInfo = {
  context: string;
  location?: string;
  project: string;
};

export async function getJobInfo(files: string[]): Promise<JobInfo> {
  const contexts = files.filter(filterContexts).map(formatContextName);
  const projects = files.filter(filterProjects).map(formatProjectName);

  const questions = [
    {
      name: 'context',
      type: 'list',
      message: 'What EF context?',
      choices: contexts,
    },
    {
      name: 'project',
      type: 'list',
      message: 'What project?',
      choices: projects.map(project => project.name),
    },
  ];

  const prompt = createPromptModule();
  const { context, project } = await prompt(questions);
  const selectedProject = projects.find(p => p.name === project);

  return { context, location: selectedProject?.location, project };
}
