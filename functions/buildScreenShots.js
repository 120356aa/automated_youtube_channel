import puppeteer from 'puppeteer';
import { output } from '../helpers/log.js';
import { TYPE, EVENT } from '../constants/dictionary.js'
const { log } = console

export async function buildScreenshots(comments) {
  let key = 0

  try {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']})
    
    comments.forEach(async comment => {
      try {
        const page = await browser.newPage()
        await page.goto(`https://www.reddit.com${comment.link}`)
        await page.waitFor(1000)
        await page.screenshot({path: `./screenshots/${comment.id}.png`, fullPage: true})
        log(`${comment.id}: Screenshot Taken`)
        key++
      } catch (err) { output(TYPE.ERROR, EVENT.SCREENSHOT_ERR, err) }
    })
    
    if (key === comments.length) {
      await browser.close()
      return { status: 1 }
    }
  } catch (err) { output(TYPE.ERROR, EVENT.SCREENSHOT_ERR, err) }
}
