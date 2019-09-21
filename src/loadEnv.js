import fs from 'fs';
import path from 'path';
import { parse as parseDotEnv } from 'dotenv';

const loadEnv = (envPath, environment = 'production', silent = true) => {
  // check envPath
  if (!envPath) throw new Error('envPath is required');
  if (!fs.existsSync(envPath)) throw new Error('envPath does not exists');
  const stats = fs.lstatSync(envPath);
  if (!stats.isDirectory()) throw new Error('envPath is not a directory');

  // Check environment is set
  if (!environment) throw new Error('environment is required');

  // All flatten dotenv config
  const dotenvConfig = {};
  ['.env', `.env.${environment}`, `.env.${environment}.local`]
    .map(filename => path.resolve(envPath, filename))
    .filter(filepath => fs.existsSync(filepath))
    .forEach(filepath => {
      const envConfig = parseDotEnv(fs.readFileSync(filepath));
      for (const k in envConfig) {
        dotenvConfig[k] = envConfig[k];
      }
    });

  // Override only .env var that are not set yet
  const importedKeys = [];
  Object.keys(dotenvConfig).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      importedKeys.push(key);
      process.env[key] = dotenvConfig[key];
    }
  });

  if (!silent) {
    console.debug('Environment variables overrided from dotfile', importedKeys);
  }

  return importedKeys;
};

export default loadEnv;
