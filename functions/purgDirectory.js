import fs from 'fs'
import { init } from '../index.js'
const { log } = console

export const purgeDirectory = async (files, skip) => {
  let key = files.length

  for (const file of files) {
    fs.unlink(`./tracks/${file}`, err => {
      if (err) throw err
      key--
      log(`${file}: Deleting`)
      if (key === 0) {
        log(`Directory Purging Complete`)
        init(skip)
      }
    })
  }
}