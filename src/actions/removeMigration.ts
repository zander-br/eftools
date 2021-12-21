/* eslint-disable no-console */
import chalk from 'chalk';
import { exec } from 'child_process';

import { getFilesRecursively } from '../file';
import { getJobInfo } from '../input';

export async function remove(currentDirectory: string) {
  const files = getFilesRecursively(currentDirectory);
  const { context, project } = await getJobInfo(files);

  const command = `dotnet ef migrations remove --project ${project} --context ${context}Context`;

  exec(command, () => {
    console.log(chalk.green('\nÚltima migration removida com sucesso 👏\n\n'));
  });
}
