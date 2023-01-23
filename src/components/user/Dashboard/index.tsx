import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  List,
  ListItem,
  Text,
  theme
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import {
  BsChatDotsFill,
  BsChevronRight,
  BsFillPersonFill,
  BsFillShieldFill,
  BsJournalText
} from 'react-icons/bs'
import { useSession } from '../../../contexts/userSessionContext'
import BagItem from './BagItem'
import ChatItem from './ChatItem'
import Requests from './Requests'

interface DashboardProps {
  children: ReactNode
}

const Dashboard: React.FC<DashboardProps> = ({ children }) => {
  const router = useRouter()
  const { session, setSession } = useSession()

  return (
    <Flex
      as="main"
      direction={['column-reverse', 'column-reverse', 'row']}
      maxW="1024px"
      mx="auto"
    >
      <Flex
        w={['100%', '100%', '40%']}
        justifyContent="flex-start"
        py="3em"
        px="1em"
        direction="column"
      >
        {session && (
          <>
            <Flex
              px="2em"
              py="0.5em"
              alignItems="center"
              h="min-content"
              gap="1em"
            >
              <Avatar name={session.name} size="md" />

              <Box overflow="hidden">
                <Text
                  color="gray.400"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {session.email}
                </Text>

                <Button
                  mt="-0.5em"
                  variant="unstyled"
                  color="gray.700"
                  fontWeight="medium"
                  _hover={{ color: 'red.500' }}
                  onClick={() => setSession(null)}
                >
                  Sair
                </Button>
              </Box>
            </Flex>

            <Divider />
          </>
        )}

        <List w="100%">
          <Link href="/user/dashboard/profile">
            <ListItem
              px="2em"
              fontWeight="medium"
              fontSize="1.2em"
              color={
                router.query.router === 'profile' ? 'yellow.500' : 'gray.700'
              }
              py="1em"
              justifyContent="space-between"
              alignItems="center"
              display="flex"
              _hover={{ bg: 'gray.50', color: 'yellow.600' }}
            >
              <Flex alignItems="center">
                <Icon as={BsFillPersonFill} />
                <Text ml="1em">Conta</Text>
              </Flex>

              <Flex>
                <Icon as={BsChevronRight} />
              </Flex>
            </ListItem>
          </Link>

          {session && (
            <>
              <Divider />

              <ChatItem isActive={router.query.router === 'chat'} />

              <Divider />

              <BagItem />

              <Divider />

              <Requests
                isActive={router.query.router === 'requests' ? true : false}
              />
            </>
          )}

          <Divider />

          <Link href="/user/dashboard/privacy">
            <ListItem
              px="2em"
              fontWeight="medium"
              fontSize="1.2em"
              color={
                router.query.router === 'privacy' ? 'yellow.500' : 'gray.700'
              }
              py="1em"
              justifyContent="space-between"
              alignItems="center"
              display="flex"
              _hover={{ bg: 'gray.50', color: 'yellow.600' }}
            >
              <Flex alignItems="center">
                <Icon as={BsFillShieldFill} />
                <Text ml="1em">Privacidade</Text>
              </Flex>

              <Flex>
                <Icon as={BsChevronRight} />
              </Flex>
            </ListItem>
          </Link>

          <Divider />
        </List>
      </Flex>

      <Box
        p="2em"
        minH="100vh"
        w={['100%', '100%', '60%']}
        my="2em"
        borderLeft={`1px solid ${theme.colors.gray[200]}`}
      >
        {children}
      </Box>
    </Flex>
  )
}

export default Dashboard
