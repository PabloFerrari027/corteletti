import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

import { toast } from 'react-toastify'

import { useSession } from '../../../contexts/userSessionContext'

import { api } from '../../../services/api'

import { Input } from '../Input'

const Address: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { session, setSession } = useSession()

  const [cep, setCep] = useState('')
  const [number, setNumber] = useState('')
  const [errorCep, setErrorCep] = useState('')
  const [errorNumber, setErrorNumber] = useState('')

  const [data, setData] = useState('')
  const [showData, setShowData] = useState(false)

  const [buttonGetAddressesIsLoading, setButtonGetAddressesIsLoading] =
    useState(false)
  const [buttonSaveAddressesIsLoading, setButtonSaveAddressesIsLoading] =
    useState(false)

  async function handleGetAddressByCep() {
    setButtonGetAddressesIsLoading(true)
    if (cep.trim() === '') setErrorCep('CEP obrigatório')
    if (number.trim() === '') setErrorNumber('Número obrigatório')

    try {
      const { data } = await api.get(`https://viacep.com.br/ws/${cep}/json/`)

      if (
        data.logradouro &&
        data.siafi &&
        data.bairro &&
        data.localidade &&
        data.uf &&
        data.cep
      ) {
        setData(
          `${data.logradouro}, ${data.siafi} - ${data.bairro}, ${data.localidade} - ${data.uf}, ${data.cep}`
        )
        setErrorCep('')
        setShowData(true)
      } else {
        setErrorCep('CEP Inválido')
        setShowData(false)
      }
    } catch (error) {
      console.log(error)
      setShowData(false)
      setErrorCep('CEP Inválido')
    }

    setButtonGetAddressesIsLoading(false)
  }

  async function handleUpdateAddress(address: string, number: string) {
    setButtonSaveAddressesIsLoading(true)

    try {
      // const response = await api.post('/users/update', {
      //   email: session?.email,
      //   timestamp: new Date(),
      //   address,
      //   number
      // })
      if (session) setSession({ ...session, address: data, number })
      onClose()
    } catch (error: any) {
      if (error.response.status === 404) {
        toast.error(
          'Usuário não encontrado, faça login ou recarregue a página!',
          {
            position: toast.POSITION.TOP_RIGHT
          }
        )
      }

      if (error.response.status === 500) {
        toast.error('Conflito interno, tente novamente mais tarde!', {
          position: toast.POSITION.TOP_RIGHT
        })
      }

      onClose()

      console.log(error)
    }

    setButtonSaveAddressesIsLoading(false)
  }

  return (
    <>
      {session?.address ? (
        <Button color="gray.700" mt="1em" onClick={onOpen}>
          Alterar Endereço
        </Button>
      ) : (
        <Button color="gray.700" mt="1em" onClick={onOpen}>
          Adicionar Endereço
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={['xs', 'sm']}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            {session?.address ? 'Alterar endereço' : 'Adicionar endereço'}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <FormControl
              as="form"
              onSubmit={async e => {
                e.preventDefault()
                await handleGetAddressByCep()
              }}
            >
              <Input
                label="CEP"
                name="cep"
                value={cep}
                onChange={v => {
                  setShowData(false)
                  setCep(v.target.value)
                }}
                error={{ message: errorCep }}
              />

              <Input
                label="Número"
                name="number"
                value={number}
                onChange={v => {
                  setShowData(false)
                  setNumber(v.target.value)
                }}
                error={{ message: errorNumber }}
              />

              <Checkbox
                size="md"
                colorScheme="green"
                mt="1em"
                display="flex"
                alignItems="center"
                onChange={() =>
                  number === 'Sem número'
                    ? setNumber('')
                    : setNumber('Sem número')
                }
              >
                <Text fontSize="0.7em">Sem número</Text>
              </Checkbox>

              <Button
                colorScheme="green"
                mt="1em"
                type="submit"
                isLoading={buttonGetAddressesIsLoading}
              >
                Procurar
              </Button>
            </FormControl>

            {showData && (
              <>
                <Divider my="1em" />

                <Box>
                  <Box>
                    <Text
                      as="h2"
                      fontWeight="medium"
                      fontSize="1em"
                      color="gray.700"
                    >
                      Endereço
                    </Text>

                    <Text as="address" color="gray.700" fontSize="1em">
                      {!!number && data}
                    </Text>
                  </Box>

                  <Box mt="1em">
                    <Text
                      as="h2"
                      fontWeight="medium"
                      fontSize="1em"
                      color="gray.700"
                    >
                      Número
                    </Text>

                    <Text as="p" color="gray.600" fontSize="1em">
                      {!!number ? number : '240'}
                    </Text>
                  </Box>
                </Box>

                <Button
                  mt="1em"
                  colorScheme="green"
                  disabled={!showData}
                  onClick={async () => {
                    await handleUpdateAddress(data, number)
                  }}
                  isLoading={buttonSaveAddressesIsLoading}
                >
                  Salvar
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Address
