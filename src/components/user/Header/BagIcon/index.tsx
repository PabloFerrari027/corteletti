import { Flex, Icon, ListItem } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaShoppingBag } from 'react-icons/fa'
import { useSession } from '../../../../contexts/userSessionContext'

const BagIcon: React.FC = () => {
  const { session } = useSession()

  const [productsLenght, setProductsLenght] = useState(0)

  useEffect(() => {
    let count = 0

    if (session?.products) {
      session?.products?.forEach(p => {
        count += p.quantity
      })
    }
    setProductsLenght(count)
  }, [session?.products, session])

  return (
    <ListItem color="whiteAlpha.800" _hover={{ color: 'yellow.500' }}>
      <Link href="/user/dashboard/bag">
        <Flex
          alignItems="center"
          justifyContent="center"
          position="relative"
          _before={{
            content: `"${productsLenght > 9 ? '+9' : productsLenght}"`,
            position: 'absolute',
            top: '0%',
            left: '100%',
            transform: 'translate(-50%, -40%)',
            fontSize: '.6em',
            fontWeight: 'bold',
            color: 'white',
            bg: 'red',
            w: '1.6em',
            h: '1.6em',
            borderRadius: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            display: `${productsLenght > 0 ? 'flex' : 'none'}`
          }}
        >
          <Icon
            as={FaShoppingBag}
            fontSize={['1.2em', '1.5em']}
            color="yellow.500"
          />
        </Flex>
      </Link>
    </ListItem>
  )
}

export default BagIcon
