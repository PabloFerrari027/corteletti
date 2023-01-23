import { Box, Button, Divider, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { useSession } from '../../../contexts/userSessionContext'
import Address from '../Address'

const Profile: React.FC = () => {
  const { session, setSession } = useSession()

  return (
    <Box h="100vh" w="100%">
      <Box>
        <Text as="h2" fontSize="1.6em" color="gray.700" fontWeight="medium">
          Conta
        </Text>

        {session ? (
          <>
            <Text as="p" fontSize="1em" color="gray.700" mt="1em">
              {session.name}
            </Text>

            <Text as="p" fontSize="1em" color="gray.700">
              {session.email}
            </Text>

            <Button color="gray.700" mt="1em" onClick={() => setSession(null)}>
              Sair
            </Button>
          </>
        ) : (
          <Link href="/user/account/login">
            <Button color="gray.700" mt="1em">
              Fazer login
            </Button>
          </Link>
        )}
      </Box>

      {session?.address ? (
        <>
          <Divider my="3em" />

          <Box>
            <Text as="h2" fontSize="1.6em" color="gray.700" fontWeight="medium">
              Endereço
            </Text>

            <Text as="p" fontSize="1em" color="gray.700">
              {session.address}
            </Text>
          </Box>

          <Box>
            <Text
              as="h3"
              fontSize="1.2em"
              color="gray.700"
              mt="1em"
              fontWeight="medium"
            >
              Número
            </Text>

            <Text as="p" fontSize="1em" color="gray.700">
              {session.number}
            </Text>
          </Box>

          <Address />
        </>
      ) : (
        <>
          {session && (
            <>
              <Divider my="3em" />

              <Text
                as="h2"
                fontSize="1.6em"
                color="gray.700"
                fontWeight="medium"
              >
                Endereço
              </Text>

              <Address />
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default Profile
