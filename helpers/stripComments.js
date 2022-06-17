export const stripComments = data => {
  let filtered = []
  
  data.forEach(el => {
    filtered.push({
      id: el.id,
      ups: el.ups,
      downs: el.downs,
      body: el.body,
      permalink: el.permalink,
      author: el.author,
      replies: el.replies,
    })
  })

  return filtered
}