import { Flex, Icon, ListItem, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsChevronRight, BsJournalText } from 'react-icons/bs'

interface RequestsInterface {
  isActive: boolean
}

const Requests: React.FC<RequestsInterface> = ({ isActive }) => {
  const [isItOnTheWay, setIsItOnTheWay] = useState(false)

  return (
    <Link href="/user/dashboard/requests">
      <ListItem
        px="2em"
        fontWeight="medium"
        fontSize="1.2em"
        color={isActive ? 'yellow.500' : 'gray.700'}
        py="1em"
        justifyContent="space-between"
        alignItems="center"
        display="flex"
        _hover={{ bg: 'gray.50', color: 'yellow.600' }}
      >
        <Flex alignItems="center">
          <Icon as={BsJournalText} />
          <Text ml="1em">Pedidos</Text>
        </Flex>

        {isItOnTheWay && (
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
              !
            </Flex>
            <Icon as={BsChevronRight} />
          </Flex>
        )}
      </ListItem>
    </Link>
  )
}

export default Requests
