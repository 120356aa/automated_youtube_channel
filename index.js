import axios from 'axios'
import snoowrap from 'snoowrap'
import gTTS from 'gtts'
import fs from 'fs'
import getMP3Duration from 'get-mp3-duration'
import puppeteer from 'puppeteer'
import { auth } from './config/config.js'
import { getBestThread } from './functions/getBestThread.js'
import { getHighestScore } from './functions/getHighestScore.js'
import { stripComments } from './helpers/stripComments.js'

async function main() {
  const { log } = console

	try {
		const res = await axios.get(`https://www.reddit.com/r/confessions/top/.json?count=100`)
    const bestThreadID = getBestThread(res.data.data.children)
        
		try {
			const reddit = new snoowrap(auth)
			const { comments } = await reddit.getSubmission(bestThreadID).expandReplies({ limit: 20, depth: 2 })

      const sortedComments = getHighestScore(comments)

      if (sortedComments.length > 0) {
        (function buildFiles() {
          let selectedComments = []
          
          for (let i = 0; i < sortedComments.length; i++) {
            let gtts = new gTTS(sortedComments[i].body, 'en')
            gtts.save(`./tracks/${sortedComments[i].id}.mp3`, (err, res) => {
              if (err) { throw new Error(err) }
              log(`Building Track: ${sortedComments[i].id} -- Length: ${sortedComments[i].body.length}`)

              let buffer = fs.readFileSync(`./tracks/${sortedComments[i].id}.mp3`)
              let length = getMP3Duration(buffer)
  
              selectedComments.push({
                comment: sortedComments[i].body,
                link: sortedComments[i].permalink,
                ups: sortedComments[i].ups,
                id: sortedComments[i].id,
                duration: length
              })
            })
          }

          log(selectedComments)
        })()
      }

      // const strippedComments = stripComments(sortedComments)
      
      // log(strippedComments)
      // const comments = fs.readFileSync('./comments.json')
      // const commentsParsed = JSON.parse(comments)

      // buildFiles()

			// async function buildScreenshots() {
			// 	for (let i = 0; i < comments.length; i++) {
			// 		const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] })
			// 		const page = await browser.newPage()
					
			// 		let width = 500
			// 		let height = 320
			// 		let bodyLength = comments[i].body.length

			// 		if (bodyLength < 50) height = 340
			// 		if (bodyLength > 50 && bodyLength < 100) height = 340
			// 		if (bodyLength > 100 && bodyLength < 150) height = 380
			// 		if (bodyLength > 150 && bodyLength < 200) height = 400
			// 		if (bodyLength > 200 && bodyLength < 250) height = 420
			// 		if (bodyLength > 250 && bodyLength < 300) height = 440
			// 		if (bodyLength > 300 && bodyLength < 350) height = 460
			// 		if (bodyLength > 350 && bodyLength < 400) height = 480
			// 		if (bodyLength > 400 && bodyLength < 450) height = 500
			// 		if (bodyLength > 450 && bodyLength < 500) height = 520
			// 		if (bodyLength > 500 && bodyLength < 550) height = 540
			// 		if (bodyLength > 550 && bodyLength < 600) height = 560
			// 		if (bodyLength > 600 && bodyLength < 650) height = 580
			// 		if (bodyLength > 650) height = 600

			// 		try {
			// 			await page.setViewport({ width: 700, height: 1000 });
			// 			await page.goto(`https://www.reddit.com${comments[i].permalink}`, { waitUnil: 'networkidle2' })
			// 			await page.screenshot({ path: `./screenshots/${comments[i].id}.jpg`, type: 'jpeg', clip: {
			// 				x: 100,
			// 				y: 110,
			// 				width: width,
			// 				height: height
			// 			}})
			// 			await page.close()
			// 			await browser.close()
						
			// 			console.log(`Capturing Screenshot: ${comments[i].id} -- Length: ${comments[i].body.length}`)
			// 		} catch (err) { console.log(err) }
			// 	}
			// }
			// buildScreenshots()

		} catch (err) { console.log({ message: err }, err) }
	} catch (err) { console.error(err) }
}

main()