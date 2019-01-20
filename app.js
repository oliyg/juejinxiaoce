/* eslint-disable no-console, no-undef */
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const del = require('delete')
require('dotenv').config()

const { URL, LOGIN_BTN_SELECTOR, LOGIN_INPUT_USERNAME_SELECTOR, LOGIN_INPUT_PASSWD_SELECTOR, LOGIN_LOGIN_BTN_SELECTOR, BOOKS_SELECTOR, BOOK_CONTENT_FIRST_PAGE_SELECTOR, BOOK_CONTENT_IMGS_SELECTOR, BOOK_CONTENT_WRAPPER_SELECTOR, BOOK_NAV_NEXT_BAR_SELECTOR, BOOK_NAV_FINISHED_BAR_SELECTOR, BOOK_CHAPTER_TITLE_SELECTOR } = require('./constant')

const LOGIN_USERNAME = process.env.USER_NAME
const LOGIN_PASSWD = process.env.USER_PASSWD
const BOOK_ID = process.env.BOOK_ID

{
  (async () => {
    const browser = await puppeteer.launch({
      executablePath: './chrome-win/chrome.exe',
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    })

    console.log('clear html dir...')
    const input_path = path.resolve(__dirname, 'dist', 'html')
    if (fs.existsSync(input_path)) del.sync(['dist/html/**.html'])   

    const page = await browser.newPage()
    // load page
    await page.goto(URL)
    await page.on('load', () => {
      console.log('page loaded') 
    })
    // login page
    await page.click(LOGIN_BTN_SELECTOR)
    console.log('nav to login page')
    // fill login username and password
    await page.tap(LOGIN_INPUT_USERNAME_SELECTOR)
    await page.type(LOGIN_INPUT_USERNAME_SELECTOR, LOGIN_USERNAME)
    await page.tap(LOGIN_INPUT_PASSWD_SELECTOR)
    await page.type(LOGIN_INPUT_PASSWD_SELECTOR, LOGIN_PASSWD)
    await Promise.all([
      page.waitForNavigation(),
      page.click(LOGIN_LOGIN_BTN_SELECTOR)
    ])
    // select book by id
    await page.waitForSelector(BOOKS_SELECTOR)
    const target_href = await page.$$eval(BOOKS_SELECTOR, (elems, BOOK_ID) => {
      const hrefs = elems.filter(item => item.href.includes(BOOK_ID))
      return hrefs[0].href
    }, BOOK_ID)
    console.log(`match url: ${target_href}`)

    // newtab to book content
    const page_book = await browser.newPage()
    await page_book.goto(target_href)
    await page_book.on('load', () => {
      console.log('page loaded')
    })
    // get html code
    await page_book.waitForSelector(BOOK_CONTENT_FIRST_PAGE_SELECTOR)
    await page_book.click(BOOK_CONTENT_FIRST_PAGE_SELECTOR) // goto first content page

    // get_content_html
    const get_content_html = async () => {
      await page_book.waitFor(3000) // todo wait for content loading content ......
      await page_book.waitForSelector(BOOK_CONTENT_WRAPPER_SELECTOR)
      await page_book.evaluate(BOOK_CONTENT_IMGS_SELECTOR => {
        document.querySelectorAll(BOOK_CONTENT_IMGS_SELECTOR).forEach(item => {
          item.src = item.getAttribute('data-src')
        })
      }, BOOK_CONTENT_IMGS_SELECTOR)
      const content_html = await page_book.$eval(BOOK_CONTENT_WRAPPER_SELECTOR, el => el.innerHTML)
      await page_book.waitForSelector(BOOK_CHAPTER_TITLE_SELECTOR)
      const title = await page_book.$eval(BOOK_CHAPTER_TITLE_SELECTOR, el => el.innerText.replace(/[/?*:|\\<>]/g, ' '))
      console.log(title)
      fs.writeFileSync('./dist/html/' + title + '.html', content_html, { encoding: 'utf-8' })
      // handle more page
      const if_finished = await page_book.$(BOOK_NAV_FINISHED_BAR_SELECTOR)
      console.log('all finished: ', Boolean(if_finished))
      if (if_finished) {
        console.log('got all html file')
        console.log('about to convert ...... please wait ......')
        browser.close()
      } else {
        await page_book.click(BOOK_NAV_NEXT_BAR_SELECTOR)
        get_content_html()
      }
    }
    get_content_html()
  })()
}

