import { Box, Text, Textarea } from '@chakra-ui/react'
import React from 'react'

interface NoteProps {
  note: string
  setNote: React.Dispatch<React.SetStateAction<string>>
}

const Note: React.FC<NoteProps> = ({ note, setNote }) => {
  return (
    <Box mt="2em">
      <Text as="h2" fontSize="1em" color="gray.800" fontWeight="medium">
        Observação
      </Text>

      <Textarea
        value={note}
        onChange={v => setNote(v.target.value)}
        mt="1em"
        placeholder="Digite aqui..."
      />
    </Box>
  )
}

export default Note
