import { Flex, Divider, Button, Text, Box } from '@chakra-ui/react'
import React, { FormEvent, useEffect, useState } from 'react'

import 'swiper/css'
import 'swiper/css/pagination'

import Products from './Products'
import Address from './Address'
import Note from './Note'
import BuyToo from '../BuyToo'

import { useSession } from '../../../contexts/userSessionContext'

import { useAllPrismicDocumentsByIDs } from '@prismicio/react'
import TotalValue from './TotalValue'
import { api } from '../../../services/api'

import { toast } from 'react-toastify'
import { getStripe } from '../../../services/stripe-js'
import { useSocket } from '../../../hooks/useSocket'

interface BagProps {
  productsIDs: string[]
}

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

interface Item {
  item: {
    id: string
  }
}

const Bag: React.FC<BagProps> = ({ productsIDs }) => {
  const { session, setSession } = useSession()
  const [total, setTotal] = useState(0)
  const [note, setNote] = useState('')
  const [document] = useAllPrismicDocumentsByIDs(productsIDs)
  const [isLoading, setIsLoading] = useState(false)
  const socket = useSocket(session?.email)
  const [idsOfProductsToBuyToo, setIdsOfProductsToBuyToo] = useState<string[]>(
    []
  )

  const handleCreateRequest = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      socket?.emit('getRequestByEmail')

      socket?.on('r', async (requests: Requests) => {
        const currentOrder = requests.data.find(req => {
          return req.data.status === 'paid'
        })

        if (currentOrder) {
          setIsLoading(false)

          return toast.error('Você já possui um pedido em andamento!', {
            position: toast.POSITION.TOP_RIGHT
          })
        }

        const response = await api.post('/stripe', {
          email: session?.email,
          amount: total
        })

        await api.post('/requests/create', {
          stripe_customer_id: response.data.stripeCustomerId,
          email: session?.email,
          products: session?.products,
          total,
          note
        })

        const stripe = await getStripe()

        session && setSession({ ...session, products: [] })

        stripe?.redirectToCheckout({ sessionId: response.data.sessionId })

        setIsLoading(false)
      })
    } catch (error) {
      console.log(error)

      setIsLoading(false)

      toast.error('Conflito interno!', {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  useEffect(() => {
    let ids: string[] = []

    document?.forEach(({ data }) => {
      data.buytoo?.forEach(({ item }: Item) => {
        if (!ids.includes(item.id)) ids.push(item.id)
      })
    })

    setIdsOfProductsToBuyToo(ids)
  }, [document])

  return (
    <Box>
      <Text as="h1" fontSize="1.6em" color="gray.700" fontWeight="medium">
        Sacola
      </Text>

      {document && <Products products={document} />}

      <Divider my="2em" />

      {idsOfProductsToBuyToo.length > 0 && (
        <BuyToo ids={idsOfProductsToBuyToo} />
      )}

      <Box>
        <Address />

        <Note note={note} setNote={setNote} />
      </Box>

      {document && (
        <TotalValue total={total} setTotal={setTotal} products={document} />
      )}

      <Flex gap="1em" mt="2em" flexWrap="wrap">
        <Box onSubmit={handleCreateRequest} as="form">
          <Button colorScheme="green" type="submit" isLoading={isLoading}>
            Finalizar pedido
          </Button>
        </Box>

        <Button
          colorScheme="red"
          onClick={() => session && setSession({ ...session, products: [] })}
        >
          Limpar sacola
        </Button>
      </Flex>
    </Box>
  )
}

export default Bag
