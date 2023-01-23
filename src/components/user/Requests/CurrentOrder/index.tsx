import { Box, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import { useAllPrismicDocumentsByIDs } from '@prismicio/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { PrismicDocument } from '@prismicio/types'

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

interface CurrentOrderProps {
  current: Data
  IDs: string[]
}

const CurrentOrder: React.FC<CurrentOrderProps> = ({ current, IDs }) => {
  const [document] = useAllPrismicDocumentsByIDs(IDs)
  const [data, setData] =
    useState<PrismicDocument<Record<string, any>, string, string>[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let replicatedProducts: PrismicDocument<
      Record<string, any>,
      string,
      string
    >[] = []

    current.data.products.forEach(product => {
      const doc = document?.find(doc => doc.id === product.id)

      if (doc) {
        for (let i = 0; i < product.quantity; i++) {
          replicatedProducts.push(doc)
        }
      }
    })

    setData(replicatedProducts)

    if (data && data?.length > 0) setLoading(false)
  }, [current, document])

  if (loading) {
    return (
      <Flex w="100%" h="50vh">
        <Spinner size="lg" color="green.600" m="auto" />
      </Flex>
    )
  }

  return (
    <Box>
      <Box>
        {data?.map((product, index) => (
          <Box key={index}>
            <Flex mt="1.5em" gap="1.5em" direction={['column', 'row']}>
              <Image
                src={product?.data.imagem.url}
                rounded="md"
                w={['100%', '25%']}
                h="auto"
                objectFit="cover"
              />

              <Box>
                <Link href={`/user/product/${product?.id}`}>
                  <Text
                    as="h2"
                    fontSize="1em"
                    color="gray.800"
                    fontWeight="medium"
                    _hover={{ color: 'yellow.500' }}
                  >
                    {product?.data.title[0]?.text}
                  </Text>
                </Link>

                <Text as="p" fontSize=".8em" color="gray.700" mt="0.5em">
                  {product?.data.description[0]?.text.slice(0, 200)}
                  {product?.data.description[0]?.text.length > 200 && ' ...'}
                </Text>
              </Box>
            </Flex>
          </Box>
        ))}
      </Box>

      {current.data.note && (
        <>
          <Divider my="2em" />

          <Box>
            <Text as="p" fontSize="1em" color="gray.800" fontWeight="medium">
              Observação
            </Text>

            <Text as="p" fontSize="1em" color="gray.700" mt="0.5em">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Voluptatem numquam dolor nesciunt atque, deleniti laudantium fuga
              laboriosam molestias minima perferendis!
            </Text>
          </Box>
        </>
      )}
    </Box>
  )
}

export default CurrentOrder
