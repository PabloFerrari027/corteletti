import { Box, Flex, Icon, Spinner, Text } from '@chakra-ui/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { RiCheckboxCircleFill, RiCloseCircleFill } from 'react-icons/ri'
import { useSession } from '../../../../contexts/userSessionContext'
import { api } from '../../../../services/api'

interface UserData {
  user: {
    name: string
    email: string
    photoUrl: string
    timestamp: Date
  }
}

const Verification = () => {
  const { query } = useRouter()
  const { setSession } = useSession()
  const [status, setStatus] = useState<
    'loading' | 'tokenError' | 'error' | 'success'
  >('loading')
  const router = useRouter()

  const verifyTokenByEmail = async (email: string, token: string) => {
    try {
      const response = await api.get<UserData>(`/users/token/${email}/${token}`)

      setStatus('success')

      setSession(response.data.user)

      setTimeout(() => router.push('/'), 2000)

      return
    } catch (error: any) {
      console.log(error)

      if (error.response.status === 401 || error.response.status === 404) {
        setStatus('tokenError')

        setTimeout(() => router.push('/user/account/create'), 2000)

        return
      }

      setStatus('error')

      setTimeout(() => router.push('/user/account/create'), 2000)

      return
    }
  }

  useEffect(() => {
    if (query.data) {
      const token = query.data[0]
      const email = query.data[1]

      verifyTokenByEmail(email, token)
    }
  }, [query.data])

  return (
    <>
      <Head>
        <title>Corteletti | verificação de conta</title>
      </Head>

      <Flex justify="center" alignItems="center" w="100%" minH="100vh" px="6">
        <Flex
          w="100%"
          maxW="30em"
          mx="auto"
          p={['6', '8']}
          boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;"
          direction="column"
          textAlign="center"
          justifyContent="center"
          alignItems="center"
        >
          <Text as="h1" fontSize="1.5em" fontWeight="bold" color="gray.700">
            {status === 'loading' && 'Verificando token'}
            {status === 'error' && 'Erro interno'}
            {status === 'tokenError' && 'Token inválido'}
            {status === 'success' && 'Token verificado com sucesso'}
          </Text>

          <Box mt="1.5em">
            {status === 'loading' && <Spinner size="lg" color="yellow.500" />}

            {(status === 'error' || status === 'tokenError') && (
              <Icon as={RiCloseCircleFill} color="red.500" fontSize="3em" />
            )}

            {status === 'success' && (
              <Icon
                as={RiCheckboxCircleFill}
                color="green.800"
                fontSize="3em"
              />
            )}
          </Box>
        </Flex>
      </Flex>
    </>
  )
}

export default Verification
