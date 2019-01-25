/* eslint-disable no-console */
require('dotenv').config()
const { getCookieArr, getCookieObj, sendPost, sendGet, sleep } = require('./utils')
const { USER_AGENT, URL_HOSTNAME, URL_LOGIN, URL_BOOK_HOSTNAME, URL_BOOK_LIST_SECTION } = require('./constant')

class Juejin {
  constructor(email, password, bookID) {
    this.email = email 
    this.password = password
    this.bookID = bookID
    this.cookie = ''
    this.src = 'web'
    this.userInfo = {}
    this.bookSectionList = []
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
    this.userInfo = JSON.parse(response.data.toString())
    return response 
  }

  async getTargetBookSectionList() {
    console.warn('===getting book section list')
    const headers = {
      'User-Agent': USER_AGENT,
      'Connection': 'keep-alive'
    }
    const response = await sendGet(URL_BOOK_HOSTNAME, `${URL_BOOK_LIST_SECTION}?uid=${this.userInfo.userId}&client_id=${this.userInfo.user.clientId}&token=${this.userInfo.user.token}&src=${this.src}&id=${process.env.BOOK_ID}`, headers)
    this.bookSectionList = JSON.parse(response.data.toString()).d
    return response
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
  } catch (error) {
    console.log(error) 
  }
})()} 
