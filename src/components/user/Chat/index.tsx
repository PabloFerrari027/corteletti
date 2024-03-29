import { Box, Flex, Spinner } from '@chakra-ui/react'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useSession } from '../../../contexts/userSessionContext'
import StartAConversation from './StartAConversation'
import BoxMsg from './BoxMsg'
import { useRouter } from 'next/router'
import Footer from './Footer'
import Loading from './Loading'
import { useSocket } from '../../../hooks/useSocket'
import { v4 as uuid } from 'uuid'

interface Message {
  ref: {
    '@ref': {
      id: string
    }
  }
  data: {
    message: string
    whereof: 'user' | 'admin'
    room: string
    timestamp: Date
    visualized: boolean
  }
}

const Chat: React.FC = () => {
  const chatRef = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const { session } = useSession()
  const [isLoading, setLoading] = useState(true)
  const [isLoadingMsg, setLoadingMsg] = useState(false)
  const router = useRouter()
  const socket = useSocket(session?.email)

  socket?.emit('read', 'admin')

  socket?.on('messages', (data: Message[]) => {
    setLoading(false)
    setLoadingMsg(false)
    setMessages(data)
  })

  socket?.on('check', () => {
    if (router.asPath === window.location.href) socket.emit('read', 'admin')
  })

  function handleScrollChat() {
    if (chatRef?.current) {
      if (chatRef.current.scrollHeight > chatRef.current.offsetHeight) {
        chatRef.current.scrollTop =
          chatRef.current.scrollHeight - chatRef.current.offsetHeight
      }
    }
  }

  const handleInputMessage = async (event: FormEvent) => {
    event.preventDefault()

    if (message.trim()) {
      socket?.emit('message', {
        message,
        whereof: 'user',
        room: session?.email
      })

      setMessage('')
      setLoadingMsg(true)

      handleScrollChat()
    }
  }

  useEffect(() => {
    if (socket && session?.email) {
      setLoading(true)
    }
  }, [socket, session?.email])

  useEffect(() => {
    handleScrollChat()
  }, [messages])

  return (
    <Box
      h={'calc(100vh - 10em)'}
      transform={[
        'translate(-2em, -4em)',
        'translate(-2em, -4em)',
        'translateX(-2em)'
      ]}
      w={['calc(100% + 4em)', 'calc(100% + 4em)', 'calc(100% + 2em)']}
      bg="gray.50"
    >
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {messages.length > 0 ? (
            <Flex
              direction="column"
              gap="0.5em"
              overflowY="scroll"
              scrollBehavior="smooth"
              h="100%"
              p="1em"
              ref={chatRef}
            >
              {messages.map(message => (
                <BoxMsg data={message.data} key={message.ref['@ref'].id} />
              ))}

              {isLoadingMsg && (
                <Spinner color="green.600" size="sm" mt="0.5em" />
              )}
            </Flex>
          ) : (
            <StartAConversation />
          )}
        </>
      )}

      <Footer
        message={message}
        handleInputMessage={handleInputMessage}
        setMessage={setMessage}
      />
    </Box>
  )
}

export default Chat
