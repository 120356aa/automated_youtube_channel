import axios from 'axios'
import snoowrap from 'snoowrap'
import fs from 'fs'
import { auth } from './config/config.js'
import { getBestThread } from './helpers/getBestThread.js'
import { getHighestScore } from './helpers/getHighestScore.js'
import { output } from './helpers/log.js'
import { buildTracks } from './functions/buildTracks.js'
import { purgeDirectory } from './functions/purgDirectory.js'
import { buildScreenshots } from './functions/buildScreenShots.js'
import { TYPE, EVENT } from './constants/dictionary.js'
const { log } = console

export async function init(skip) { 
  try {
    const res = await axios.get(`https://www.reddit.com/r/confessions/top/.json?count=100`)
    const bestThreadID = getBestThread(res.data.data.children, skip)
    const reddit = new snoowrap(auth)
    const { comments } = await reddit.getSubmission(bestThreadID).expandReplies()
    const sortedComments = getHighestScore(comments)

    fs.readdir('./tracks/', async (err, files) => {
      if (err) output(TYPE.ERROR, EVENT.READDIR_ERR, err)

      if (files.length > 0) {
        log(`Tracks Found, Purging Directory...`)
        await purgeDirectory(files, skip)
      } 

      if (files.length === 0) {
        log(`Directory Empty, Building Tracks...`)
        const { totalDuration, comments, status } = await buildTracks(sortedComments)

        if (status) {
          log(`Building Tracks Completed`)

          if (totalDuration > 6) {
            log(`Building Screenshots...`)
            const { status } = buildScreenshots(comments)

            if (status) {
              log(`Building Screenshots Completed`)
            }  else output(TYPE.ERROR, EVENT.SCREENSHOT_ERR)
          }

          else {
            output(TYPE.ERROR, EVENT.DURATION_ERR, { Duration: totalDuration })
            init(skip + 1)
          }
        }
      }
    })
  } catch (err) { output(TYPE.ERROR, EVENT.REDDIT_ERR, err) }
} init(0)