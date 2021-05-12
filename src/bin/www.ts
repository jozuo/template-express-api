import app from '@/app'
import debug from 'debug'
import * as http from 'http'
import { createConnection } from 'typeorm'
debug('express-sample:server')

const port = normalizePort(process.env.PORT)
app.set('port', port)
const server = http.createServer(app)

createConnection()
  .then(_connection => {
    server.listen(port)
    server.on('error', onError)
    server.on('listening', onListening)
  })
  .catch(error => console.log(error))

function normalizePort(val: string = '3000'): string | number | boolean {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + String(port)

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

function onListening(): void {
  const addr = server.address()
  if (addr) {
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + String(addr.port)
    debug('Listening on ' + bind)
  }
}
