import { faunadb } from '../../../../services/fauna'
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'

interface VerifyUserProps {
  name: string
  email: string
  password: string
}

interface LoginResponseData {
  data?: {
    name: string
    email: string
    password: string
    token: string
    status: boolean
  }
}

async function verifyUser({
  email,
  name,
  password
}: VerifyUserProps): Promise<{ status: number }> {
  async function getUser(email: string) {
    const reponse = await faunadb.query(
      q.If(
        q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email))),
        q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email))),
        false
      )
    )

    return reponse
  }

  try {
    const response: LoginResponseData = await getUser(email)

    if (!response) return { status: 404 }

    if (response?.data?.password) {
      var compare = bcrypt.compare(password, response.data.password)

      return compare
        .then(async result => {
          if (!result) return { status: 401 }

          return { status: 200 }
        })
        .catch(err => {
          console.log(err)
          return { status: 500 }
        })
    }

    return { status: 406 }
  } catch (error) {
    console.log(error)
    return { status: 500 }
  }
}

const Login = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const response = await verifyUser(req.body)

      return res.status(response.status).json({ status: response.status })
    } catch (error) {
      throw new Error('Erro interno')
    }
  } else {
    throw new Error('Evento não tratado')
  }
}

export default Login
