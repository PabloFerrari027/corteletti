import { Button, Flex, Text } from '@chakra-ui/react'

import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { api } from '../../../../services/api'
import { toast } from 'react-toastify'

const Verification: React.FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCreateNewToken = async () => {
    setLoading(true)
    try {
      api.post('/users/sendGrid', { email: router.query.email })

      toast.success(
        `E-mail de verificação de cadastro reenviado para ${router.query.email}`,
        {
          position: toast.POSITION.TOP_RIGHT
        }
      )
    } catch (error) {
      console.log(error)

      toast.success(`Conflito interno!`, {
        position: toast.POSITION.TOP_RIGHT
      })
    }

    setLoading(false)
  }

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
        >
          <Text as="h1" fontSize="1.5em" fontWeight="bold" color="gray.700">
            Verificação de conta
          </Text>

          <Text as="p" mt="1em">
            Enviamos a você um e-mail contendo um link de verificação para
            termos certeza que este e-mail realmente é seu.
          </Text>

          <Button
            mt="1em"
            w="fit-content"
            colorScheme={'green'}
            onClick={handleCreateNewToken}
            isLoading={loading}
          >
            Reenviar e-mail
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default Verification
