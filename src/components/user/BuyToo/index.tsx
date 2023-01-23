import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import React from 'react'

import { Pagination, FreeMode } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './styles.module.css'

import Card from '../Card'
import { useAllPrismicDocumentsByIDs } from '@prismicio/react'

const AskToo: React.FC<{ ids: string[] }> = ({ ids }) => {
  const variant = useBreakpointValue({
    base: 1,
    lg: 2
  })
  const [document] = useAllPrismicDocumentsByIDs(ids)

  return (
    <Box>
      <Text as="h2" fontSize="1.6em" color="gray.700" fontWeight="medium">
        Peça também
      </Text>

      <Flex mt="2em">
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
          {document?.map(doc => (
            <SwiperSlide key={doc.id}>
              <Flex justifyContent="center" key={doc.id}>
                <Card
                  key={doc.id}
                  id={doc.id}
                  url={doc.data.imagem.url}
                  description={doc.data.description[0]?.text}
                  title={doc.data.title[0]?.text}
                  price={doc.data.price}
                  slug={doc.uid}
                  showCleanButton={true}
                />
              </Flex>
            </SwiperSlide>
          ))}
        </Swiper>
      </Flex>
    </Box>
  )
}

export default AskToo
