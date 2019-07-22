[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Foliyg%2Fjuejinxiaoce.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Foliyg%2Fjuejinxiaoce?ref=badge_shield)

# 🔥 掘金小册 markdown 转换器

![20190121001820.png](https://i.loli.net/2019/01/21/5c449f4dbc3d5.png)

[github 仓库欢迎 star](https://github.com/oliyg/juejinxiaoce)

采用 node https 模块，获取已购买小册 html 代码，并将 html 代码转换为 markdown 格式文件保存本地。

**注意：目前本项目有两个版本，v2 不需要使用 chromium 作为无头浏览器；v1 则使用 chromi 作为无头浏览器模拟用户登录网站；**

根据需要选择不同版本

- v2：
  - [latest](https://github.com/oliyg/juejinxiaoce/releases)
- v1 不再维护：
  - [release v1](https://github.com/oliyg/juejinxiaoce/releases/tag/1.1.2)

## 使用方法

**⚠️ 注意：掘金不支持境外网络访问，因此不要使用代理**

### 方法一：npx 直接执行

在本地某目录中执行 `npx @oliyg/juejinxiaoce` 按照提示输入用户名密码以及小册 ID 当提示 all done 完成

```
➜  Desktop npx @oliyg/juejinxiaoce
npx: 98 安装成功，用时 10.748 秒
email: 输入你的用户名密码
password: 输入你的用户名密码
bookId: 小册 ID
===navagating to main page
===login...
===getting book section list
===getting book HTML content
面试常用技巧
===writing html...
===getting book HTML content
===write html file success
===writing markdown...
===write markdown file success
前方的路，让我们结伴同行
===writing html...
===write html file success
===writing markdown...
===write markdown file success

======
All Done...Enjoy.
======
```

在执行命令的这个目录中可以找到一个名为 md xxx 的文件夹，内包含 md 文档；在上面这个例子中，我们在 Desktop 桌面目录执行命令，因此在桌面目录中会生成这个文件夹：

```shell
➜  md 1548483715543 ls -al
total 40
drwxr-xr-x  4 oli  staff   128  1 26 14:22 .
drwx------+ 9 oli  staff   288  1 26 14:21 ..
-rw-r--r--  1 oli  staff  4915  1 26 14:21 面试常用技巧.md
-rw-r--r--  1 oli  staff  8465  1 26 14:22 前方的路，让我们结伴同行.md
```

### 方法二：npm i 命令

使用 `npm i -g` 安装，并使用 `juejinxiaoce` 命令执行：

```
➜  Desktop npm i -g @oliyg/juejinxiaoce
/Users/oli/.nvm/versions/node/v8.12.0/bin/juejinxiaoce -> /Users/oli/.nvm/versions/node/v8.12.0/lib/node_modules/@oliyg/juejinxiaoce/bin/juejinxiaoce
+ @oliyg/juejinxiaoce@2.2.1
added 98 packages from 201 contributors in 5.89s
➜  Desktop juejinxiaoce
email:
password:
bookId:
===navagating to main page
===login...
...
...
```

> 小册ID见 URL 链接：
> 
> ![20190120235353.png](https://i.loli.net/2019/01/20/5c4499929e48e.png)

执行后等待出现消息 `all done. enjoy.` 完成转换，效果如下：

![20190121000703.png](https://i.loli.net/2019/01/21/5c449ca8d869e.png)

![20190121000715.png](https://i.loli.net/2019/01/21/5c449cb443d62.png)

## 更新日志

- v2.2.4 修改文件名
- v2.2.0 增加命令行模式
- v2.0.0 使用 node 原生 https 模块，发送请求数据获取内容，不需要安装 chromium，没有软件权限问题
- v1.1.2 使用谷歌 puppeteer 作为无头浏览器获取内容，需要安装 chromium，macOS 中可能有权限问题

## 常见问题

- v1.1.2
  - 报错：spawn EACCES
    - 常见于 macOS，请保证 chromium 已被正常安装

## 开源贡献

- 感谢 `@yangchendoit` 提交的 pr 完善手机号码登录功能

## 免责

- 不提供用户名和密码，需使用用户自己的账号密码登录
- 仅作为技术讨论，学习和研究使用

## 隐私

- 该项目不会存储和发送任何用户隐私数据

## License

The MIT License (MIT)
Copyright (c) 2019 OliverYoung


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Foliyg%2Fjuejinxiaoce.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Foliyg%2Fjuejinxiaoce?ref=badge_large)
