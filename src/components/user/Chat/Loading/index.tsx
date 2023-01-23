import { Flex, Spinner } from '@chakra-ui/react'
import React from 'react'

const Loading: React.FC = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100%"
      fontSize="1.2em"
      fontWeight="bold"
      color="gray.600"
    >
      <Spinner color="green.600" size="xl" />
    </Flex>
  )
}

export default Loading
