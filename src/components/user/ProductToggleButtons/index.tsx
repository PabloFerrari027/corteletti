import { Button, Flex, Icon, IconButton, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { useSession } from '../../../contexts/userSessionContext'

import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

interface Product {
  id: string
  quantity: number
}

interface ProductToggleButtons {
  showCleanButton?: boolean
  id: string
  price: number
  promotion?: number | null
}

const ProductToggleButtons: React.FC<ProductToggleButtons> = ({
  showCleanButton = false,
  id,
  price,
  promotion
}) => {
  const { session, setSession } = useSession()
  const [product, setProduct] = useState<Product | null>()
  const [count, setCount] = useState(1)
  const router = useRouter()

  function handleRemoveProduct() {
    if (!product) return
    const products = session?.products
    const productIndex = products?.indexOf(product)

    productIndex && products?.splice(productIndex, 1)

    session &&
      setSession({
        ...session,
        products
      })

    toast.success('Produto removido da sacola!', {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  function handleEditProduct(quantity: number) {
    setCount(quantity)

    if (showCleanButton) {
      const products = session?.products?.map(p => {
        if (p.id === id) {
          return { id, quantity }
        }

        return p
      })

      session &&
        setSession({
          ...session,
          products
        })

      toast.success('Produto atualizado!', {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  function handleAddProduct() {
    if (!session) {
      toast.warning('Faça login para poder comprar conosco!', {
        position: toast.POSITION.TOP_RIGHT
      })

      router.push('/user/account/login')
      return
    }

    if (!price || price === 0) return

    if (product) {
      const products = session?.products?.map(p => {
        if (p.id === id) {
          return { id, quantity: count }
        }

        return p
      })

      setSession({
        ...session,
        products: products
      })
    } else {
      if (session?.products?.length === 0 || !session?.products) {
        setSession({
          ...session,
          products: [{ id, quantity: count }]
        })
      } else {
        setSession({
          ...session,
          products: [...session.products, { id, quantity: count }]
        })
      }
    }

    toast.success('Produto adicionado a sacola!', {
      position: toast.POSITION.TOP_RIGHT
    })
  }

  useEffect(() => {
    const getProductByID = session?.products?.find(product => product.id === id)

    if (getProductByID) {
      setProduct(getProductByID)
      setCount(getProductByID.quantity)
    }
  }, [session?.products])

  return (
    <Flex gap="0.5em" flexWrap="wrap">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        gap="0.5em"
        bg="gray.100"
        borderRadius="xl"
        color="gray.700"
      >
        {showCleanButton && count === 1 ? (
          <IconButton
            aria-label="clean"
            colorScheme="red"
            icon={<Icon as={BsTrash} />}
            onClick={() => {
              handleRemoveProduct()
            }}
          />
        ) : (
          <Button
            onClick={() => {
              count - 1 >= 1 && setCount(c => c - 1)
              showCleanButton && handleEditProduct(count - 1)
            }}
          >
            -
          </Button>
        )}

        <Text>{count}</Text>

        <Button
          onClick={() => {
            handleEditProduct(count + 1)
          }}
        >
          +
        </Button>
      </Flex>

      {!showCleanButton && (
        <Button
          variant="solid"
          bg="green.800"
          color="white"
          fontSize={['.7em', '1em']}
          _hover={{ bg: 'green.700' }}
          onClick={() => handleAddProduct()}
        >
          {product ? 'Atualizar' : 'Adicionar'}

          {promotion ? (
            <>
              <Text as="span" ml="1em">
                {((promotion * count) / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </Text>

              <Text as="del" ml="1em" fontSize=".8em">
                {((price * count) / 100).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </Text>
            </>
          ) : (
            <Text as="span" ml="1em">
              {((price * count) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </Text>
          )}
        </Button>
      )}
    </Flex>
  )
}

export default ProductToggleButtons
