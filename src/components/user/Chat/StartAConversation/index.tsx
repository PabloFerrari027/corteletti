import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const StartAConversation: React.FC = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100%"
      fontSize="1.2em"
      fontWeight="bold"
      color="gray.600"
    >
      <Text>Inicie uma conversa!</Text>
    </Flex>
  )
}
export default StartAConversation
