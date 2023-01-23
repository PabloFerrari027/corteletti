import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { useAllPrismicDocumentsByIDs } from '@prismicio/react'
import { PrismicDocument } from '@prismicio/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { client } from '../../../../services/prismicClient'

interface Requests {
  IDs: string[]
}

const Historic: React.FC<Requests> = ({ IDs }) => {
  const [count, setCount] = useState(3)
  const [isLoading, setLoading] = useState(false)
  const [document] = useAllPrismicDocumentsByIDs(IDs.slice(0, 3))
  const [historic, setHistoric] = useState<
    PrismicDocument<Record<string, any>, string, string>[]
  >([])

  useEffect(() => {
    document && setHistoric(document)
  }, [document])

  const handleCount = async () => {
    if (count < IDs.length) {
      setLoading(true)

      try {
        const response = await client.getByIDs(IDs.slice(0, count + 3))

        const docs = response.results

        setHistoric([...docs])
      } catch (error) {
        toast.error('Conflito interno!', {
          position: toast.POSITION.TOP_RIGHT
        })
      }
      setCount(i => i + 3)

      setLoading(false)
    }
  }

  if (historic?.length > 0)
    return (
      <Box>
        <Text as="h2" fontSize="1.6em" color="gray.700" fontWeight="medium">
          Peça novamente
        </Text>

        <Flex mt="1.5em" gap="2em" direction="column">
          {historic.map(product => (
            <Flex key={product.id} gap="1.5em" direction={['column', 'row']}>
              <Image
                src={product.data.imagem.url}
                rounded="md"
                w={['100%', '25%']}
                objectFit="cover"
              />

              <Box>
                <Link href={`/user/product/${product.id}`}>
                  <Text
                    as="h2"
                    fontSize="1em"
                    color="gray.800"
                    fontWeight="medium"
                    _hover={{ color: 'yellow.500' }}
                  >
                    {product.data.title[0]?.text}
                  </Text>
                </Link>

                <Text as="p" fontSize="0.8em" color="gray.700" mt="0.5em">
                  {product.data.description[0]?.text.slice(0, 200)}
                  {product.data.description[0]?.text.length > 200 && ' ...'}
                </Text>

                <Link href={`/user/product/${product.id}`}>
                  <Button colorScheme="green" mt="1em">
                    Pedir novamente
                  </Button>
                </Link>
              </Box>
            </Flex>
          ))}
        </Flex>

        {IDs.length >= count && (
          <Button
            colorScheme="orange"
            mt="3em"
            w="100%"
            onClick={handleCount}
            isLoading={isLoading}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    )

  return <></>
}

export default Historic
