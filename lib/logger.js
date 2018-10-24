const log4js = require('log4js')
const path = require('path')
const {log_path} = require('../config')

const log_config = {
  appenders: {
    'disqus-prxoy': {
      type: 'dateFile',
      filename: log_path ? path.resolve(log_path, 'disqus-proxy') : path.resolve(__dirname, '../log/disqus-proxy'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
  },
  categories: {
    default: {appenders: ['disqus-prxoy'], level: 'all'},
  },
}

log4js.configure(log_config)

const logger = log4js.getLogger('disqus-prxoy')

module.exports = logger
