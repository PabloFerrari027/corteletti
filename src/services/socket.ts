import { io } from 'socket.io-client'
import * as SocketIOClient from 'socket.io'
import { api } from './api'

export async function setupSocket(url: string, room: string) {
  await api.get(url)

  const socket: SocketIOClient.Socket | any = io()

  await socket.emit('room', room)

  return socket
}
