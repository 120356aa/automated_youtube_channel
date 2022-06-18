import axios from 'axios'
import snoowrap from 'snoowrap'
import fs from 'fs'
import puppeteer from 'puppeteer'
import { auth } from './config/config.js'
import { getBestThread } from './helpers/getBestThread.js'
import { getHighestScore } from './helpers/getHighestScore.js'
import { output } from './helpers/log.js'
import { buildTracks } from './functions/buildTTS.js'
import { purgeDirectory } from './functions/purgDirectory.js'
import { TYPE, EVENT } from './constants/dictionary.js'

export async function init() {
  const res = await axios.get(`https://www.reddit.com/r/confessions/top/.json?count=100`)
  const bestThreadID = getBestThread(res.data.data.children)

  try {
    const reddit = new snoowrap(auth)
    const { comments } = await reddit.getSubmission(bestThreadID).expandReplies()
    const sortedComments = getHighestScore(comments)

    fs.readdir('./tracks/', (err, files) => {
      if (err) output(TYPE.ERROR, EVENT.READDIR_ERR, err)
      if (files.length > 0) purgeDirectory(files)
      if (files.length === 0) {
        const res = buildTracks(sortedComments, files.length)
        console.log(res)
      }
    })
  } catch (err) {
    output(TYPE.ERROR, EVENT.SNOO_ERR, err)
  }
} init()