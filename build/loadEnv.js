"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const loadEnv = (envPath, environment = 'production', silent = true) => {
  // check envPath
  if (!envPath) throw new Error('envPath is required');
  if (!_fs.default.existsSync(envPath)) throw new Error('envPath does not exists');

  const stats = _fs.default.lstatSync(envPath);

  if (!stats.isDirectory()) throw new Error('envPath is not a directory'); // Check environment is set

  if (!environment) throw new Error('environment is required'); // All flatten dotenv config

  const dotenvConfig = {};
  ['.env', `.env.${environment}`, `.env.${environment}.local`].map(filename => _path.default.resolve(envPath, filename)).filter(filepath => _fs.default.existsSync(filepath)).forEach(filepath => {
    const envConfig = (0, _dotenv.parse)(_fs.default.readFileSync(filepath));

    for (const k in envConfig) {
      dotenvConfig[k] = envConfig[k];
    }
  }); // Override only .env var that are not set yet

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

var _default = loadEnv;
exports.default = _default;