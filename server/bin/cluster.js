#!/usr/bin/env node

import 'regenerator-runtime/runtime'
import app from '../app'
import http from 'http'
import debugLib from 'debug'
const debug = debugLib('expresstuned:server')

import dotenv from 'dotenv'
dotenv.config()

import cluster from 'cluster'
import os from 'os'

// Cluster config

if (cluster.isPrimary) {
  console.log('Arrancado master')

  const numCores = os.cpus()

  for (const core of numCores) {
    //Arrancar workers
    cluster.fork()
  }

  // Se conecta un worker
  cluster.on('listening', (worker, address) => {
    console.log(
      `Worker ${worker.id}: ${worker.process.pid} conectado a ${address.port}`
    )
  })

  // Se desconecta un worker
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id}: ${worker.process.pid} desconectado. 
    Code: ${code} || Signal: ${signal}`)
    console.log('Arranco nuevo worker')
    cluster.fork()
  })

  console.log(cluster.workers)
} else {
  //Cada worker arrancará un server

  const port = normalizePort(process.env.PORT || '3000')
  app.set('port', port)

  // console.log(`Server running on http://localhost:${port}`)

  const server = http.createServer(app)

  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)

  function normalizePort(val) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
      // named pipe
      return val
    }

    if (port >= 0) {
      // port number
      return port
    }

    return false
  }

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges')
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(bind + ' is already in use')
        process.exit(1)
        break
      default:
        throw error
    }
  }

  function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    debug('Listening on ' + bind)
  }
}

// TODO mejorar que solo los workers arranquen la app
