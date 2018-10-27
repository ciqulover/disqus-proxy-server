const isDev = process.env.NODE_ENV === 'DEV'

const config = isDev ? require('./dev.config.json') : require('./config.json')

if (isDev) {
  config.socks5Proxy = {
    host: 'localhost',
    port: 1086
  }
}

// 这个API_key是disqus专门用来匿名评论的公有API_key
config.api_key = 'E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F'

// 如果用Docker启动，覆盖参数
if (process.env.PORT) config.port = process.env.PORT
if (process.env.API_SECRECT) config.api_secret = process.env.API_SECRECT
if (process.env.SHORT_NAME) config.shortname = process.env.SHORT_NAME

module.exports = config
