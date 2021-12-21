/* eslint-disable no-console */
import chalk from 'chalk';
import Configstore from 'configstore';
import { createPromptModule } from 'inquirer';
import sql from 'mssql';
import { exec } from 'child_process';

import { DatabaseConnection, getDatabaseInfo } from '../input/database';
import { getJobInfo } from '../input';
import { getFilesRecursively } from '../file';

type InformationSchema = {
  TABLE_SCHEMA: string;
  TABLE_NAME: string;
};

type InquirerTables = {
  selectedTables: string[];
};

export async function generate(currentDirectory: string) {
  const files = getFilesRecursively(currentDirectory);
  const { context, location, project } = await getJobInfo(files);

  let databaseConnection: DatabaseConnection;
  const config = new Configstore('eftools');
  const savedConnections = config.get('connections') as DatabaseConnection[];
  const prompt = createPromptModule();

  if (savedConnections && savedConnections.length) {
    const connectionsName = savedConnections.map(
      ({ host, port, database }) => `${host},${port} | ${database}`,
    );
    const { database } = await prompt([
      {
        name: 'database',
        type: 'list',
        message: 'Which database?',
        choices: [...connectionsName, 'Add new database'],
      },
    ]);

    if (database === 'Add new database') {
      databaseConnection = await getDatabaseInfo();
      const connections = [...savedConnections, databaseConnection];
      config.set('connections', connections);
    } else {
      const [_, databaseName] = database.split('|');
      databaseConnection = savedConnections.find(
        connection => connection.database === databaseName.trim(),
      ) as DatabaseConnection;
    }
  } else {
    databaseConnection = await getDatabaseInfo();
    const connections = [databaseConnection];
    config.set('connections', connections);
  }

  const { host, database, port, user, password } = databaseConnection;

  const sqlConfig = {
    user,
    password,
    database,
    server: host,
    options: {
      trustServerCertificate: true,
    },
  };

  const pool = new sql.ConnectionPool(sqlConfig);
  const connectionPool = await pool.connect();
  const { recordset } = await connectionPool.query<InformationSchema>(
    'SELECT * FROM INFORMATION_SCHEMA.TABLES;',
  );

  pool.close();

  const tables = recordset
    .filter(({ TABLE_NAME }) => !TABLE_NAME.match(/^__/))
    .map(table => `${table.TABLE_SCHEMA}.${table.TABLE_NAME}`);

  const { selectedTables } = await prompt<InquirerTables>([
    {
      name: 'selectedTables',
      type: 'checkbox',
      message: 'Which tables?',
      choices: tables,
    },
  ]);

  const tablesCommand = selectedTables.map(table => `-t ${table}`).join(' ');

  const command = `dotnet ef dbcontext scaffold "Data Source=${host},${port};Initial Catalog=${database};User Id=${user};Password=${password}" Microsoft.EntityFrameworkCore.SqlServer ${tablesCommand} -o Scaffold -p ${location} -c ${context}Context`;
  const filesPath = location && location.replace(project, 'Scaffold');

  exec(command, () => {
    console.log(chalk.green('\nScaffold gerado com sucesso 👏\n\n'));
    console.log(chalk.yellow(`${filesPath}\n\n`));
  });
}
