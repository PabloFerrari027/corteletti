import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'
import { UserSessionProvider } from '../contexts/userSessionContext'
import Header from '../components/user/Header'
import Footer from '../components/user/Footer'
import { PrismicProvider } from '@prismicio/react'
import { client } from '../services/prismicClient'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <UserSessionProvider>
        <PrismicProvider client={client}>
          <Header />

          <ToastContainer />

          <Component {...pageProps} />

          <Footer />
        </PrismicProvider>
      </UserSessionProvider>
    </ChakraProvider>
  )
}
