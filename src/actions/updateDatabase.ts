/* eslint-disable no-console */
import chalk from 'chalk';
import { exec } from 'child_process';

import { getFilesRecursively } from '../file';
import { getJobInfo } from '../input';

export async function update(currentDirectory: string) {
  const files = getFilesRecursively(currentDirectory);
  const { context, project } = await getJobInfo(files);

  const command = `dotnet ef database update --project ${project} --context ${context}Context`;

  exec(command, () => {
    console.log(chalk.green('\nBanco de dados criado com sucesso 👏\n\n'));
  });
}
