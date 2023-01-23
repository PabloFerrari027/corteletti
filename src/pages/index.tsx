import { Flex } from '@chakra-ui/react'
import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import Categories from '../components/user/Categories'
import Offers from '../components/user/Offers'
import { createClient } from '../services/prismicio'

interface Category {
  id: string
  slug?: string | null
  title?: string | null
  imagem?: string | null
  description?: string | null
}

interface Highlight {
  id: string
  slug?: string | null
  title?: string | null
  url?: string | null
  description?: string | null
  price?: number | null
  promotion?: number | null
}

interface HomeProps {
  categories: Category[]
  highlights: Highlight[]
}

const Home: NextPage<HomeProps> = props => {
  return (
    <>
      <Head>
        <title>Home | Corteletti</title>
      </Head>

      <Flex as="main" justifyContent="center" minH="100vh" h="100%" w="100%">
        <Flex w="100%" maxW="1024px" mx="auto" direction="column">
          <Categories categories={props.categories} />

          <Offers highlights={props.highlights} />
        </Flex>
      </Flex>
    </>
  )
}

export default Home

export async function getStaticProps({ previewData }: { previewData: any }) {
  const client = createClient({ previewData })

  const categories = await client.getAllByType('categorias')

  const highlights = await client.getAllByType('destaques')

  const dataCategories: Category[] = categories.map(result => {
    return {
      id: result?.id,
      slug: result?.uid || null,
      title: result?.data?.title[0]?.text || null,
      description: result?.data?.description[0]?.text || null,
      imagem: result?.data?.imagem?.url || null
    }
  })

  const dataHighlights: Highlight[] = highlights.map(result => {
    return {
      id: result.id,
      slug: result.uid,
      title: result.data.title[0]?.text || null,
      description: result.data?.description[0]?.text || null,
      url: result.data?.imagem?.url || null,
      price: result.data?.price || null,
      promotion: result.data?.promotion || null
    }
  })

  return {
    props: {
      categories: dataCategories,
      highlights: dataHighlights
    }
  }
}
