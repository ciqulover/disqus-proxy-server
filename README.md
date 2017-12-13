## 配合[disqus-proxy-core](https://github.com/ciqulover/disqus-proxy-core) 使用的后端。

[![npm package](https://img.shields.io/npm/v/disqus-proxy-server.svg?style=flat)](https://www.npmjs.org/package/disqus-proxy-server)
![](https://img.shields.io/badge/node-%3E7.6-brightgreen.svg)

[![NPM](https://nodei.co/npm/disqus-proxy-server.png)](https://nodei.co/npm/disqus-proxy-server/)

## 配置之前

首先，需要获取disqus提供的`api-secret`。

在 Disqus 申请开启 api 权限。访问[register new application](https://disqus.com/api/applications/register/) 就可以注册一个 application.然后在[applications](https://disqus.com/api/applications/)可以看到你的 application 列表。其中 Secret Key 就是我们需要的api-secret,并且需要在后台的Settings => Community里开启访客评论


## 配置

**配置提供`node`启动和`docker`或者`docker-compose`的方式启动，推荐`docker`或者`docker-compose`**

### 使用 docker

以下命令中替换你的`API_SECRECT`和`SHORT_NAME`，外部端口可自定义，需要和前端保持一致

```shell
docker run -d --name disqus-proxy -p 5509:5509 \
-e API_SECRECT=your_serect \
-e SHORT_NAME=your_short_name \
ycwalker/disqus-proxy-server 

```

### 使用docker-compose

复制本项目的[docker-compose.yml](https://github.com/ciqulover/disqus-proxy-server/blob/master/docker-compose.yml)文件至服务器上
或者克隆本项目`git clone https://github.com/ciqulover/disqus-proxy-server`

替换docker-compose.yml中你的`API_SECRECT`和`SHORT_NAME`

##### 在包含docker-compose.yml的目录中启动
```
docker-compose up -d
```

### 使用`nodejs`

需要`Node.js`版本`7.6`以上。

##### 在服务器上clone代码:
```
https://github.com/ciqulover/disqus-proxy-server
```
##### 安装依赖 
```
npm install
```

##### 配置`server`目录下的`config.js`
``` js
module.exports = {
  // 服务端端口，需要与disqus-proxy前端设置一致
    port: 5509,
  
    // 你的diqus secret key
    api_secret: 'your secret key',
  
    // 你的website的 shortname 名称 比如在你的disqus安装代码中 有这样一句脚本：
    // s.src = 'https://test-eo9kkdlcze.disqus.com/embed.js';
    // 那么你的disqus 的shortname 就是 test-eo9kkdlcze
    shortname: 'ciqu',
  
    // 服务端socks5代理转发，便于在本地测试，生产环境通常为null
    // socks5Proxy: {
    //   host: 'localhost',
    //   port: 1086
    // },
  
    socks5Proxy: null,
  
    // 日志输出位置,输出到文件或控制台 'file' | 'console'
    log: 'console'
}

```

##### 启动
```
node index.js
```

推荐用`pm2`在生产环境启动，否则你断开ssh，node进程就终止了

```
npm install pm2 -g
pm2 start index.js
```
如果你在配置文件中选择`log`类型为`file`, 那么输出的日志文件将在默认为server目录下的`disqus-proxy.log`

### 其他

如果需要https访问，我们可以用nginx来反向代理disqus proxy.

```nginx
server {
    listen 443 ssl;
    server_name disqus.domain.com;
    ssl_certificate /etc/ssl/startssl/1_disqus.domain.com_bundle.crt;
    ssl_certificate_key /etc/ssl/startssl/2_disqus.domain.com.key;
    
    location / {
        proxy_set_header  X-Real-IP  $remote_addr;
        proxy_pass http://host:port$request_uri;
    }
}
```
