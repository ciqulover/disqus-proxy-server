const config = {
  // 服务端端口，需要与disqus-proxy前端设置一致
  port: 5509,

  // 你的diqus secret key
  api_secret: 'your secret key',

  // 你的website的 shortname 名称 比如在你的disqus安装代码中 有这样一句脚本：
  // s.src = 'https://abcd.disqus.com/embed.js';
  // 那么你的disqus 的shortname 就是 abcd
  shortname: 'your short name',

  // 服务端socks5代理转发，便于在本地测试，生产环境通常为null
  // socks5Proxy: {
  //   host: 'localhost',
  //   port: 1086
  // },

  socks5Proxy: null,

  // 日志输出位置,输出到文件或控制台 'file' | 'console'
  log: 'console'
}

// Docker启动时覆盖参数
if (process.env.PORT) config.port = process.env.PORT
if (process.env.API_SECRECT) config.api_secret = process.env.API_SECRECT
if (process.env.SHORT_NAME) config.shortname = process.env.SHORT_NAME
if (process.env.LOG) config.log = process.env.LOG

module.exports = config




