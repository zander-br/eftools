import { join } from 'path';
import { statSync, readdirSync } from 'fs';

const isDirectory = (path: string) => statSync(path).isDirectory();

const getDirectories = (path: string) =>
  readdirSync(path)
    .map(name => join(path, name))
    .filter(isDirectory);

const isFile = (path: string) => statSync(path).isFile();

const getFiles = (path: string) =>
  readdirSync(path)
    .map(name => join(path, name))
    .filter(isFile);

export function getFilesRecursively(path: string): string[] {
  const dirs = getDirectories(path);
  const files = dirs
    .map(dir => getFilesRecursively(dir))
    .reduce((a, b) => a.concat(b), []);
  return files.concat(getFiles(path));
}
