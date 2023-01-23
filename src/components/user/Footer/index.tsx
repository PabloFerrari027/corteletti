import { Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const Footer: React.FC = () => {
  return (
    <Flex
      p="2em"
      w="100%"
      bg="green.800"
      textAlign="center"
      color="whiteAlpha.700"
      justify="space-between"
      gap="1em"
    >
      <Text>Todos os direitos reservados © 2022</Text>

      <Link href="/user/dashboard/privacy">
        <Text textDecoration="underline" as="span" _hover={{ color: 'white' }}>
          Privacidade
        </Text>
      </Link>
    </Flex>
  )
}

export default Footer
