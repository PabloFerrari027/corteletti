import { Flex } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import React from 'react'
import Category from '../../../components/user/Category'
import { createClient } from '../../../services/prismicio'

interface Product {
  id: string
  slug?: string | null
  title?: string | null
  imagem?: string | null
  description?: string | null
  price?: number | null
}

interface MenuProps {
  data: Product[]
  category: string
}

const Menu: NextPage<MenuProps> = ({ data, category }) => {
  return (
    <Flex as="main" justifyContent="center" minH="100vh" h="100%" w="100%">
      <Category products={data} category={category} />
    </Flex>
  )
}

export default Menu

export const getStaticProps: GetStaticProps = async ({
  previewData,
  params
}) => {
  const client = createClient({ previewData })

  const results =
    params?.category && (await client.getAllByType(params.category.toString()))

  const data: Product[] =
    results && results.length
      ? results?.map((result: any) => {
          return {
            id: result.id,
            slug: result?.uid || null,
            title: result?.data?.title[0]?.text || null,
            description: result?.data?.description[0]?.text || null,
            imagem: result?.data?.imagem?.url || null,
            price: result?.data?.price || null
          }
        })
      : []

  return {
    props: { data, category: params?.category?.toString() }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
