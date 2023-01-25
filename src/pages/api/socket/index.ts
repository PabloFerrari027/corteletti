import { NextApiRequest } from 'next'
import { Server, Socket } from 'socket.io'
import CreateMessage from '../../../utils/chat/create'
import FindMessagesByRoom from '../../../utils/chat/find'
import Unread from '../../../utils/chat/unread'
import UpdateMessage from '../../../utils/chat/update'
import GetRequest from '../../../utils/requests/get'
import UpdateRequest from '../../../utils/requests/update'

interface Data {
  message: string
  whereof: 'user' | 'admin'
  room: string
  timestamp: Date
}

let room = ''

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server)

    io.on('connection', (socket: Socket) => {
      console.log('Socket.io connection established')

      socket.on('room', async (userRoom: string) => {
        room = userRoom
        socket.join(userRoom)
      })

      socket.on('read', async (whereof: 'user' | 'admin') => {
        await UpdateMessage(room, whereof)

        const res = await FindMessagesByRoom(room)
        socket.to(room).emit('messages', res)

        const unread = await Unread(room, whereof)

        if (whereof === 'admin') socket.to(room).emit('unreadUser', unread)

        if (whereof === 'user') socket.to(room).emit('unreadAdmin', unread)
      })

      // socket.on('unread', async (whereof: 'user' | 'admin') => {
      //   const unread = await Unread(room, whereof)

      //   if (whereof === 'admin') socket.to(room).emit('unreadUser', unread)

      //   if (whereof === 'user') socket.to(room).emit('unreadAdmin', unread)
      // })

      socket.on('messages', async () => {
        const res = await FindMessagesByRoom(room)

        socket.to(room).emit('messages', res)
      })

      socket.on('message', async (message: Data) => {
        await CreateMessage({
          message: message.message,
          whereof: message.whereof,
          timestamp: new Date().toString(),
          room
        })

        await UpdateMessage(
          room,
          message.whereof === 'admin' ? 'user' : 'admin'
        )

        const unread = await Unread(room, message.whereof)

        if (message.whereof === 'admin')
          socket.to(room).emit('unreadUser', unread)

        if (message.whereof === 'user')
          socket.to(room).emit('unreadAdmin', unread)

        const res = await FindMessagesByRoom(room)
        socket.to(room).emit('messages', res)

        socket.to(room).emit('check')
      })

      socket.on('getRequestByEmail', async () => {
        const result = await GetRequest(room)

        socket.emit('r', result)
      })

      socket.on('update', async (status: string) => {
        await UpdateRequest(room, status)
      })
    })

    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler
