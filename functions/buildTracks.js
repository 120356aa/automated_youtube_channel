import gTTS from 'gtts'
import { output } from '../helpers/log.js'
import { getDuration } from './getDuration.js'
import { TYPE, EVENT } from '../constants/dictionary.js'
const { log } = console

export async function buildTracks(comments) {
  const files = []

  for (let i = 0; i < comments.length; i++) {
    let comment = comments[i]
    let gtts = new gTTS(comment.body, 'en')
    
    files.push(`${comment.id}.mp3`)
    gtts.save(`./tracks/${comment.id}.mp3`, (err, res) => {
      if (err) output(TYPE.ERROR, EVENT.GTTS_ERR, err, { 'Track': comment.id, 'Length': comment.body.length })
      log(`${comment.id}: Converting to Speech`)
    })
  }

  if (files.length === comments.length) {
    log(`Building Tracks Completed`)
    const { comments, totalDuration, status} = await getDuration(comments)

    if (status) {
      log(`Pushing Duration and Building Comments Completed`)
      return { comments, totalDuration, files: files }
    }
  }
}