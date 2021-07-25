const withImages = require('next-images')

module.exports = withImages({
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'en'
  },
  images: {
    domains: ['media.graphcms.com', 'cdn.chec.io']
  }
})
