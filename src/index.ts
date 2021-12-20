#!/usr/bin/env node
/* eslint-disable no-console */
import * as chalk from 'chalk';
import { textSync } from 'figlet';
import { createPromptModule } from 'inquirer';

import { generate as generateScript } from './actions/generateScript';
import { generate as generateMigration } from './actions/generateMigration';
import { update as updateDatabase } from './actions/updateDatabase';
import { remove as removeMigration } from './actions/removeMigration';

console.clear();

console.log(chalk.blue(textSync('Ef-Tools', { horizontalLayout: 'full' })));

const run = async () => {
  try {
    const currentDirectory = process.cwd();
    const questions = [
      {
        name: 'action',
        type: 'list',
        message: 'What do you want to do?',
        choices: [
          'Generate migration script',
          'Generate a new migration',
          'Update database',
          'Remove last migration',
        ],
      },
    ];

    const prompt = createPromptModule();
    const { action } = await prompt(questions);

    switch (action) {
      case 'Generate migration script':
        generateScript(currentDirectory);
        break;

      case 'Generate a new migration':
        generateMigration(currentDirectory);
        break;

      case 'Update database':
        updateDatabase(currentDirectory);
        break;

      case 'Remove last migration':
        removeMigration(currentDirectory);
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

run();
