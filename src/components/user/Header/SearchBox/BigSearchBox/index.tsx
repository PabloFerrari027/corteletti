import { Box, Flex, Icon, Input } from '@chakra-ui/react'
import React, { Dispatch } from 'react'
import { RiSearchLine } from 'react-icons/ri'
import ListResults from '../ListResults'

interface Product {
  id: string
  slug: string | null
  title: string | null
  imagem: string | null
  description: string | null
  price: number | null
  type: string | null
}

interface BigSearchBoxProps {
  isFocus: boolean
  setFocus: Dispatch<React.SetStateAction<boolean>>
  handleInput: (value: string) => void
  resultsBySearch: Product[]
}

const BigSearchBox: React.FC<BigSearchBoxProps> = ({
  handleInput,
  isFocus,
  resultsBySearch,
  setFocus
}) => {
  return (
    <Flex
      flex="1"
      color="gray.700"
      position="relative"
      borderRadius={isFocus && resultsBySearch.length > 0 ? 'lg' : 'full'}
      borderBottomRadius={
        isFocus && resultsBySearch.length > 0 ? 'none' : 'full'
      }
      boxShadow="base"
    >
      <Flex as="label" w="100%" alignItems="center" borderRadius="full">
        <Input
          color="gray.700"
          variant="unstyled"
          py="4"
          px="6"
          placeholder="Buscar na plataforma"
          _placeholder={{ color: 'gray.400' }}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 1000)}
          onInput={v => handleInput(v.currentTarget.value)}
        />

        <Icon
          as={RiSearchLine}
          aria-label="Search database"
          fontSize="20"
          color="gray.400"
          mr="4"
        />
      </Flex>

      {isFocus && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          width="100%"
          h="auto"
          bg="white"
          zIndex="2"
          borderBottomRadius="lg"
          boxShadow="base"
        >
          {resultsBySearch.length > 0 && (
            <ListResults resultsBySearch={resultsBySearch} />
          )}
        </Box>
      )}
    </Flex>
  )
}

export default BigSearchBox
