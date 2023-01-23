import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React from 'react'
import Card from '../Card'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import styles from './styles.module.css'

import { Pagination, FreeMode } from 'swiper'

interface Highlight {
  id: string
  slug?: string | null
  title?: string | null
  url?: string | null
  description?: string | null
  price?: number | null
  promotion?: number | null
}

interface OffersProps {
  highlights: Highlight[]
}

const Offers: React.FC<OffersProps> = ({ highlights }) => {
  const variant = useBreakpointValue({
    base: 1,
    md: 2,
    lg: 3
  })

  return (
    <Box mb="4em" px="1em" w="100%">
      <Text as="h1" fontWeight="bold" fontSize="2em" color="gray.700">
        Destaques
      </Text>

      <Flex mt="1em" w="100%" alignItems="center" mx="auto">
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
          {highlights.map(highlight => (
            <SwiperSlide key={highlight.id}>
              <Flex justifyContent="center" key={highlight.id}>
                <Card
                  id={highlight.id}
                  title={highlight?.title}
                  price={highlight?.price}
                  url={highlight?.url}
                  description={highlight?.description}
                  slug={highlight?.slug}
                  promotion={highlight?.promotion}
                />
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>
      </Flex>
    </Box>
  )
}

export default Offers
