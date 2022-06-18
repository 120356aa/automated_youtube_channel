export const getHighestScore = data => {
  const sorted = data.sort((a, b) => {
    let keyA = a.ups
    let keyB = b.ups

    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })

  return sorted
}