import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import styles from './styles.module.css'

import { Pagination, FreeMode } from 'swiper'
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Text,
  useBreakpointValue
} from '@chakra-ui/react'
import Link from 'next/link'
import { BsImageFill } from 'react-icons/bs'

interface Category {
  id: string
  slug?: string | null
  title?: string | null
  imagem?: string | null
  description?: string | null
}

interface CategoriesProps {
  categories: Category[]
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  const variant = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 3,
    lg: 4
  })

  const handleBgColor = (index: number) => {
    if (index % 4 === 0) return 'yellow.700'
    if (index % 3 === 0) return 'green.500'
    if (index % 2 === 0) return 'yellow.500'
    if (index % index === 0) return 'red.500'
  }

  return (
    <Box px="1em">
      <Flex mt="2em">
        <Text as="h1" fontWeight="bold" fontSize="2em" color="gray.700">
          Categorias
        </Text>
      </Flex>

      <Flex
        w="100%"
        h="16em"
        alignItems="center"
        mx="auto"
        mt="2em"
        mb="3em"
        px="1em"
      >
        <Swiper
          className={styles.swiper}
          pagination={{
            clickable: true
          }}
          slidesPerView={variant}
          spaceBetween={30}
          freeMode={true}
          modules={[FreeMode, Pagination]}
        >
          {categories.map((category, index) => (
            <SwiperSlide key={category.id}>
              <Flex
                w="100%"
                h="80%"
                bg={handleBgColor(index)}
                borderRadius=".4rem"
                overflow="hidden"
                position="relative"
                p="1em"
              >
                <Flex
                  w="100%"
                  h="100%"
                  direction="column"
                  justifyContent="space-between"
                  overflow="hidden"
                >
                  <Text
                    as="h1"
                    color="white"
                    fontSize="1.5em"
                    fontWeight="bold"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    maxW="100%"
                    overflow="hidden"
                  >
                    {category?.title}
                  </Text>

                  <Text as="span" fontSize=".8em" color="white" width="40%">
                    {category?.description}
                  </Text>

                  <Link href={`/user/menu/${category.slug}`}>
                    <Button
                      variant="outline"
                      borderColor="white"
                      w="fit-content"
                      color="white"
                      _hover={{
                        background: 'green.800',
                        borderColor: 'green.800'
                      }}
                    >
                      Ver opções
                    </Button>
                  </Link>
                </Flex>

                <Box
                  w="100px"
                  h="100px"
                  position="absolute"
                  top="50%"
                  transform="translateY(-55%)"
                  borderRadius="100%"
                  right="1.2em"
                  bg="white"
                >
                  {category.imagem ? (
                    <Image
                      src={category.imagem}
                      alt="categoria de pizzas"
                      w="100%"
                      h="100%"
                      borderRadius="100%"
                      border="2px solid white"
                    />
                  ) : (
                    <Flex borderRadius="lg" w="100%" h="12em" bg="gray.50">
                      <Icon
                        as={BsImageFill}
                        m="auto"
                        color="gray.300"
                        fontSize="2em"
                      />
                    </Flex>
                  )}
                </Box>
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>
      </Flex>
    </Box>
  )
}

export default Categories
