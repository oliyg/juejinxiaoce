const https = require('https')

const sleep = async(wait = 1000) => {
  return new Promise(res => {
    setTimeout(() => {
      res(1)
    }, wait)
  })
}

function sendGet(hostname, path, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname, port: 443, path, method: 'GET'
    }, res => {
      const data = []
      res.on('data', chunk => { data.push(chunk) })
      res.on('error', reject)
      res.on('end', () => {
        resolve({
          headers: res.headers,
          data
        })
      })
    })
    setHeaders(req, headers)
    req.on('error', reject)
    req.end()
  })
}

function sendPost(hostname, path, data, headers) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname, path, port: 443, method: 'POST'
    }, res => {
      const data = []
      res.on('data', chunk => { data.push(chunk) })
      res.on('end', () => { resolve({
        res,
        data
      }) })
      res.on('error', reject)
    })

    setHeaders(req, headers)
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function setHeaders(req, obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      req.setHeader(key, obj[key])
    }
  }
}

function getCookieObj(cookie_arr) {
  cookie_arr = cookie_arr.map(item => item.split('; path=')[0])
  cookie_arr = cookie_arr.map(item => item.split('='))
  let result = {}
  cookie_arr.forEach(item => {
    result[item[0]] = item[1]
  })
  return result
}

function getCookieArr(cookie_obj) {
  const result = []
  for (const key in cookie_obj) {
    if (cookie_obj.hasOwnProperty(key)) {
      const value = cookie_obj[key]
      result.push(key + '=' + value)
    }
  }
  return result
}

module.exports = {
  setHeaders, getCookieObj, getCookieArr, sendPost, sendGet, sleep
}
