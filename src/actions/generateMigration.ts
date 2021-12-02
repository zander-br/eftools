/* eslint-disable no-console */
import * as chalk from 'chalk';
import { createPromptModule } from 'inquirer';
import { exec } from 'child_process';

import { getFilesRecursively } from '../file';
import { getJobInfo } from '../input';

export async function generate(currentDirectory: string) {
  const files = getFilesRecursively(currentDirectory);
  const { context, location, project } = await getJobInfo(files);

  const prompt = createPromptModule();
  const { migration } = await prompt([
    {
      name: 'migration',
      type: 'input',
      message: 'Enter your migration name:',
      validate(value) {
        if (value.length) {
          return true;
        }
        return 'Please enter your migration name.';
      },
    },
  ]);

  const filePath =
    location && location.replace(project, `Data/${context}/Migrations/`);
  const command = `dotnet ef migrations add ${migration} -o Data/${context}/Migrations --project ${location} --context ${context}Context`;

  exec(command, () => {
    console.log(chalk.green('\nMigration criada com sucesso 👏\n\n'));
    console.log(chalk.bold.yellow('Migration criada em:\n'));
    console.log(chalk.yellow(`${filePath}\n\n`));
  });
}
