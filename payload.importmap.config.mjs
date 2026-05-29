import rawConfig from './payload.config.ts';

const config = await (rawConfig?.default ?? rawConfig);

export default config;
