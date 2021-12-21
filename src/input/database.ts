import { createPromptModule } from 'inquirer';

export type DatabaseConnection = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export async function getDatabaseInfo(): Promise<DatabaseConnection> {
  const questions = [
    {
      name: 'host',
      type: 'input',
      message: 'Host:',
      validate(value: string) {
        if (value.length) {
          return true;
        }
        return 'Please enter the database host.';
      },
    },
    {
      name: 'port',
      type: 'input',
      message: 'Port:',
      validate(value: string) {
        if (value.length && value.match(/\d+/)) {
          return true;
        }
        return 'Please enter the database port.';
      },
    },
    {
      name: 'user',
      type: 'input',
      message: 'User:',
      validate(value: string) {
        if (value.length) {
          return true;
        }
        return 'Please enter the database user.';
      },
    },
    {
      name: 'password',
      type: 'password',
      message: 'Password:',
      validate(value: string) {
        if (value.length) {
          return true;
        }
        return 'Please enter the database password.';
      },
    },
    {
      name: 'database',
      type: 'input',
      message: 'Database name:',
      validate(value: string) {
        if (value.length) {
          return true;
        }
        return 'Please enter the database name.';
      },
    },
  ];

  const prompt = createPromptModule();
  const { host, port, user, password, database } = await prompt(questions);
  return {
    host,
    port: parseInt(port, 10),
    user,
    password,
    database,
  };
}
