- [🔥 掘金小册 markdown 转换器](#%F0%9F%94%A5-%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C-markdown-%E8%BD%AC%E6%8D%A2%E5%99%A8)
  - [安装方式](#%E5%AE%89%E8%A3%85%E6%96%B9%E5%BC%8F)
  - [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
  - [更新日志](#%E6%9B%B4%E6%96%B0%E6%97%A5%E5%BF%97)
  - [常见问题](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
  - [免责](#%E5%85%8D%E8%B4%A3)
  - [隐私](#%E9%9A%90%E7%A7%81)
  - [License](#license)

# 🔥 掘金小册 markdown 转换器

![20190121001820.png](https://i.loli.net/2019/01/21/5c449f4dbc3d5.png)

采用 node https 模块，获取已购买小册 html 代码，并将 html 代码转换为 markdown 格式文件保存本地。

**注意：目前本项目有两个版本，v2 不需要使用 chromium 作为无头浏览器；v1 则使用 chromi 作为无头浏览器模拟用户登录网站；**

根据需要选择不同版本，v1 不再维护：

- [release v2](https://github.com/oliyg/juejinxiaoce/releases/tag/v2.0.0)
- [release v1](https://github.com/oliyg/juejinxiaoce/releases/tag/1.1.2)

## 安装方式

首先 clone 此项目：

`git clone https://github.com/oliyg/juejinxiaoce.git`

然后安装依赖：

`npm i`

> 推荐使用 nrm 管理镜像源，使用淘宝镜像：`nrm use taobao`

## 使用方法

新建 .env 文件到根目录，并根据 .env.example 填写掘金登录用户名和密码以及要爬取的小册ID：

![20190120235150.png](https://i.loli.net/2019/01/20/5c4499178bb83.png)

> 小册ID见 URL 链接：
> 
> ![20190120235353.png](https://i.loli.net/2019/01/20/5c4499929e48e.png)

.env 文件修改完毕后执行 npm start 等待出现消息 `all done. enjoy.` 完成转换，效果如下：

![20190121000703.png](https://i.loli.net/2019/01/21/5c449ca8d869e.png)

![20190121000715.png](https://i.loli.net/2019/01/21/5c449cb443d62.png)

## 更新日志

- v2.0.0 使用 node 原生 https 模块，发送请求数据获取内容，不需要安装 chromium，没有软件权限问题
- v1.1.2 使用谷歌 puppeteer 作为无头浏览器获取内容，需要安装 chromium，macOS 中可能有权限问题

## 常见问题

- v1.1.2
  - 报错：spawn EACCES
    - 常见于 macOS，请保证 chromium 已被正常安装

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
