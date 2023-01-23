import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import Bag from '../../../components/user/Bag'
import Chat from '../../../components/user/Chat'
import Dashboard from '../../../components/user/Dashboard'
import NotFound from '../../../components/user/NotFound'
import Privacy from '../../../components/user/Privacy'
import Profile from '../../../components/user/Profile'
import Requests from '../../../components/user/Requests'
import { useSession } from '../../../contexts/userSessionContext'

const Acount: React.FC = () => {
  const { query } = useRouter()
  const { session } = useSession()

  return (
    <>
      <Head>
        <title>Painel de controle | Corteletti</title>
      </Head>

      <Dashboard>
        {query.router === 'profile' && <Profile />}
        {query.router === 'requests' && <Requests />}
        {query.router === 'chat' && <Chat />}
        {query.router === 'privacy' && <Privacy />}
        {query.router === 'bag' && (
          <>
            {session && session?.products && session?.products?.length > 0 ? (
              <Bag productsIDs={session.products.map(product => product.id)} />
            ) : (
              <NotFound message="Sua Sacola está vazia!" />
            )}
          </>
        )}
      </Dashboard>
    </>
  )
}

export default Acount
