const Koa = require('koa')
const fetch = require('node-fetch')
const wrappedFetch = require('socks5-node-fetch')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const log4js = require('log4js')
const cors = require('kcors')
const URLSearchParams = require('url').URLSearchParams
const ENV = process.env.NODE_ENV
const config = ENV === 'DEV' ? require('./dev.config') : require('./config')

// 这个API_key是disqus专门用来匿名评论的公有API_key
const api_key = 'E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F'

const logger = log4js.getLogger('disqus-proxy')

if (config.log === 'file') log4js.configure({
  appenders: [{
    type: 'file',
    filename: 'disqus-proxy.log'
  }]
})

const socks5 = config.socks5Proxy

let request = fetch

if (socks5 && socks5.host && socks5.port) {
  request = wrappedFetch({
    socksHost: socks5.host,
    socksPort: socks5.port
  })
}

router.get('/api/getThreads', async function (ctx) {
  const identifier = ctx.request.query.identifier
  logger.info('Get thread with identifier: ' + identifier)

  const url = 'https://disqus.com/api/3.0/threads/list.json?' +
    'api_secret=' + config.api_secret +
    '&forum=' + config.shortname +
    '&thread:ident=' + encodeURIComponent(identifier)

  let result

  try {
    result = await request(url)
    result = await result.json()
    logger.info('Get thread successfully with response code: ' + result.code)
  } catch (e) {
    result = unexpectedError(e)
    logger.error('Error when get thread:' + e.message)
  }
  ctx.body = result
})

router.get('/api/getComments', async function (ctx) {
  const identifier = ctx.request.query.identifier
  logger.info('Get Comments with identifier: ' + identifier)

  let result
  const url = 'https://disqus.com/api/3.0/threads/listPosts.json?' +
    'api_secret=' + config.api_secret +
    '&forum=' + config.shortname +
    '&thread:ident=' + encodeURIComponent(ctx.request.query.identifier)

  try {
    result = await request(url)
    result = await result.json()
    logger.info('Get comments successfully with response code: ' + result.code)
  } catch (e) {
    result = unexpectedError(e)
    logger.error('Error when get comment:' + e.message)
  }

  ctx.body = result
})

router.post('/api/createComment', async function (ctx) {
  const body = ctx.request.body
  logger.info('Create comment: ' + JSON.stringify(body))
  const {message, thread, author_name, author_email} = body
  const params = new URLSearchParams()
  params.append('api_key', api_key)
  params.append('message', message)
  params.append('thread', thread)
  params.append('author_name', author_name)
  params.append('author_email', author_email)
  let result
  try {
    result = await request('https://disqus.com/api/3.0/posts/create.json', {
      method: 'POST',
      body: params
    })
    result = await result.json()
    logger.info('Create comment successfully with response code: ' + result.code)
  } catch (e) {
    result = unexpectedError(e)
    logger.error('Error when create comment:' + e.message)
  }
  ctx.body = result
})

const app = new Koa()

app.use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(config.port)

console.log('Disqus proxy server start at port: ' + config.port)

if (config.log === 'file') {
  console.log('See disqus-proxy.log in current directory.')
  logger.info('Server start at port: ' + config.port)
}

function unexpectedError(error) {
  return {
    code: 500,
    response: error.message
  }
}
