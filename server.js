const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('kcors')
const router = require('./router')
const config = require('./config')
const logger = require('./lib/logger')

const app = new Koa()

app.use(cors())
  .use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      ctx.body = {
        code: 'SERVER_ERROR',
        response: e.message
      }
    }
  })
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

if (config.proxy) {
  app.proxy = true
  app.listen(config.port, '127.0.0.1', log)
} else app.listen(config.port, log)

function log() {
  console.log('Disqus proxy server start at port: ' + config.port)
  if (config.log === 'file') logger.info('Disqus proxy start at port: ' + config.port)
}
