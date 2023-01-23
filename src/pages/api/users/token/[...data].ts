import { faunadb } from '../../../../services/fauna'
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next'

interface Product {
  id: string
  quantity: number
}

interface Session {
  name: string
  email: string
  photoUrl: string
  timestamp: Date
  address?: string
  number?: string
  products?: Product[]
  token: string
}

interface UserProps {
  error?: {
    status: number
  }
  ref?: string
  data?: Session
}

async function findUser(email: string, token: string): Promise<UserProps> {
  const user: UserProps | false = await faunadb.query(
    q.If(
      q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email))),
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email))),
      false
    )
  )

  if (!user)
    return {
      error: {
        status: 404
      }
    }

  if (user.data?.token !== token) {
    return {
      error: {
        status: 401
      }
    }
  }

  return user
}

async function updateUserStatus(ref: string) {
  await faunadb.query(
    q.Update(ref, {
      data: {
        status: true
      }
    })
  )
}

const VerifyTokenByEmail = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    try {
      const email = req.query.data ? req.query.data[0] : ''

      const token = req.query.data ? req.query.data[1] : ''

      const user = await findUser(email, token)

      if (user.error) {
        return res.status(user.error.status).json({ status: user.error.status })
      }

      if (user?.ref) await updateUserStatus(user.ref)

      return res.status(200).json({
        user: {
          email: user?.data?.email,
          name: user?.data?.name,
          timestamp: user?.data?.timestamp,
          photoUrl: user?.data?.name
        }
      })
    } catch (error) {
      console.log(error)

      return res.status(500).json({ error: 500 })
    }
  } else {
    throw new Error('Evento não tratado')
  }
}

export default VerifyTokenByEmail
