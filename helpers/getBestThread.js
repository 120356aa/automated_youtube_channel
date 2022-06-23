import { output } from './log.js'
import { TYPE, EVENT } from '../constants/dictionary.js'

export const getBestThread = (data, skip) => {
  const thread = data.sort((a, b) => {
    let keyA = a.data.ups
    let keyB = b.data.ups

    if (keyA < keyB) return 1
    if (keyA > keyB) return -1
    return 0
  })

  if (thread[skip]) return thread[skip].data.id
  else output(TYPE.ERROR, EVENT.THREAD_ERR, undefined, { 'Thread': thread[skip].data.id })
}