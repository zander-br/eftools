/* eslint-disable no-console */
import * as chalk from 'chalk';
import { basename } from 'path';
import { createPromptModule } from 'inquirer';
import { format } from 'date-fns';
import { exec } from 'child_process';

import { getFilesRecursively } from '../file';
import { getJobInfo } from '../input';

const filterMigrations = (file: string) => file.match(/Migrations/g);

const filterNotDesignFile = (file: string) => !file.match(/Designer.cs/g);

const removeSnapshot = (file: string) => !file.match(/Snapshot.cs/g);

const formatMigrationName = (migration: string) =>
  basename(migration)
    .replace(/(\d+_)/g, '')
    .replace('.cs', '');

export async function generate(currentDirectory: string) {
  const files = getFilesRecursively(currentDirectory);
  const { context, location } = await getJobInfo(files);
  const migrations = files.filter(filterMigrations).filter(filterNotDesignFile);

  const regexpMigration = new RegExp(`/${context}/Migrations`);
  const filterMigrationsContext = (migration: string) =>
    migration.match(regexpMigration);

  const migrationsForContext = migrations
    .filter(filterMigrationsContext)
    .filter(removeSnapshot)
    .map(formatMigrationName)
    .reverse() as string[];

  const prompt = createPromptModule();
  const { migration } = await prompt([
    {
      name: 'migration',
      type: 'list',
      message: 'What migration?',
      choices: migrationsForContext,
    },
  ]);

  const migrationIndex = migrationsForContext.findIndex(
    name => name === migration,
  );
  const previousMigration = migrationsForContext[migrationIndex + 1];

  const filename = `${format(new Date(), 'yyyyMMddHHmmss')}-${migration}.sql`;
  const command = `dotnet ef migrations script ${previousMigration} --project ${location} --context ${context}Context -o ./${filename}`;
  exec(command, () => {
    console.log(chalk.green('\nScript criado com sucesso 👏\n\n'));
    console.log(chalk.yellow(`${currentDirectory}/${filename}\n\n`));
  });
}
