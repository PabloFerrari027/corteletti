import { NextApiRequest, NextApiResponse } from 'next'
import { faunadb } from '../../../../services/fauna'
import { query as q } from 'faunadb'

interface UserResponse {
  data?: {
    name: string
    email: string
    address?: string
    number?: number
    timestamp?: string
    products?: {
      id: string
      quantity: number
    }[]
    status?: boolean
  }
}

const FindUserByEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    if (!req.query.email)
      return res.status(200).json({
        user: false
      })

    try {
      const reponse = await faunadb.query<UserResponse>(
        q.If(
          q.Exists(
            q.Match(q.Index('user_by_email'), q.Casefold(req.query.email))
          ),
          q.Get(q.Match(q.Index('user_by_email'), q.Casefold(req.query.email))),
          false
        )
      )

      if (!reponse)
        return res.status(200).json({
          user: false
        })

      return res.status(200).json({
        user: {
          name: reponse?.data?.name,
          email: reponse?.data?.email,
          address: reponse?.data?.address,
          number: reponse?.data?.number,
          timestamp: reponse?.data?.timestamp,
          products: reponse?.data?.products,
          status: reponse?.data?.status
        }
      })
    } catch (error) {
      console.log(error)
    }
  } else {
    throw new Error('Evento não tratado')
  }
}

export default FindUserByEmail
