/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const os = require('os')
const readline = require('readline')
const Turndown = require('turndown')
const puppeteer = require('puppeteer')
process.env.PWD = __dirname

const { getCookieArr, getCookieObj, sendPost, sendGet, sleep, rmfile, mkdir } = require('./utils')
const { USER_AGENT, URL_HOSTNAME, URL_LOGIN_EMAIL, URL_LOGIN_PHONENUMBER, URL_BOOK_HOSTNAME, URL_BOOK_LIST_SECTION, URL_BOOK_SECTION } = require('./constant')

class Juejin {
  constructor() {
    this.loginType = '0' // 0为邮箱 1为手机
    this.account = ''
    this.password = ''
    this.bookID = ''
    this.cookie = ''
    this.src = 'web'
    this.userInfo = {}
    this.bookSectionList = []
    this.count = 0
    this.pwd = process.env.PWD
    this.browser = null
    this.page = null
  }

  /**
   * 复制 dist 指定子 文件夹下的 指定扩展 文件到指定目录下
   * @param {String} dirname 指定的输出文件夹
   * @param {String} subDir 复制指定文件夹下的文件
   * @param {String} ext 文件扩展
   */
  copyToPWDDir(dirname, subDir = 'pdf', ext = 'pdf') {
    mkdir(dirname)

    const output = path.resolve(__dirname, 'dist', subDir)
    
    const fileList = fs.readdirSync(output).filter(item => path.extname(item) === `.${ext}`)
    fileList.forEach(file => {
      fs.copyFileSync(path.join(output, file), path.resolve(process.env.PWD, dirname, file))   
    })
  }

  /**
   * 获取用户信息和需要导出的小册信息
   */
  async getMetaData() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const question = query => {
      return new Promise(resolve => {
        rl.question(query, resolve)
      })
    }
    console.warn('loginType 0：邮箱 1：手机号码')
    const loginType = await question('loginType: ')
    const account = await question('account: ')
    const password = await question('password: ')
    const bookID = await question('bookId: ')

    rl.close()
    this.loginType = loginType
    this.account = account
    this.password = password
    this.bookID = bookID
    
    Promise.resolve()
  }

  /**
   * 请求掘金的首页，获取需要的Cookie信息
   */
  async mainPage() {
    console.warn('===navagating to main page')
    const headers = {
      'User-Agent': USER_AGENT,
      'Connection': 'keep-alive'
    }
    const response = await sendGet(URL_HOSTNAME, '/', headers)
    this.cookie = JSON.stringify(getCookieObj(response.headers['set-cookie']))
  }

  /**
   * 登录 掘金，获取用户登录后的Cookie和用户基本细腻
   * @returns {Object} response 响应体
   */
  async login() {
    console.warn('===login...')
    const authObj = {
      password: this.password
    }
    let loginUrl

    if(this.loginType === '0'){
      Object.assign(authObj,{
        email: this.account
      })
      loginUrl = URL_LOGIN_EMAIL
    }else{
      Object.assign(authObj,{
        phoneNumber: this.account
      })
      loginUrl = URL_LOGIN_PHONENUMBER
    }
    const auth = JSON.stringify(authObj)
    const headers = {
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(auth),
      'Cookie': getCookieArr(JSON.parse(this.cookie))
    }
    const response = await sendPost(URL_HOSTNAME, loginUrl, auth, headers)
    if (!response.data) {
      throw '用户名或者密码错误'
    }
    this.cookie = JSON.stringify(Object.assign(JSON.parse(this.cookie), getCookieObj(response.res.headers['set-cookie'])))
    this.userInfo = JSON.parse(response.data)
    return response
  }
  /**
   * 获取小册的章节信息
   */
  async getTargetBookSectionList() {
    console.warn('===getting book section list')
    const headers = {
      'User-Agent': USER_AGENT,
      'Connection': 'keep-alive'
    }
    const response = await sendGet(URL_BOOK_HOSTNAME, `${URL_BOOK_LIST_SECTION}?uid=${this.userInfo.userId}&client_id=${this.userInfo.user.clientId}&token=${this.userInfo.user.token}&src=${this.src}&id=${this.bookID}`, headers)
    const data = response.data
    this.bookSectionList = JSON.parse(data).d
    return response
  }

  /**
   * 根据小册章节ID 获取具体的HTML内容
   */
  async getContentHTML(callback) {
    console.warn('===getting book HTML content')
    const headers = {
      'User-Agent': USER_AGENT,
      'Connection': 'keep-alive'
    }
    await sleep(3000)

    const url = `${URL_BOOK_SECTION}?uid=${this.userInfo.userId}&client_id=${this.userInfo.clientId}&token=${this.userInfo.token}&src=${this.src}&sectionId=${this.bookSectionList[this.count].sectionId}`
    const response = await sendGet(URL_BOOK_HOSTNAME, url, headers)
    let data = JSON.parse(response.data)

    console.log(data.d.title)
    data.d.isFinished || console.log('写作中...')
    await callback(data.d)

    this.count ++
    let maxCount = this.bookSectionList.length
    this.count < maxCount && await this.getContentHTML(callback)
  }

  /**
   * 写入文章内容 到 HTML文件中
   * @param {Object} d 文章内容对象
   * { title: '' , html : '' }
   * @requires {title: '文章标题' , output: '生成的HTML路径'}
   */
  saveHTML(d) {
    return new Promise((resolve, reject) => {
      console.log('===writing html...')
      const title = d.title.replace(/[/?*:|\\<>]/g, ' ')
      const output = path.resolve(__dirname, 'dist', 'html', title + '.html')
      fs.writeFile(output, d.html, { encoding: 'utf-8' }, err => {
        err && reject(err)
        console.log('===write html file success')
        resolve({title, output})
      })
    })
  }

  toMarkdown(title, path) {
    return new Promise((resolve, reject) => {
      const turndownService = new Turndown({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
      })
      try {
        const markdown = turndownService.turndown(fs.readFileSync(path, { encoding: 'utf-8' }))
        resolve({ title, markdown }) 
      } catch (error) {
        reject(error)
      }
    })
  }

  saveMD(title, data) {
    return new Promise((resolve, reject) => {
      console.log('===writing markdown...')
      const output = path.resolve(__dirname, 'dist', 'md', title + '.md')
      fs.writeFile(output, data, { encoding: 'utf-8' }, err => {
        err && reject(err)
        console.log('===write markdown file success')
        resolve()
      })
    })
  }

  /**
   * 保存文件为 PDF
   * @param {String} title 文章标题
   * @param {String} htmlPath 生产html的路径
   */
  savePDF(title, htmlPath) {
    return new Promise((resolve, reject) => {
      console.log('===writing pdf...')
      const output = path.resolve(__dirname, 'dist', 'pdf', title + '.pdf')
      this.page.goto(`file://${htmlPath}`).then(() => {
        this.page.pdf({
          path: output
        }).then(() => {
          console.log('===write pdf file success')
          resolve()
        })
      }).catch ((err) => {
        reject(err)
      })
    })
  }

}
// 入口执行方法
{(async () => {
  rmfile('html')
  rmfile('md')
  rmfile('pdf')
  const juejin = new Juejin()
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    juejin.browser = browser
    juejin.page = page
    await juejin.getMetaData()
    await juejin.mainPage()
    await sleep()
    await juejin.login()
    await sleep()
    await juejin.getTargetBookSectionList()

    const dirname = 'juejin-' + juejin.bookID

    await juejin.getContentHTML(async d => {
      const { title, output } = await juejin.saveHTML(d)
      const { title: mdTitle, markdown: markdownData } = await juejin.toMarkdown(title, output)
      await juejin.saveMD(mdTitle, markdownData)
      await juejin.savePDF(title, output)
      juejin.copyToPWDDir(dirname, 'pdf', 'pdf')
      return
    })

    setTimeout(() => {
      console.log(`${os.EOL}======${os.EOL}All Done...Enjoy.${os.EOL}======${os.EOL}`)
    }, 200)

  } catch (error) {
    console.log(error) 
  } finally {
    // 释放无头浏览器的资源
    juejin.page && await juejin.page.close()
    juejin.browser && await juejin.browser.close()
  }
})()} 
