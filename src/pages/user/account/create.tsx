import Head from 'next/head'
import Link from 'next/link'

import { Box, Button, Divider, Flex, Icon, Text } from '@chakra-ui/react'

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { toast } from 'react-toastify'

import { Input } from '../../../components/user/Input'
import { useRouter } from 'next/router'
import { api } from '../../../services/api'
import { useSession } from '../../../contexts/userSessionContext'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../../services/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BsGoogle } from 'react-icons/bs'
import { useEffect } from 'react'

const CreateUserFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório!').email('E-mail inválido'),
  name: yup.string().required('Nome obrigatório!'),
  password: yup.string().required('Senha obrigatória!')
})

interface Values {
  name: string
  email: string
  password: string
}

interface UserDoesNotExist {
  email: string
  name: string
  photoUrl: string
  password?: string
  withGoogle?: boolean
}

interface UserIsCreatedAndAuthenticated {
  email: string
  name: string
  photoUrl: string
}

interface UserIsCreatedButNotAuthenticated {
  email: string
  name: string
  photoUrl: string
  withGoogle?: boolean
}

export default function CreateUser() {
  const router = useRouter()
  const { setSession, session } = useSession()
  const [user, loading] = useAuthState(auth)

  const { register, formState, handleSubmit } = useForm({
    resolver: yupResolver(CreateUserFormSchema)
  })

  const showToastMessage = (
    type: 'success' | 'error' | 'warning',
    message: string
  ) => {
    if (type === 'success') {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      })
    }

    if (type === 'warning') {
      toast.warning(message, {
        position: toast.POSITION.TOP_RIGHT
      })
    }

    if (type === 'error') {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  async function userDoesNotExist({
    email,
    name,
    password,
    withGoogle,
    photoUrl
  }: UserDoesNotExist) {
    if (withGoogle) {
      await api.post('/users/create', {
        name,
        email,
        withGoogle: true
      })

      setSession({
        email,
        name,
        photoUrl
      })

      showToastMessage('success', 'Criação de usuário realizada com sucesso!')

      setTimeout(() => {
        router.push('/')
      }, 5000)
    } else {
      await api.post('/users/create', {
        name,
        email,
        password,
        withGoogle: false
      })

      setSession(null)

      showToastMessage('warning', 'Valiadando usuário!')

      setTimeout(() => {
        router.push(`/user/account/verification/${email}`)
      }, 5000)
    }
  }

  const handleCreate: SubmitHandler<FieldValues> = async (
    values: FieldValues
  ) => {
    const { name, email, password } = values

    try {
      const userExists = await api.get(`/users/findUser/${email}`)

      if (userExists.data.user) {
        showToastMessage('error', 'Usuário já existe no banco de dados!')

        setTimeout(() => {
          router.push('/user/account/login')
        }, 5000)

        return
      }

      userDoesNotExist({ email, name, password, photoUrl: name })
    } catch (error) {
      showToastMessage('error', 'Erro interno ao realizar login')
    }
  }

  function handleFirebaseAuth() {
    signInWithPopup(auth, provider)
      .then(async () => {
        const email = user?.email
        const photoUrl = user?.photoURL
        const name = user?.displayName

        try {
          const userExists = await api.get(`/users/findUser/${email}`)

          if (userExists.data.user) {
            showToastMessage('error', 'Usuário já existe no banco de dados!')

            setTimeout(() => {
              router.push('/user/account/login')
            }, 5000)

            return
          }

          if (email && name && photoUrl)
            userDoesNotExist({ email, name, photoUrl, withGoogle: true })
        } catch (error) {
          showToastMessage('error', 'Erro interno ao realizar login')
        }
      })
      .catch(error => {
        console.log(error)

        showToastMessage(
          'error',
          'Conflito interno, tente novamente mais tarde!'
        )
      })
  }

  return (
    <>
      <Head>
        <title>Corteletti | Criar conta</title>
      </Head>

      <Flex justify="center" alignItems="center" w="100%" minH="100vh" px="6">
        <Flex
          as="form"
          w="100%"
          maxW="30em"
          mx="auto"
          p={['6', '8']}
          boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;"
          direction="column"
          onSubmit={handleSubmit(handleCreate)}
        >
          <Text as="h1" fontSize="1.5em" fontWeight="bold" color="gray.700">
            Criar conta
          </Text>

          <Input
            label="Nome"
            placeholder="Ex: Corteletti"
            error={formState.errors.name}
            {...register('name')}
          />

          <Input
            label="E-mail"
            type="email"
            placeholder="Ex: corteletti@gmail.com"
            error={formState.errors.email}
            {...register('email')}
          />

          <Input
            label="Senha"
            isPassword={true}
            placeholder="********"
            error={formState.errors.password}
            {...register('password')}
          />

          <Box
            w="fit-content"
            mt="1.5em"
            color="blue.500"
            textDecoration="underline"
            fontSize=".9em"
            _hover={{ filter: 'brightness(0.9)' }}
          >
            <Link href="/user/account/login">Login</Link>
          </Box>

          <Button
            type="submit"
            variant="solid"
            colorScheme="green"
            color="white"
            fontWeight="medium"
            w="100%"
            mt="1em"
            isLoading={formState.isSubmitting}
          >
            Criar conta
          </Button>

          <Divider my="1em" />

          <Button
            type="button"
            variant="solid"
            colorScheme="red"
            color="white"
            fontWeight="medium"
            w="100%"
            isLoading={loading}
            onClick={() => handleFirebaseAuth()}
          >
            <Icon as={BsGoogle} mr="0.5em" />
            continuar com o Google
          </Button>
        </Flex>
      </Flex>
    </>
  )
}
