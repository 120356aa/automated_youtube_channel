export const stripThreads = data => {
  let filtered = []
  
  data.forEach(el => {
    filtered.push({
      id: el.data.id,
      ups: el.data.ups,
      downs: el.data.downs,
      selftext: el.data.selftext,
      permalink: el.data.permalink,
      author: el.data.author,
      comments: el.data.num_comments,
    })
  })

  return filtered
}