# env-loader

Simple util to override environment variables from .env files.

## Examples

```js
import loadEnv from '@kindpanda/env-loader';

loadEnv('./my-envs-path', 'test');
```

Will override `process.env` variables in a row with dotenv files:

- ./my-envs-path/.env
- ./my-envs-path/env.test
- ./my-envs-path/env.test.local

It provide a helper class Environment to get env value with optional prefix.

```js
import { Environment } from '@kindpanda/env-loader';

const env = new Environment({ prefix: 'MY_NAMESPACE_' });

const myVar = env.get('MY_VAR', 'default value');
```
