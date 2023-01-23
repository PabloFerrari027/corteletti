import { List, ListItem, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

interface Product {
  id: string
  slug: string | null
  title: string | null
  imagem: string | null
  description: string | null
  price: number | null
  type: string | null
}

interface SmallSearchBoxProps {
  resultsBySearch: Product[]
}

const ListResults: React.FC<SmallSearchBoxProps> = ({ resultsBySearch }) => {
  return (
    <List px="6" py="4" w="100%" h="100%">
      <VStack spacing="1em" w="100%">
        {resultsBySearch.map((result, index) => (
          <ListItem
            w="100%"
            key={index}
            _hover={{ color: 'yellow.500' }}
            lineHeight="1.3em"
            color="gray.600"
            alignItems="left"
            textAlign="left"
            textTransform="lowercase"
          >
            <Link href={`/user/product/${result.id}`}>{result?.title}</Link>
          </ListItem>
        ))}
      </VStack>
    </List>
  )
}

export default ListResults
