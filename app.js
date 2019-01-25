/* eslint-disable no-console */
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const os = require('os')
const Turndown = require('turndown')

const { getCookieArr, getCookieObj, sendPost, sendGet, sleep } = require('./utils')
const { USER_AGENT, URL_HOSTNAME, URL_LOGIN, URL_BOOK_HOSTNAME, URL_BOOK_LIST_SECTION, URL_BOOK_SECTION } = require('./constant')

class Juejin {
  constructor(email, password, bookID) {
    this.email = email 
    this.password = password
    this.bookID = bookID
    this.cookie = ''
    this.src = 'web'
    this.userInfo = {}
    this.bookSectionList = []
    this.count = 0
  }

  async mainPage() {
    console.warn('===navagating to main page')
    const headers = {
      'User-Agent': USER_AGENT,
      'Connection': 'keep-alive'
    }
    const response = await sendGet(URL_HOSTNAME, '/', headers)
    this.cookie = JSON.stringify(getCookieObj(response.headers['set-cookie']))
  }

  async login() {
    console.warn('===login...')
    const auth = JSON.stringify({ email: this.email, password: this.password })
    const headers = {
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(auth),
      'Cookie': getCookieArr(JSON.parse(this.cookie))
    }
    const response = await sendPost(URL_HOSTNAME, URL_LOGIN, auth, headers)
    this.cookie = JSON.stringify(Object.assign(JSON.parse(this.cookie), getCookieObj(response.res.headers['set-cookie'])))
    this.userInfo = JSON.parse(response.data)
    return response 
  }

  async getTargetBookSectionList() {
    console.warn('===getting book section list')
    const headers = {
      'User-Agent': USER_AGENT,
      'Connection': 'keep-alive'
    }
    const response = await sendGet(URL_BOOK_HOSTNAME, `${URL_BOOK_LIST_SECTION}?uid=${this.userInfo.userId}&client_id=${this.userInfo.user.clientId}&token=${this.userInfo.user.token}&src=${this.src}&id=${process.env.BOOK_ID}`, headers)
    const data = response.data
    this.bookSectionList = JSON.parse(data).d
    return response
  }

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
    callback(data.d)

    this.count ++
    let maxCount = this.bookSectionList.length
    this.count < maxCount && await this.getContentHTML(callback)
  }

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

}

{(async () => {
  const juejin = new Juejin(process.env.USER_EMAIL, process.env.USER_PASSWD)
  try {
    await juejin.mainPage()
    await sleep()
    await juejin.login()
    await sleep()
    await juejin.getTargetBookSectionList()
    await juejin.getContentHTML(async d => {
      const { title, output } = await juejin.saveHTML(d)
      const { title: mdTitle, markdown: markdownData } = await juejin.toMarkdown(title, output)
      await juejin.saveMD(mdTitle, markdownData)
    })

    setTimeout(() => {
      console.log(`${os.EOL}======${os.EOL}All Done...Enjoy.${os.EOL}======${os.EOL}`)
    }, 200)

  } catch (error) {
    console.log(error) 
  }
})()} 
