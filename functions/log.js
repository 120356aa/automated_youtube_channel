export const output = (type, event, err, data ) => {
  const { log } = console
  log({
    'Type': type,
    'Event': event,
    'Error': err,
    'Data': data,
  })
}