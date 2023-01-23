import { Flex, Icon, IconButton, Textarea } from '@chakra-ui/react'
import React, { FormEvent } from 'react'
import { FaPaperPlane } from 'react-icons/fa'

interface FooterProps {
  handleInputMessage: (event: FormEvent) => void
  setMessage: (value: React.SetStateAction<string>) => void
  message: string
}

const Footer: React.FC<FooterProps> = ({
  handleInputMessage,
  setMessage,
  message
}) => {
  return (
    <Flex
      as="form"
      bg="gray.100"
      p="0.5em"
      h="fit-content"
      alignItems="center"
      gap="1em"
      onSubmit={event => handleInputMessage(event)}
    >
      <Textarea
        bg="white"
        rows={2}
        placeholder="Mensagem"
        size="sm"
        resize="none"
        fontSize="1em"
        borderRadius="md"
        py="0.5em"
        onChange={v => setMessage(v.target.value)}
        value={message}
      />

      <IconButton
        colorScheme="blue"
        borderRadius="full"
        aria-label="send message"
        icon={<Icon as={FaPaperPlane} />}
        type="submit"
      />
    </Flex>
  )
}

export default Footer
