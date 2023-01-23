import { Box, Flex, Progress, Text } from '@chakra-ui/react'
import React from 'react'

interface StatusProps {
  status: string
}

// paid
// confirmed
// prepared
// on course
// delivered

const Status: React.FC<StatusProps> = ({ status }) => {
  return (
    <Flex w="100%" my="2em">
      <Flex position="relative" w="1rem">
        <Flex
          w="1rem"
          h="1rem"
          rounded="full"
          bg="green"
          transform="translateY(-50%)"
        />

        <Text
          as="span"
          position="absolute"
          top="110%"
          left="50%"
          transform="translate(-50%, -50%)"
          fontSize="0.6em"
          whiteSpace="nowrap"
        >
          Confirmando
        </Text>
      </Flex>

      <Flex position="relative" w="100%">
        <Box w="100%" h="2px">
          {status === 'paid' && (
            <Progress colorScheme="green" w="100%" h="2px" isIndeterminate />
          )}

          {(status === 'confirmed' ||
            status === 'on course' ||
            status === 'delivered') && <Box bg="green" w="100%" h="2px" />}
        </Box>

        <Flex
          w="1rem"
          h="1rem"
          rounded="full"
          bg="green"
          transform="translateY( -50%)"
          ml="auto"
          flexShrink={0}
        />

        <Text
          as="span"
          position="absolute"
          top="110%"
          right="0%"
          transform="translate(35%, -50%)"
          fontSize="0.6em"
          whiteSpace="nowrap"
        >
          Preparando
        </Text>
      </Flex>

      <Flex position="relative" w="100%">
        <Box w="100%" h="2px">
          {status === 'paid' && (
            <Progress colorScheme="green" w="100%" h="2px" isIndeterminate />
          )}

          {(status === 'on course' || status === 'delivered') && (
            <Box bg="green" w="100%" h="2px" />
          )}
        </Box>

        <Flex
          w="1rem"
          h="1rem"
          rounded="full"
          bg="green"
          transform="translateY( -50%)"
          ml="auto"
          flexShrink={0}
        />

        <Text
          as="span"
          position="absolute"
          top="110%"
          right="0%"
          transform="translate(35%, -50%)"
          fontSize="0.6em"
          whiteSpace="nowrap"
        >
          A caminho
        </Text>
      </Flex>

      <Flex position="relative" w="100%">
        <Box w="100%" h="2px">
          {status === 'on course' && (
            <Progress colorScheme="green" w="100%" h="2px" isIndeterminate />
          )}

          {status === 'delivered' && <Box bg="green" w="100%" h="2px" />}

          {(status === 'paid' || status === 'confirmed') && (
            <Box bg="gray.100" w="100%" h="2px" />
          )}
        </Box>

        <Flex
          w="1rem"
          h="1rem"
          rounded="full"
          bg="green"
          transform="translateY( -50%)"
          ml="auto"
          flexShrink={0}
        />

        <Text
          as="span"
          position="absolute"
          top="110%"
          right="0%"
          transform="translate(35%, -50%)"
          fontSize="0.6em"
          whiteSpace="nowrap"
        >
          Entregue
        </Text>
      </Flex>
    </Flex>
  )
}

export default Status
