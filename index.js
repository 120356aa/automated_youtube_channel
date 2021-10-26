import axios from 'axios'
import snoowrap from 'snoowrap'
import dotenv from 'dotenv'
import gTTS from 'gtts'
import fs from 'fs'
import getMP3Duration from 'get-mp3-duration'
import puppeteer from 'puppeteer'
import { recursiveSearch } from './functions/recursiveSearch.js'
dotenv.config()

async function main() {
	try {
        const response = await axios.get(`https://www.reddit.com/r/confessions/top/.json?count=100`)
        let id = response.data.data.children[1].data.id
        
		try {
			const reddit = new snoowrap({
				userAgent: 'YTAutomation u/Ssn0wTheMiz',
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				username: process.env.CLIENT_USER,
				password: process.env.CLIENT_PASS,
			})

			const { comments } = await reddit.getSubmission(id).expandReplies({ limit: 30, depth: Infinity })
			recursiveSearch(comments)

			function buildFiles() {
				let selectedComments = []
				
				if(fs.readdirSync('./tracks/').length !== comments.length) {
					for (let i = 0; i < comments.length; i++) {
						
						let gtts = new gTTS(comments[i].body, 'en')
						gtts.save(`./tracks/${comments[i].id}.mp3`, (err, res) => {
							if (err) { throw new Error(err) }
							console.log(`Building Track: ${comments[i].id} -- Lenght: ${comments[i].body.length}`)

							selectedComments.push({
								comment: comments[i].body,
								link: comments[i].permalink,
								ups: comments[i].ups,
								id: comments[i].id,
								duration: (() => {
									let buffer = fs.readFileSync(`./tracks/${comments[i].id}.mp3`)
									let length = getMP3Duration(buffer)
									return length
								})
							})
							
						})

					}
				}
			}
			buildFiles()

			async function buildScreenshots() {
				for (let i = 0; i < comments.length; i++) {
					const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] })
					const page = await browser.newPage()
					
					let width = 500
					let height = 320
					let bodyLength = comments[i].body.length

					if (bodyLength < 50) height = 340
					if (bodyLength > 50 && bodyLength < 100) height = 340
					if (bodyLength > 100 && bodyLength < 150) height = 380
					if (bodyLength > 150 && bodyLength < 200) height = 400
					if (bodyLength > 200 && bodyLength < 250) height = 420
					if (bodyLength > 250 && bodyLength < 300) height = 440
					if (bodyLength > 300 && bodyLength < 350) height = 460
					if (bodyLength > 350 && bodyLength < 400) height = 480
					if (bodyLength > 400 && bodyLength < 450) height = 500
					if (bodyLength > 450 && bodyLength < 500) height = 520
					if (bodyLength > 500 && bodyLength < 550) height = 540
					if (bodyLength > 550 && bodyLength < 600) height = 560
					if (bodyLength > 600 && bodyLength < 650) height = 580
					if (bodyLength > 650) height = 600

					try {
						await page.setViewport({ width: 700, height: 1000 });
						await page.goto(`https://www.reddit.com${comments[i].permalink}`, { waitUnil: 'networkidle2' })
						await page.screenshot({ path: `./screenshots/${comments[i].id}.jpg`, type: 'jpeg', clip: {
							x: 100,
							y: 110,
							width: width,
							height: height
						}})
						await page.close()
						await browser.close()
						
						console.log(`Capturing Screenshot: ${comments[i].id} -- Length: ${comments[i].body.length}`)
					} catch (err) { console.log(err) }
				}
			}
			buildScreenshots()

		} catch (err) { console.log(err) }
	} catch (err) { console.error(err) }
}

main()