const https = require('https')

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
      res.on('end', () => { resolve(data) })
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

function cookieToStr(cookieArray) {
  return cookieArray.map(elem => elem.match(/(.+); path/)[1])
}

module.exports = {
  setHeaders, cookieToStr, sendPost, sendGet
}
