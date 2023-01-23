import { Flex, Box, Text, Image, Icon } from '@chakra-ui/react'
import React from 'react'
import { BsImageFill } from 'react-icons/bs'
import ProductToggleButtons from '../ProductToggleButtons'

interface Product {
  id: string
  slug?: string | null
  title?: string | null
  imagem?: string | null
  description?: string | null
  price?: number | null
  promotion?: number | null
}

interface ProductProps {
  product: Product
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <Flex direction={['column', 'column', 'row']} gap={['2em', '2em', '4em']}>
      <Box w={['100%', '100%', '45%']} bg="yellow.500" h="min-content">
        {product?.imagem ? (
          <Image
            sizes="100%"
            src={product?.imagem}
            alt="pizza"
            transform={['', '', 'translate(5%, 5%)']}
          />
        ) : (
          <Flex borderRadius="lg" w="100%" h="12em" bg="gray.50">
            <Icon as={BsImageFill} m="auto" color="gray.300" fontSize="2em" />
          </Flex>
        )}
      </Box>

      <Box w={['100%', '100%', '65%']}>
        <Text
          as="h1"
          fontSize={['1.5em', '2em']}
          color="gray.700"
          fontWeight="bold"
        >
          {product?.title}
        </Text>

        <Text fontSize="1em" color="gray.700" mt="0.5em">
          {product?.description}
        </Text>

        <Flex gap="1em" flexWrap="wrap" mt="1em">
          {product?.price && (
            <ProductToggleButtons
              id={product.id}
              price={product?.price}
              promotion={product?.promotion}
            />
          )}
        </Flex>
      </Box>
    </Flex>
  )
}

export default Product
