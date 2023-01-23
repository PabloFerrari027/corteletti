import { Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { PrismicDocument } from '@prismicio/types'
import { useSession } from '../../../../contexts/userSessionContext'

interface TotalValueProps {
  total: number
  setTotal: React.Dispatch<React.SetStateAction<number>>
  products: PrismicDocument<Record<string, any>, string, string>[]
}

const TotalValue: React.FC<TotalValueProps> = ({
  products,
  total,
  setTotal
}) => {
  const { session } = useSession()

  useEffect(() => {
    let t = 0

    products?.forEach(product => {
      session?.products?.forEach(item => {
        if (product.id === item.id) {
          if (product.data.promotion) {
            t += product.data.promotion * item.quantity
          } else {
            t += product.data.price * item.quantity
          }
        }
      })
    })

    setTotal(t)
  }, [session?.products, products])

  return (
    <Text as="p" fontSize="1.3em" color="green.500" mt="1em">
      {(total / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })}
    </Text>
  )
}

export default TotalValue
