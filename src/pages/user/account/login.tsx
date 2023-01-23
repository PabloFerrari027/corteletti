import Head from 'next/head'
import Link from 'next/link'

import { Box, Button, Divider, Flex, Icon, Text } from '@chakra-ui/react'

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { toast } from 'react-toastify'

import { Input } from '../../../components/user/Input'
import { api } from '../../../services/api'
import { useSession } from '../../../contexts/userSessionContext'
import { useRouter } from 'next/router'
import { auth, provider } from '../../../services/firebase'
import { signInWithPopup } from 'firebase/auth'
import { BsGoogle } from 'react-icons/bs'
import { useAuthState } from 'react-firebase-hooks/auth'

const LoginFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório!').email('E-mail inválido'),
  name: yup.string().required('Nome obrigatório!'),
  password: yup.string().required('Senha obrigatória!')
})

interface User {
  name: string
  email: string
  password: string
}

export default function Login() {
  const { register, formState, handleSubmit } = useForm({
    resolver: yupResolver(LoginFormSchema)
  })

  const router = useRouter()

  const { setSession, session } = useSession()

  const [user] = useAuthState(auth)

  const showToastMessage = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      })
    } else {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  async function signIn({ email, password, name }: User) {
    try {
      const userExists = await api.get(`/users/findUser/${email}`)
      if (!userExists.data.user) {
        showToastMessage('error', 'Usuário não cadastrado')

        setTimeout(() => {
          router.push('/user/account/create')
        }, 5000)

        return
      }

      if (!userExists.data.user.status) {
        setTimeout(() => {
          router.push(`/user/account/verification/${email}`)
        }, 5000)

        showToastMessage(
          'error',
          'Sua conta não foi validada, verifique seu e-mail e acesse o link de verificação que enviamos a você!'
        )

        return
      }

      await api.post('/users/login', { email, password, name })

      setSession({
        ...userExists.data.user,
        email,
        name,
        photoUrl: name
      })

      showToastMessage('success', 'Login realizado com sucesso!')

      setTimeout(() => {
        router.push('/')
      }, 5000)
    } catch (error: any) {
      if (error.response.status === 401)
        return showToastMessage('error', 'Senha incorreta!')

      if (error.response.status === 404)
        return showToastMessage('error', 'E-mail incorreto!')

      if (error.response.status === 406) return handleFirebaseAuth()

      if (error.response.status === 500)
        return showToastMessage(
          'error',
          'Conflito interno, tente novamente mais tarde!'
        )

      console.log(error)
    }
  }

  const handleSignIn: SubmitHandler<FieldValues> = async values => {
    await signIn({
      name: values.name,
      email: values.email,
      password: values.password
    })
  }

  function handleFirebaseAuth() {
    signInWithPopup(auth, provider)
      .then(async () => {
        const email = user?.email
        const photoUrl = user?.photoURL
        const name = user?.displayName

        const UserExists = await api.get(`/users/findUser/${email}`)

        if (!UserExists.data.user) {
          showToastMessage('error', 'Usuário não cadastrado')

          setTimeout(() => {
            router.push('/user/account/create')
          }, 5000)

          return
        }

        if (!UserExists.data.user.status) {
          showToastMessage(
            'error',
            'Sua conta não foi validada, verifique seu e-mail e acesse o link de verificação que enviamos a você!'
          )

          setTimeout(() => {
            router.push(`/user/account/verification/${email}`)
          }, 5000)

          return
        }

        setSession({
          ...UserExists.data.user,
          email,
          name,
          photoUrl,
          timestamp: new Date()
        })

        showToastMessage('success', 'Login realizado com sucesso!')

        router.push('/')
      })
      .catch(error => {
        console.log(error)

        showToastMessage(
          'error',
          'Conflito interno, tente novamente mais tarde!'
        )
      })

    useAuthState
  }

  return (
    <>
      <Head>
        <title>Corteletti | Login</title>
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
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Text as="h1" fontSize="1.5em" fontWeight="bold" color="gray.700">
            Login
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
            <Link href="/user/account/create">Criar conta</Link>
          </Box>

          <Button
            type="submit"
            mt="1em"
            variant="solid"
            bg="green.900"
            color="white"
            fontWeight="medium"
            w="100%"
            colorScheme="green"
            isLoading={formState.isSubmitting}
          >
            Login
          </Button>

          <Divider my="1em" />

          <Button
            type="button"
            variant="solid"
            colorScheme="red"
            color="white"
            fontWeight="medium"
            w="100%"
            isLoading={formState.isSubmitting}
            onClick={() => handleFirebaseAuth()}
          >
            <Icon as={BsGoogle} mr="0.5em" />
            Login com o Google
          </Button>
        </Flex>
      </Flex>
    </>
  )
}
