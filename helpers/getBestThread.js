export const getBestThread = data => {
  const thread = data.sort((a, b) => {
    let keyA = a.data.ups
    let keyB = b.data.ups

    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })

  return thread[0].data.id
}