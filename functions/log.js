export const output = (type, event, track, length, err, data) => {
  const { log } = console
  log({
      'Type': type,
      'Event': event,
      'Track': track,
      'Length': length,
      'Error': err,
      'Data': data
  })
}