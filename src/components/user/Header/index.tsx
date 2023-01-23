import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import Navegation from './Navegation'
import Link from 'next/link'
import SearchBox from './SearchBox'

const Header: React.FC = () => {
  return (
    <Flex
      as="header"
      alignItems="center"
      justifyContent="center"
      p="1em 1em"
      boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
    >
      <Flex w="100%" maxW="1024px" alignItems="center" gap="0.5em">
        <Text
          as="strong"
          fontFamily={`'Alex Brush', cursive`}
          fontSize="2em"
          display="block"
          color="yellow.500"
        >
          <Link href="/">Corteletti</Link>
        </Text>

        <SearchBox />

        <Box as="nav">
          <Navegation />
        </Box>
      </Flex>
    </Flex>
  )
}

export default Header
