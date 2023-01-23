import { Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

interface NotFoundProps {
  message: string
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  return (
    <Flex
      minH="80vh"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      direction="column"
      py="2em"
    >
      <Text as="strong" fontSize="1.5em" color="gray.700" fontWeight="medium">
        {message}
      </Text>

      <Text as="p" fontSize="1em" color="gray.700" fontWeight="medium" mt="1em">
        Voltar para a{' '}
        <Text as="span" textDecoration="underline">
          <Link href="/">página inicial</Link>
        </Text>
      </Text>
    </Flex>
  )
}

export default NotFound
