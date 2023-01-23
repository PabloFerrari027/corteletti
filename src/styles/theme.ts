import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        fontFamily: ` 'Poppins', sans-serif`
      }
    })
  },
  colors: {
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    yellow: {
      100: '#ffea00',
      200: '#ffdd00',
      300: '#ffd000',
      400: '#ffc300',
      500: '#ffb700',
      600: '#ffa200',
      700: '#ff9500',
      800: '#ff8800',
      900: '#ff7b00'
    },
    green: {
      100: '#b7efc5',
      200: '#92e6a7',
      300: '#6ede8a',
      400: '#4ad66d',
      500: '#25a244',
      600: '#208b3a',
      700: '#1a7431',
      800: '#155d27',
      900: '#10451d'
    }
  }
})
