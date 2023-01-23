import { Flex } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps, NextPage, PreviewData } from 'next'
import Head from 'next/head'
import React from 'react'
import NotFound from '../../../components/user/NotFound'
import { createClient } from '../../../services/prismicio'
import Prod from '../../../components/user/Product'
import { ParsedUrlQuery } from 'querystring'

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

const Product: NextPage<ProductProps> = ({ product }) => {
  const title = product ? `${product.title} | Corteletti` : 'Corteletti'

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <Flex
        as="main"
        my="3em"
        maxW="1024px"
        minH="80vh"
        w="100%"
        px="1em"
        mx="auto"
      >
        {product ? (
          <Prod product={product} />
        ) : (
          <NotFound message="Ops, produto não encontrado!" />
        )}
      </Flex>
    </>
  )
}

export default Product

export const getStaticProps: GetStaticProps = async ({
  previewData,
  params
}) => {
  const client = createClient({ previewData })
  const id = params?.id?.toString()

  try {
    if (!id) return { props: {} }
    const result = await client.getByID(id)

    const product: Product = {
      id: result.id,
      slug: result?.uid || null,
      title: result.data?.title[0]?.text || null,
      price: result.data?.price || null,
      promotion: result.data?.promotion || null,
      description: result.data?.description[0]?.text || null,
      imagem: result.data?.imagem.url || null
    }

    return {
      props: { product }
    }
  } catch (error) {
    console.log(error)

    return {
      props: {}
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
