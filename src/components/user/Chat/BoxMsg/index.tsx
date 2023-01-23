import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import React from 'react'
import { BsCheckAll } from 'react-icons/bs'

interface Message {
  data: {
    message: string
    whereof: 'user' | 'admin'
    room: string
    timestamp: Date
    visualized: boolean
  }
}

const BoxMsg: React.FC<Message> = ({ data }) => {
  return (
    <Box
      shadow="base"
      maxW="70%"
      w="fit-content"
      ml={data.whereof === 'admin' ? 'auto' : '0'}
      bg={data.whereof === 'admin' ? 'white' : 'green.200'}
      borderRadius="md"
      borderTopLeftRadius={data.whereof === 'admin' ? 'md' : '0'}
      borderTopRightRadius={data.whereof === 'admin' ? '0' : 'md'}
      p="1em"
    >
      <Text as="p">{data.message}</Text>

      <Flex
        justifyContent="flex-end"
        alignItems="center"
        gap="1em"
        mt="0.5em"
        fontSize="0.7em"
      >
        <Text as="time">
          {new Date(data.timestamp).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: '2-digit',
            year: 'numeric'
          })}
        </Text>

        <Text as="time">
          {new Date(data.timestamp).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>

        {data.visualized ? (
          <Icon color={'blue.400'} fontSize="1.5em" as={BsCheckAll} />
        ) : (
          <Icon color={'gray.400'} fontSize="1.5em" as={BsCheckAll} />
        )}
      </Flex>
    </Box>
  )
}

export default BoxMsg
