import { Button, Flex, Input } from '@chakra-ui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { useSession } from '../../../contexts/userSessionContext'
import { useSocket } from '../../../hooks/useSocket'

interface Message {
  message: string
  whereof: 'admin' | 'user'
  id: string
}

const chat: React.FC = () => {
  const [message, setMessage] = useState('')
  const socket = useSocket('pabloferraricaliari@gmail.com')

  const { session } = useSession()

  const handleInputMessage = (event: FormEvent) => {
    event.preventDefault()

    if (message.trim()) {
      socket?.emit('message', { message, whereof: 'admin' })

      setMessage('')
    }
  }

  const initializeSocket = async () => {
    try {
      socket?.emit('read', 'user')

      socket?.on('messages', (data: Message[]) => {})

      socket?.on('check', () => {
        socket?.emit('read', 'user')
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (socket && session?.email) {
      initializeSocket()
    }
  }, [socket, session?.email])

  return (
    <Flex
      as="main"
      px="1em"
      py="2em"
      maxW="1024px"
      mx="auto"
      w="100%"
      minH="80vh"
      alignItems="center"
      onSubmit={handleInputMessage}
      direction="column"
    >
      <Flex as="form" gap="1em" w="100%">
        <Input
          w="100%"
          value={message}
          onChange={v => setMessage(v.target.value)}
        />
        <Button colorScheme="green" type="submit">
          Enviar
        </Button>
      </Flex>
    </Flex>
  )
}

export default chat
