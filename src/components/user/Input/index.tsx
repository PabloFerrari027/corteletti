import {
  Button,
  FormControl,
  FormLabel,
  Icon,
  Input as ChakraInput,
  InputGroup,
  InputProps,
  InputRightElement,
  Text
} from '@chakra-ui/react'

import { forwardRef, ForwardRefRenderFunction, useState } from 'react'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'
import { RiEyeLine, RiEyeCloseLine } from 'react-icons/ri'

interface InputBaseProps extends InputProps {
  label?: string
  error?:
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined
    | { message: string }
  isPassword?: boolean
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputBaseProps> = (
  { label, name, error, isPassword = false, ...rest },
  ref
) => {
  const [show, setType] = useState(false)

  if (isPassword) {
    return (
      <FormControl mt="1em">
        {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

        <InputGroup>
          <ChakraInput
            pr="4.5rem"
            type={show ? 'text' : 'password'}
            {...rest}
            ref={ref}
            name={name}
            id={name}
            placeholder={rest.placeholder}
            _placeholder={{ color: 'gray.300' }}
          />

          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              variant="unstyled"
              size="sm"
              onClick={() => setType(!show)}
              display="flex"
              my="auto"
            >
              {show ? (
                <Icon fontSize="1.5em" color="gray.400" as={RiEyeCloseLine} />
              ) : (
                <Icon fontSize="1.5em" color="gray.400" as={RiEyeLine} />
              )}
            </Button>
          </InputRightElement>
        </InputGroup>

        {!!error && (
          <Text as="p" fontSize="0.8em" mt="0.5em" color="red">
            {String(error.message)}
          </Text>
        )}
      </FormControl>
    )
  }

  return (
    <FormControl mt="1em">
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <ChakraInput
        {...rest}
        ref={ref}
        name={name}
        id={name}
        _placeholder={{ color: 'gray.300' }}
      />

      {!!error && (
        <Text as="p" fontSize="0.8em" mt="0.5em" color="red">
          {String(error.message)}
        </Text>
      )}
    </FormControl>
  )
}

export const Input = forwardRef(InputBase)
