import fs from 'fs'
import { init } from '../index.js'

export const purgeDirectory = async files => {
  const { log } = console
  let key = files.length

  for (const file of files) {
    fs.unlink(`./tracks/${file}`, err => {
      if (err) throw err

      key--
      log('Deleting File', file)

      if (key === 0) init()
    })
  }
}