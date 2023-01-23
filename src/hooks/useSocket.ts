import { useState, useEffect } from 'react'
import { setupSocket } from '../services/socket'
import * as SocketIOClient from 'socket.io'

export function useSocket(room: string | undefined) {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null)

  useEffect(() => {
    if (room) {
      setupSocket('/socket', room).then(s => {
        setSocket(s)
      })
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [room])

  return socket
}
