import fs from 'fs'
import { getAudioDurationInSeconds } from 'get-audio-duration'

export const getDuration = async (comments, files) => {
  let totalDuaration = 0
  let selectedComments = []
  let totalCharacters = 0

    for (let i = 0; i < comments.length; i++) {
      log(`${comments[i].id}: Calculating Track Duration`)

      if (fs.existsSync(`./tracks/${comments[i].id}.mp3`)) {
        let duration = await getAudioDurationInSeconds(`./tracks/${comments[i].id}.mp3`)
        totalDuaration += duration

        selectedComments.push({
          comment: comments[i].body,
          link: comments[i].permalink,
          ups: comments[i].ups,
          id: comments[i].id,
          bodyLength: comments[i].body.length,
          duration: duration / 1000
        })
      }

      if (i === comments.length) {
        output(TYPE.INFO, EVENT.GTTS_DONE, undefined, {
          TotalDuration: totalDuaration / 60,
          TotalCharacters: totalCharacters, 
          TotalComments: selectedComments.length,
          TotalFiles: files.length,
          Files: files,
          Comments: selectedComments
        })
  
        return ({
          comments: selectedComments,
          totalDuration: totalDuaration / 60,
          status: 1
        })
      }
    }
}