import {
  Avatar,
  HStack,
  ListItem,
  UnorderedList,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSession } from '../../../../contexts/userSessionContext'
import BagIcon from '../BagIcon'
import Requests from '../Requests'

const Navegation: React.FC = () => {
  const { session } = useSession()
  const [url, setUrl] = useState('')

  useEffect(() => {
    session && setUrl(session.photoUrl)
  }, [session?.photoUrl])

  return (
    <UnorderedList listStyleType="none">
      <HStack spacing={['0.5em', '1em', '1.5em']}>
        {session ? (
          <>
            <Requests />

            <BagIcon />

            <ListItem>
              <Wrap>
                <WrapItem border="2px solid white" borderRadius="100%">
                  <Link href="/user/dashboard/profile">
                    <Avatar size="sm" src={url} name={session.name} />
                  </Link>
                </WrapItem>
              </Wrap>
            </ListItem>
          </>
        ) : (
          <ListItem color="yellow.500" _hover={{ color: 'yellow.700' }}>
            <Link href="/user/account/login">Login</Link>
          </ListItem>
        )}
      </HStack>
    </UnorderedList>
  )
}

export default Navegation
