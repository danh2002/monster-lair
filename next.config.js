const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

module.exports = withNextIntl({
  // your existing Next.js config options here
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
});
