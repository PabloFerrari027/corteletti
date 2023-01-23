import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { api } from '../services/api'

interface Product {
  id: string
  quantity: number
}

interface Session {
  name: string
  email: string
  photoUrl: string
  timestamp?: Date
  address?: string
  number?: string
  products?: Product[]
}

interface UserSessionContextData {
  session?: Session | null
  setSession: (session: Session | null) => void
}

interface UserSessionProviderProps {
  children: ReactNode
}

const UserSessionContext = createContext({} as UserSessionContextData)

export function UserSessionProvider({ children }: UserSessionProviderProps) {
  const [session, setSession] = useState<Session | null>()

  const handleSession = async (s: Session | null) => {
    try {
      if (s) {
        await api.post('/users/update', { ...s, timestamp: new Date() })
      }

      setSession(s)

      window.localStorage.setItem('corteletti_session', JSON.stringify(s))
    } catch (error) {
      console.log(error)
    }
  }

  const initializeSession = async () => {
    try {
      const getStorage = window.localStorage.getItem('corteletti_session')

      if (!getStorage) return
      const storageSession = JSON.parse(getStorage)

      const response = await api.get(`/users/findUser/${storageSession?.email}`)

      if (response.data.user?.status === false) return

      const year = parseInt(response.data.user.timestamp?.split('-')[0])
      const month = parseInt(response.data.user.timestamp?.split('-')[1])

      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1

      if (currentYear !== year) return
      if (month !== currentMonth) return

      setSession(response.data.user)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    initializeSession()
  }, [])

  return (
    <UserSessionContext.Provider value={{ session, setSession: handleSession }}>
      {children}
    </UserSessionContext.Provider>
  )
}

export const useSession = () => useContext(UserSessionContext)
