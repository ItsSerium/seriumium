const DatabasePool = require('./DatabasePool')

const defaultPreference = {
  'prompt.palette': false,
  'guildMemberAdd.verifyCaptcha': false
}

const getGuildSettings = identify => {
  return new Promise((resolve, reject) => {
    DatabasePool.getConnection((connectionError, connection) => {
      if (connectionError) reject(connectionError)

      connection.query(`SELECT preference FROM serium_servers WHERE identify = ${identify}`, (queryError, results) => {
        if (queryError) reject(queryError)

        if (results[0]) {
          connection.release()

          resolve(JSON.parse(results[0].preference))
        } else {
          connection.query(`INSERT INTO serium_servers (identify, preference) VALUES ('${identify}', '${JSON.stringify(defaultPreference)}')`, creationError => {
            connection.release()

            if (creationError) {
              reject(creationError)
            } else {
              resolve(defaultPreference)
            }
          })
        }
      })
    })
  })
}
const setGuildSettings = (identify, data) => {
  return new Promise((resolve, reject) => {
    DatabasePool.getConnection((connectionError, connection) => {
      if (connectionError) reject(connectionError)

      connection.query(`UPDATE serium_servers SET preference = '${JSON.stringify(data).replace(/\'/g, '\'')}' WHERE identify = ${identify}`, (queryError, results) => {
        if (queryError) reject(queryError)

        connection.release()
        resolve()
      })
    })
  })
}

module.exports.getGuildSettings = getGuildSettings
module.exports.setGuildSettings = setGuildSettings