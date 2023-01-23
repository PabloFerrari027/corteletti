import { Box, Divider, Flex, Spinner, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSession } from '../../../contexts/userSessionContext'
import { useSocket } from '../../../hooks/useSocket'
import NotFound from '../NotFound'
import CurrentOrder from './CurrentOrder'
import Historic from './Historic'
import Status from './Status'

interface Data {
  ref: string
  data: {
    products: {
      id: string
      quantity: number
    }[]
    total: number
    note: string
    status: string
  }
}

interface Requests {
  data: Data[]
}

const Requests: React.FC = () => {
  const { session } = useSession()
  const socket = useSocket(session?.email)
  const [currentRequest, setCurrentRequest] = useState<Data | null>(null)
  const [previousOrderIDs, setPreviousOrderIDs] = useState<string[]>([])
  const [currentOrderIDs, setCurrentOrderIDs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  function handleRequests(requests: Requests) {
    if (requests.data.length === 0) return setIsLoading(false)

    const currentOrder = requests.data.find(req => {
      return req.data.status !== 'delivered' && req.data.status !== 'not pay'
    })

    if (!currentOrder) {
      let ids: string[] = []

      requests.data.forEach(item => {
        item.data.products.forEach(product => {
          if (!ids.includes(product.id)) {
            ids.push(product.id)
          }
        })
      })

      setPreviousOrderIDs(ids)

      setIsLoading(false)

      return
    }

    setCurrentRequest(currentOrder)

    const newRequests = requests.data.filter(req => req !== currentOrder)

    let previousOrderIDs: string[] = []

    newRequests.forEach(item => {
      item.data.products.forEach(product => {
        if (!previousOrderIDs.includes(product.id)) {
          previousOrderIDs.push(product.id)
        }
      })
    })

    setPreviousOrderIDs(previousOrderIDs)

    let currentOrderIDs: string[] = []

    currentOrder.data.products.forEach(product => {
      if (!currentOrderIDs.includes(product.id)) {
        currentOrderIDs.push(product.id)
      }
    })

    setCurrentOrderIDs(currentOrderIDs)

    setIsLoading(false)
  }

  const initializeSocket = async () => {
    try {
      socket?.emit('getRequestByEmail')

      socket?.on('r', (requests: Requests) => {
        handleRequests(requests)
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (socket) {
      initializeSocket()
    }
  }, [socket])

  if (isLoading) {
    return (
      <Flex w="100%" h="50vh">
        <Spinner size="lg" color="green.600" m="auto" />
      </Flex>
    )
  }

  if (!isLoading && !currentRequest && previousOrderIDs.length === 0) {
    return <NotFound message="Nenhum pedido em andamento!" />
  }

  return (
    <Box>
      {currentRequest && (
        <>
          <Text as="h1" fontSize="1.6em" color="gray.700" fontWeight="medium">
            Pedido atual
          </Text>

          {/* paid 
           confirmed 
           prepared  
           on course  
           delivered */}
          <Status status={currentRequest.data.status} />

          <CurrentOrder current={currentRequest} IDs={currentOrderIDs} />

          <Divider my="3em" />
        </>
      )}

      <Historic IDs={previousOrderIDs} />
    </Box>
  )
}

export default Requests
