const { log } = console

export const getHighestScore = data => {
  let pruned = []
  let totalCharacters = 0

  const sorted = data.sort((a, b) => {
    let keyA = a.ups
    let keyB = b.ups

    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })

  for (let i = 0; i < sorted.length; i++) {
    log('Prunning Comments...')
    if (totalCharacters < 10000) {
      pruned.push(sorted[i])
      totalCharacters += sorted[i].body.length
    } else {
      log(`Prunning Complete`)
      return pruned
    }
  }
}