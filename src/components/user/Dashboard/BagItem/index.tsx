import { Flex, Icon, ListItem, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BsChevronRight } from 'react-icons/bs'
import { FaShoppingBag } from 'react-icons/fa'
import { useSession } from '../../../../contexts/userSessionContext'

const BagItem: React.FC = () => {
  const { session } = useSession()

  const [productsLenght, setProductsLenght] = useState(0)

  const router = useRouter()

  useEffect(() => {
    if (session?.products) {
      let count = 0
      session?.products?.forEach(p => {
        count += p.quantity
      })

      setProductsLenght(count)
    }
  }, [session?.products])

  return (
    <Link href="/user/dashboard/bag">
      <ListItem
        px="2em"
        fontWeight="medium"
        fontSize="1.2em"
        color={router.query.router === 'bag' ? 'yellow.500' : 'gray.700'}
        py="1em"
        justifyContent="space-between"
        alignItems="center"
        display="flex"
        _hover={{ bg: 'gray.50', color: 'yellow.600' }}
      >
        <Flex alignItems="center">
          <Icon as={FaShoppingBag} />
          <Text ml="1em">Sacola</Text>
        </Flex>

        {productsLenght > 0 && (
          <Flex>
            <Flex
              w="1.5em"
              h="1.5em"
              mr="0.5em"
              alignItems="center"
              fontSize="0.7em"
              justifyContent="center"
              bg="red.500"
              rounded="full"
              color="white"
            >
              {productsLenght > 9 ? '+9' : productsLenght}
            </Flex>
            <Icon as={BsChevronRight} />
          </Flex>
        )}
      </ListItem>
    </Link>
  )
}

export default BagItem
