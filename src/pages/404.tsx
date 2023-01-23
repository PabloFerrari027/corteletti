import { Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const NotFound: React.FC = () => {
  return (
    <Flex justifyContent="center" alignItems="center" minH="100vh" p="2em">
      <Text
        fontSize="1.5em"
        alignItems="center"
        color="gray.700"
        fontWeight="medium"
        textAlign="center"
      >
        <Text as="strong" fontSize="2em" fontWeight="bold">
          404
        </Text>
        <br />
        Página não encontrada,
        <br />
        <Link href="/">
          <Text as="span" textDecoration="underline">
            volte para home
          </Text>
        </Link>
      </Text>
    </Flex>
  )
}

export default NotFound
