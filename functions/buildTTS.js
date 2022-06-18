import gTTS from 'gtts'

export async function buildTracks(comments, fileLength) {
  const { log } = console

  if (fileLength === 0){
    const files = []
    let totalCharacters = 0
    let selectedComments = []
  
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i]
      
      if (totalCharacters < 13000) {
        let gtts = new gTTS(comment.body, 'en')
        
        gtts.save(`./tracks/${comment.id}.mp3`, (err, res) => {
          if (err) output(TYPE.ERROR, EVENT.GTTS_ERR, undefined, { 'Track': comment.id, 'Length': comment.body.length })
          log(`Creating File', ${comment.id}`)
        })
        
        totalCharacters += comment.body.length
        files.push(`${comment.id}.mp3`)
    
        selectedComments.push({
          comment: comment.body,
          link: comment.permalink,
          ups: comment.ups,
          id: comment.id,
          bodyLength: comment.body.length,
        })
      } else break
    }
  
    if (files.length === selectedComments.length) {
      return ({
        files: files,
        comments: selectedComments,
        totalCharacters: totalCharacters,
      })
    }
  }
}