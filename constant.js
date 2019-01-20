const URL = 'https://juejin.im/books'
const LOGIN_BTN_SELECTOR = '#juejin > div.view-container.books-container > div > header > div > nav > ul > li.nav-item.auth > span.login'
const LOGIN_INPUT_USERNAME_SELECTOR = '#juejin > div.global-component-box > div.auth-modal-box > form > div.panel > div.input-group > div:nth-child(1) > input'
const LOGIN_INPUT_PASSWD_SELECTOR = '#juejin > div.global-component-box > div.auth-modal-box > form > div.panel > div.input-group > div:nth-child(2) > input'
const LOGIN_LOGIN_BTN_SELECTOR = '#juejin > div.global-component-box > div.auth-modal-box > form > div.panel > button'

const BOOKS_SELECTOR = '#juejin > div.view-container.books-container > main > div > div.list-wrap > div.books-list > a'
const BOOK_CONTENT_FIRST_PAGE_SELECTOR = '#juejin > div.book-read-view > section > div.book-summary > div.book-summary-inner > div.book-directory.book-directory.bought > a:nth-child(1)'
const BOOK_CONTENT_IMGS_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-body > div > div > div > div > figure > img'
const BOOK_CONTENT_WRAPPER_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-body > div > div > div > div'
const BOOK_NAV_NEXT_BAR_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-handle.book-direction > div.step-btn.step-btn--next'
const BOOK_NAV_FINISHED_BAR_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-handle.book-direction > div.step-btn.step-btn--finished'
const BOOK_CHAPTER_TITLE_SELECTOR = '#juejin > div.book-read-view > section > div.book-content > div > div.book-body > div > div > div > div > h1'

module.exports = {
  URL, LOGIN_BTN_SELECTOR, LOGIN_INPUT_USERNAME_SELECTOR, LOGIN_INPUT_PASSWD_SELECTOR, LOGIN_LOGIN_BTN_SELECTOR, BOOKS_SELECTOR, BOOK_CONTENT_FIRST_PAGE_SELECTOR, BOOK_CONTENT_IMGS_SELECTOR, BOOK_CONTENT_WRAPPER_SELECTOR, BOOK_NAV_NEXT_BAR_SELECTOR, BOOK_NAV_FINISHED_BAR_SELECTOR, BOOK_CHAPTER_TITLE_SELECTOR
}
