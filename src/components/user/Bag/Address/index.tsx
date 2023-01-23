import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useSession } from '../../../../contexts/userSessionContext'
import Address_ from '../../Address'

const Address: React.FC = () => {
  const { session } = useSession()

  return (
    <Box>
      {session?.address && session?.number ? (
        <Box>
          <Box>
            <Text as="h2" fontSize="1em" color="gray.700" fontWeight="medium">
              Endereço
            </Text>

            <Text as="p" fontSize="1em" color="gray.700">
              {session?.address}
            </Text>
          </Box>

          <Box mt="1em">
            <Text as="h2" fontSize="1em" color="gray.700" fontWeight="medium">
              Número
            </Text>

            <Text as="p" fontSize="1em" color="gray.700">
              {session?.number}
            </Text>
          </Box>
        </Box>
      ) : (
        <Text as="h2" fontSize="1.2em" color="gray.700" fontWeight="medium">
          Endereço
        </Text>
      )}

      <Address_ />
    </Box>
  )
}

export default Address
