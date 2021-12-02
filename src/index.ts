#!/usr/bin/env node
/* eslint-disable no-console */
import * as chalk from 'chalk';
import { textSync } from 'figlet';
import { createPromptModule } from 'inquirer';

import { generate as generateScript } from './actions/generateScript';
import { generate as generateMigration } from './actions/generateMigration';

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
        choices: ['Generate migration script', 'Generate a new migration'],
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

      default:
        break;
    }
  } catch (err) {
    console.error(err);
  }
};

run();
