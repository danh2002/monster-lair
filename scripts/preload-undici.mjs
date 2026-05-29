import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Module = require('node:module');
const originalLoad = Module._load;
const undiciPath = require.resolve('undici');
const nextEnvPath = require.resolve('@next/env');
const undici = require(undiciPath);
const nextEnv = require(nextEnvPath);

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'undici' || /node_modules[\\/]undici[\\/]index\.js$/.test(String(request))) {
    return undici;
  }

  if (request === '@next/env' || request === nextEnvPath) {
    const loadedNextEnv = originalLoad.apply(this, arguments);
    return loadedNextEnv?.default ? loadedNextEnv : { ...loadedNextEnv, default: loadedNextEnv };
  }

  return originalLoad.apply(this, arguments);
};
