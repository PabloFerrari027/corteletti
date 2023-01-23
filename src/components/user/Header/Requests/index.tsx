import { ListItem, Flex, Icon } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { BsJournalText } from 'react-icons/bs'

const Requests: React.FC = () => {
  const [isItOnTheWay, setIsItOnTheWay] = useState(false)

  return (
    <ListItem color="whiteAlpha.800" _hover={{ color: 'yellow.500' }}>
      <Link href="/user/dashboard/requests">
        <Flex
          position="relative"
          alignItems="center"
          justifyContent="center"
          _before={
            isItOnTheWay
              ? {
                  content: "'!'",
                  position: 'absolute',
                  top: '0%',
                  left: '100%',
                  transform: 'translate(-50%, -40%)',
                  fontSize: '.6em',
                  fontWeight: 'bold',
                  color: 'white',
                  bg: 'red',
                  w: '1.5em',
                  h: '1.5em',
                  borderRadius: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex'
                }
              : {}
          }
        >
          <Icon
            as={BsJournalText}
            fontSize={['1.2em', '1.5em']}
            color="yellow.500"
          />
        </Flex>
      </Link>
    </ListItem>
  )
}

export default Requests
