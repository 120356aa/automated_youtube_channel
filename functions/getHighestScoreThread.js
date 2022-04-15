// Filter and return the highest score thread
export const getHighestScoreThread = (thread) => {
  return thread
    .sort((a, b) => {
      let keyA = a.data.ups
      let keyB = b.data.ups

      if (keyA < keyB) return 1
      if (keyA > keyB) return -1
      return 0
    })
    .slice(0, 1)
}