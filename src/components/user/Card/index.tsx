import {
  Card as ChakraCard,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  Image,
  Text,
  Flex,
  Icon
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BsImageFill } from 'react-icons/bs'

import ProductToggleButtons from '../ProductToggleButtons'

interface CardProps {
  price?: number | null
  description?: string | null
  url?: string | null
  title?: string | null
  slug?: string | null
  id?: string | null
  showCleanButton?: boolean
  promotion?: number | null
}

const Card: React.FC<CardProps> = ({
  price,
  description,
  url,
  title,
  id,
  showCleanButton = false,
  promotion
}) => {
  return (
    <ChakraCard w="100%">
      <CardBody>
        {url ? (
          <Image
            src={url}
            borderRadius="lg"
            w="100%"
            h="12em"
            bg="gray.50"
            objectFit="cover"
          />
        ) : (
          <Flex borderRadius="lg" w="100%" h="12em" bg="gray.50">
            <Icon as={BsImageFill} m="auto" color="gray.300" fontSize="2em" />
          </Flex>
        )}

        <Stack mt="6" spacing="3">
          <Link href={`/user/product/${id}`}>
            <Heading size="md" _hover={{ color: 'yellow.500' }}>
              {title}
            </Heading>
          </Link>

          <Text>
            {description?.slice(0, 200)}
            {description && description?.length > 200 && ' ...'}
          </Text>
        </Stack>
      </CardBody>

      <Divider />
      {id && price && (
        <CardFooter>
          <ProductToggleButtons
            id={id}
            price={price}
            showCleanButton={showCleanButton}
            promotion={promotion}
          />
        </CardFooter>
      )}
    </ChakraCard>
  )
}

export default Card
