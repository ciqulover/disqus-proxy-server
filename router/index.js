const router = require('koa-router')()
const fetch = require('node-fetch')
const wrappedFetch = require('socks5-node-fetch')
const {URLSearchParams} = require('url')

const logger = require('../lib/logger')
const {api_key, api_secret, shortname, socks5Proxy} = require('../config')

let request = fetch

if (socks5Proxy && socks5Proxy.host && socks5Proxy.port) {
  request = wrappedFetch({
    socksHost: socks5Proxy.host,
    socksPort: socks5Proxy.port
  })
}

router.get('/api/getThreads', async function (ctx) {
  const identifier = ctx.request.query.identifier
  logger.info('Get thread with identifier: ' + identifier)

  const url = 'https://disqus.com/api/3.0/threads/list.json?' +
    'api_secret=' + api_secret +
    '&forum=' + shortname +
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
  const cursor = ctx.request.query.cursor
  logger.info('Get Comments with identifier: ' + identifier)

  let result
  const url = 'https://disqus.com/api/3.0/threads/listPosts.json?' +
    'api_secret=' + api_secret +
    '&forum=' + shortname +
    '&limit=' + 25 +
    `${cursor ? '&cursor=' + cursor : ''}` +
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
  const {message, thread, author_name, author_email, parent} = body
  const params = new URLSearchParams()
  params.append('api_key', api_key)
  if (parent !== undefined) {
    params.append('parent', parent)
  }
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

module.exports = router


function unexpectedError(error) {
  return {
    code: 'RPC CALL ERROR',
    response: error.message
  }
}
