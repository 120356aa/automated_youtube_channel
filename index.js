import axios from 'axios'
import snoowrap from 'snoowrap'
import gTTS from 'gtts'
import fs from 'fs'
import puppeteer from 'puppeteer'
import { auth } from './config/config.js'
import { getBestThread } from './functions/getBestThread.js'
import { getHighestScore } from './functions/getHighestScore.js'
import { stripComments } from './helpers/stripComments.js'
import { output } from './functions/log.js'
import { TYPE, EVENT } from './constants/dictionary.js'

(async function main() {
  const { log } = console
  const res = await axios.get(`https://www.reddit.com/r/confessions/top/.json?count=100`)

  if (res) {
    const bestThreadID = getBestThread(res.data.data.children, 0)

    try {
      const reddit = new snoowrap(auth)
      const { comments } = await reddit.getSubmission(bestThreadID).expandReplies({ limit: 20, depth: 2 })
      const sortedComments = getHighestScore(comments)

      fs.readdir('./tracks/', (err, files) => {
        if (err) throw err
        let totalTracks = files.length

        if (totalTracks === 0) buildTTS(sortedComments)
        if (totalTracks > 0) {
          for (const file of files) {
            fs.unlink(`./tracks/${file}`, err => {
              if (err) throw err
              log('Deleting File', file)
              totalTracks --
              if (totalTracks === 0) buildTTS(sortedComments)
            })
          }
        }

      })
    } catch (err) {
      output(TYPE.ERROR, EVENT.SNOO_ERR, err)
    }
  }

  async function buildTTS(comments) {
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i]
      let gtts = new gTTS(comment.body, 'en')

      gtts.save(`./tracks/${comment.id}.mp3`, (err, res) => {
        if (err) output(TYPE.ERROR, EVENT.GTTS_ERR, undefined, { 'Track': comment.id, 'Length': comment.body.length })
        log(`Creating File', ${comment.id}`)

        if (i === comments.length - 1) {
          output(TYPE.INFO, EVENT.GTTS_DONE)
          setSelectedComments(comments)
        }
      })
    }
  }

  function setSelectedComments(comments) {
    let selectedComments = []
    let totalCharacters = 0

    for (let i = 0; i < comments.length; i++) {
      let currentComment = comments[i]
      
      totalCharacters += currentComment.body.length
      selectedComments.push({
        comment: currentComment.body,
        link: currentComment.permalink,
        ups: currentComment.ups,
        id: currentComment.id,
        bodyLength: currentComment.body.length,
      })
    }

    const data = { 'Total Characters:': totalCharacters, 'Selected Comments:': selectedComments }
    output(TYPE.INFO, EVENT.SELECTED_COMMENTS, undefined, data)
  }
})()