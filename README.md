## 配合[disqus-proxy-core](https://github.com/ciqulover/disqus-proxy-core) 使用的后端。

[![npm package](https://img.shields.io/npm/v/disqus-proxy-server.svg?style=flat)](https://www.npmjs.org/package/disqus-proxy-server)
![](https://img.shields.io/badge/node-%3E7.6-brightgreen.svg)

[![NPM](https://nodei.co/npm/disqus-proxy-server.png)](https://nodei.co/npm/disqus-proxy-server/)

## 配置之前

首先，需要获取disqus提供的`api-secret`。

在 Disqus 申请开启 api 权限。访问[register new application](https://disqus.com/api/applications/register/) 就可以注册一个 application.然后在[applications](https://disqus.com/api/applications/)可以看到你的 application 列表。其中 Secret Key 就是我们需要的api-secret,并且需要在后台的Settings => Community里开启访客评论


## 配置

**配置提供`node`启动和`docker`或者`docker-compose`的方式启动，推荐`docker`或者`docker-compose`**

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

##### 配置`server`目录下的`config.json`
``` js
{
  // 服务端端口，需要与disqus-proxy前端设置一致
    "port": 5509,
  
    // 你的diqus secret key
    "api_secret": "your secret key",
  
    // 你的website的 shortname 名称 比如在你的disqus安装代码中 有这样一句脚本：
    // s.src = 'https://test-eo9kkdlcze.disqus.com/embed.js';
    // 那么你的disqus 的shortname 就是 test-eo9kkdlcze
    "shortname": "shortname",
  
    // 日志路径，可以填写绝对路径，默认当前目录下自动创建log目录
    log_path: null
    
    只有使用nginx反向代理node时，为true，只监听否则本地端口127.0.0.1，默认false，监听0.0.0.0
    proxy: false
}

```

##### 启动

测试启动：
```
node server.js
```

正式使用时需要用`pm2`启动，来守护服务端进程

```
npm install pm2 -g
pm2 start server.js
```

-- 到此结束，检测评论是否正常显示 --

### 其他

如果需要https访问，我们可以用nginx来反向代理disqus proxy.

其中disqus-proxy.domain.com是你的反向代理的域名，配置好证书位置。其中5509端口是在config.json里配置的端口

```nginx
server {
    listen 443 ssl;
    server_name disqus-proxy.domain.com;
    ssl_certificate /etc/ssl/disqus-proxy.domain.com.crt;
    ssl_certificate_key /etc/ssl/disqus-proxy.domain.com.key;
    
    location / {
        proxy_set_header  X-Real-IP  $remote_addr;
        proxy_pass http://127.0.0.1:5509$request_uri;
    }
}
```
