import React from 'react'

import {
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import Card from '../Card'
import Head from 'next/head'
import NotFound from '../NotFound'

interface Category {
  id: string
  slug?: string | null
  title?: string | null
  imagem?: string | null
  description?: string | null
  price?: number | null
}

interface CategoryProps {
  products: Category[]
  category: string
}

const Category: React.FC<CategoryProps> = ({ products, category }) => {
  const variant = useBreakpointValue({
    base: 1,
    md: 2,
    lg: 3
  })

  const title = `${category} | Corteletti`

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Flex
        as="main"
        w="100%"
        maxW="1024px"
        mx="auto"
        direction="column"
        mb="3em"
        px="1em"
      >
        {products.length > 0 ? (
          <>
            <Heading fontWeight="bold" fontSize="2em" color="gray.700" mt="2em">
              Cardápios de{' '}
              <Text as="span" textTransform="capitalize">
                {category}
              </Text>
            </Heading>

            <SimpleGrid w="100%" gap="2em" mt="2em" columns={variant}>
              {products.map(product => (
                <GridItem mx="auto" key={product.id}>
                  <Card
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    url={product.imagem}
                    description={product.description}
                    slug={product.slug}
                  />
                </GridItem>
              ))}
            </SimpleGrid>
          </>
        ) : (
          <NotFound message="Ops, produto não encontrado!" />
        )}
      </Flex>
    </>
  )
}

export default Category
