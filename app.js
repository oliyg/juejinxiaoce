const puppeteer = require('puppeteer');
const fs = require('fs')

const URL = 'https://juejin.im/books'
const LOGIN_BTN_SELECTOR = '#juejin > div.view-container.books-container > div > header > div > nav > ul > li.nav-item.auth > span.login'
const LOGIN_INPUT_USERNAME_SELECTOR = '#juejin > div.global-component-box > div.auth-modal-box > form > div.panel > div.input-group > div:nth-child(1) > input'
const LOGIN_INPUT_PASSWD_SELECTOR = '#juejin > div.global-component-box > div.auth-modal-box > form > div.panel > div.input-group > div:nth-child(2) > input'
const LOGIN_LOGIN_BTN_SELECTOR = '#juejin > div.global-component-box > div.auth-modal-box > form > div.panel > button'

const BOOK_ID = '5bc844166fb9a05cd676ebca'
const BOOKS_SELECTOR = '#juejin > div.view-container.books-container > main > div > div.list-wrap > div.books-list > a'
const BOOK_CONTENT_FIRST_PAGE_SELECTOR = '#juejin > div.book-read-view > section > div.book-summary > div.book-summary-inner > div.book-directory.book-directory.bought > a:nth-child(1)'
const BOOK_CONTENT_IMGS_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-body > div > div > div > div > figure > img'
const BOOK_CONTENT_WRAPPER_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-body > div > div > div > div'
const BOOK_NAV_NEXT_BAR_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-handle.book-direction > div.step-btn.step-btn--next'
const BOOK_NAV_FINISHED_BAR_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-handle.book-direction > div.step-btn.step-btn--finished'
const BOOK_CHAPTER_TITLE_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-body > div > div > div > div > h1'

const LOGIN_USERNAME = ''
const LOGIN_PASSWD = ''

{
(async () => {
      const browser = await puppeteer.launch({
        executablePath: './chrome-win/chrome.exe',
        headless: true,
        defaultViewport: {
          width: 1920,
          height: 1080
        }
      });
      const page = await browser.newPage();
      // load page
      await page.goto(URL);
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
      await page.screenshot({ path: 'juejin.png' })
      // select book by id
      target_href = await page.$$eval(BOOKS_SELECTOR, (elems, BOOK_ID) => {
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
        await page_book.waitFor(2000) // todo wait for content loading content ......
        await page_book.waitForSelector(BOOK_CONTENT_WRAPPER_SELECTOR)
        await page_book.evaluate(BOOK_CONTENT_IMGS_SELECTOR => {
          document.querySelectorAll(BOOK_CONTENT_IMGS_SELECTOR).forEach(item => {
            item.src = item.getAttribute('data-src')
          })
        }, BOOK_CONTENT_IMGS_SELECTOR)
        const content_html = await page_book.$eval(BOOK_CONTENT_WRAPPER_SELECTOR, el => el.innerHTML)
        await page_book.waitForSelector(BOOK_CHAPTER_TITLE_SELECTOR)
        const title = await page_book.$eval(BOOK_CHAPTER_TITLE_SELECTOR, el => el.innerText.replace(/[\/\?\*\:\|\\\<\>]/g, ' '))
        console.log(title)
        fs.writeFileSync('./dist/html/' + title + '.html', content_html, { encoding: 'utf-8' })
        // handle more page
        const if_finished = await page_book.$(BOOK_NAV_FINISHED_BAR_SELECTOR)
        console.log('has finished: ', Boolean(if_finished))
        if (if_finished) {
          console.log('all done')
          browser.close();
        } else {
          await page_book.click(BOOK_NAV_NEXT_BAR_SELECTOR)
          get_content_html()
        }
      }
      get_content_html()
})();
}

