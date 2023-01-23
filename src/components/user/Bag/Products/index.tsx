import React from 'react'

import { SimpleGrid } from '@chakra-ui/react'
import Card from '../../Card'

import { PrismicDocument } from '@prismicio/types'

interface ProductsProps {
  products: PrismicDocument<Record<string, any>, string, string>[]
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  return (
    <SimpleGrid spacing="1em" mt="1em">
      {products?.map(product => (
        <Card
          key={product.id}
          id={product.id}
          url={product.data.imagem.url}
          description={product.data.description[0]?.text}
          title={product.data.title[0]?.text}
          price={product.data.price}
          slug={product.uid}
          showCleanButton={true}
        />
      ))}
    </SimpleGrid>
  )
}

export default Products
