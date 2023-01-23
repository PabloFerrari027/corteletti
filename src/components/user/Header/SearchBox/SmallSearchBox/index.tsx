import {
  Box,
  Flex,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
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

interface SmallSearchBoxProps {
  isFocus: boolean
  setFocus: Dispatch<React.SetStateAction<boolean>>
  handleInput: (value: string) => void
  resultsBySearch: Product[]
}

const SmallSearchBox: React.FC<SmallSearchBoxProps> = ({
  handleInput,
  isFocus,
  resultsBySearch,
  setFocus
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label="Search database"
        icon={<RiSearchLine />}
        borderRadius="full"
        boxShadow="base"
        bg="white"
        color="gray.600"
      />

      <Modal isOpen={isOpen} onClose={onClose} size={['xs', 'sm']}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Buscar produto</ModalHeader>

          <ModalCloseButton />

          <ModalBody pb="2em">
            <Flex
              flex="1"
              color="gray.700"
              position="relative"
              borderRadius={
                isFocus && resultsBySearch.length > 0 ? 'lg' : 'full'
              }
              borderBottomRadius={
                isFocus && resultsBySearch.length > 0 ? 'none' : 'full'
              }
              boxShadow="base"
              direction="column"
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SmallSearchBox
