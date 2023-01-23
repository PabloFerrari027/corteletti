import { Flex, Icon, ListItem, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsChatDotsFill, BsChevronRight } from 'react-icons/bs'
import { useSession } from '../../../../contexts/userSessionContext'
import { useSocket } from '../../../../hooks/useSocket'

const ChatItem: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [count, setCount] = useState(0)
  const { session } = useSession()
  const socket = useSocket(session?.email)

  const initializeSocket = async () => {
    try {
      socket?.emit('room', session?.email)

      socket?.on('unreadUser', (c: number) => {
        setCount(c)
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
    <Link href="/user/dashboard/chat">
      <ListItem
        px="2em"
        fontWeight="medium"
        fontSize="1.2em"
        color={isActive ? 'yellow.500' : 'gray.700'}
        py="1em"
        justifyContent="space-between"
        alignItems="center"
        display="flex"
        _hover={{ bg: 'gray.50', color: 'yellow.500' }}
      >
        <Flex alignItems="center">
          <Icon as={BsChatDotsFill} />
          <Text ml="1em">Chat</Text>
        </Flex>

        {count > 0 && (
          <Flex>
            <Flex
              w="1.5em"
              h="1.5em"
              mr="0.5em"
              alignItems="center"
              fontSize="0.7em"
              justifyContent="center"
              bg="red.500"
              rounded="full"
              color="white"
            >
              {count > 9 ? '+9' : count}
            </Flex>
            <Icon as={BsChevronRight} />
          </Flex>
        )}
      </ListItem>
    </Link>
  )
}

export default ChatItem
