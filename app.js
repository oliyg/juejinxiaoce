/* eslint-disable no-console */
require('dotenv').config()
const { cookieToStr, sendPost, sendGet } = require('./utils')
const { USER_AGENT, URL_HOSTNAME, URL_LOGIN } = require('./constant')

class Juejin {
  constructor(email, password, bookID) {
    this.email = email 
    this.password = password
    this.bookID = bookID
    this.cookie = []
  }

  async mainPage() {
    const headers = {
      'User-Agent': USER_AGENT,
      'Connection': 'keep-alive'
    }
    const response = await sendGet(URL_HOSTNAME, '/', headers)
    this.cookie = this.cookie.concat(response.headers['set-cookie'])
  }

  async login() {
    const auth = JSON.stringify({ email: this.email, password: this.password })
    const headers = {
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(auth),
      'Cookie': cookieToStr(this.cookie)
    }
    return await sendPost(URL_HOSTNAME, URL_LOGIN, auth, headers)
  }
}

{(async () => {
  const juejin = new Juejin(process.env.USER_EMAIL, process.env.USER_PASSWD)
  try {
    await juejin.mainPage()
    await juejin.login().then(d => { console.log(d.toString())})
  } catch (error) {
    console.log(error) 
  }
})()} 
