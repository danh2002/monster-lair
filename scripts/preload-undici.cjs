const Module = require('module');
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
    const nextEnv = originalLoad.apply(this, arguments);
    return nextEnv?.default ? nextEnv : { ...nextEnv, default: nextEnv };
  }

  return originalLoad.apply(this, arguments);
};
