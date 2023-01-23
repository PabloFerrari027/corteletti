import { Button, Flex, Select } from '@chakra-ui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { useSession } from '../../../contexts/userSessionContext'
import { useSocket } from '../../../hooks/useSocket'

interface Message {
  message: string
  whereof: 'admin' | 'user'
  id: string
}

const Requests: React.FC = () => {
  const [status, setStatus] = useState('')
  const { session } = useSession()
  const socket = useSocket(session?.email)

  const handleUpdateStatus = (event: FormEvent) => {
    event.preventDefault()

    if (status.trim()) socket?.emit('update', status)
  }

  const initializeSocket = async () => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (socket && session?.email) {
      initializeSocket()
    }
  }, [socket, session?.email])

  return (
    <Flex
      as="main"
      px="1em"
      py="2em"
      maxW="1024px"
      mx="auto"
      w="100%"
      minH="80vh"
      alignItems="center"
      onSubmit={handleUpdateStatus}
      direction="column"
    >
      <Flex as="form" gap="1em" w="100%">
        <Select
          placeholder="Status"
          value={status}
          onChange={v => setStatus(v.target.value)}
        >
          <option value="preparing">Produto sendo preparado</option>
          <option value="enRoute">Saiu para a entrega</option>
          <option value="finished">Finalizado</option>
        </Select>

        <Button colorScheme="green" type="submit">
          Enviar
        </Button>
      </Flex>
    </Flex>
  )
}

export default Requests
