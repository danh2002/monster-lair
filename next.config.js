const createNextIntlPlugin = require('next-intl/plugin');
const { withPayload } = require('@payloadcms/next/withPayload');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

module.exports = withPayload(withNextIntl({
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
}));
