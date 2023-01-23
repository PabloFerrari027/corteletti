import { Box, useBreakpointValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { usePrismicDocuments } from '@prismicio/react'
import { api } from '../../../../services/api'
import BigSearchBox from './BigSearchBox'
import SmallSearchBox from './SmallSearchBox'

interface Product {
  id: string
  slug: string | null
  title: string | null
  imagem: string | null
  description: string | null
  price: number | null
  type: string | null
}

const SearchBox: React.FC = () => {
  const [isFocus, setFocus] = useState(false)

  const variant = useBreakpointValue({
    base: false,
    md: true
  })

  const [document] = usePrismicDocuments()

  const [documents, setDocuments] = useState<Product[]>([])

  const [resultsBySearch, setResultsBySearch] = useState<Product[]>([])

  async function handleGetAllDocuments() {
    if (!document) return

    if (documents.length === 0) {
      let results: Product[] = document.results
        .filter(result => result.type !== 'categorias')
        .map(result => {
          return {
            id: result.id,
            slug: result.uid || null,
            title: result.data.title[0].text || null,
            imagem: result.data.imagem?.url || null,
            description: result.data.description[0]?.text || null,
            price: result.data.price || null,
            type: result.type || null
          }
        })

      setDocuments(results)
      return
    }

    if (resultsBySearch.length <= 5 && document.next_page) {
      try {
        const { data } = await api.get(document.next_page)

        let results: Product[] = data.results
          .filter((result: any) => result.type !== 'categorias')
          .map((result: any) => {
            return {
              id: result.id,
              slug: result.uid,
              title: result.data.title[0].text,
              imagem: result.data.imagem?.url,
              description: result.data.description[0]?.text,
              price: result.data.price,
              type: result.type
            }
          })

        setDocuments(p => [...results])
        if (data.next_page) await handleGetAllDocuments()
      } catch (error) {
        console.log(error)
      }
    } else return
  }

  async function handleFilterDocuments(search: string) {
    if (search.trim() !== '') {
      const results = documents.filter(
        (doc: any) =>
          doc?.title?.slice(0, search.length).toLowerCase() ===
          search.toLowerCase()
      )

      setResultsBySearch(results)

      return
    } else {
      setResultsBySearch([])
      return
    }
  }

  async function handleInput(search: string) {
    await handleGetAllDocuments()

    await handleFilterDocuments(search)
  }

  useEffect(() => {
    console.log()
  }, [document])

  return (
    <Box
      position="relative"
      w={['fit-content', 'fit-content', '400px']}
      ml={['auto']}
      mr={['0', '0.5rem', 'auto']}
    >
      {variant ? (
        <BigSearchBox
          isFocus={isFocus}
          setFocus={setFocus}
          handleInput={handleInput}
          resultsBySearch={resultsBySearch}
        />
      ) : (
        <SmallSearchBox
          isFocus={isFocus}
          setFocus={setFocus}
          handleInput={handleInput}
          resultsBySearch={resultsBySearch}
        />
      )}
    </Box>
  )
}

export default SearchBox
