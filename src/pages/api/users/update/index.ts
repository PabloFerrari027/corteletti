import { NextApiRequest, NextApiResponse } from 'next'
import { faunadb } from '../../../../services/fauna'
import { query as q } from 'faunadb'

type UserResponse = {
  ref: {
    id: string
  }
}

async function getUser(email: string) {
  const response = await faunadb.query<UserResponse>(
    q.If(
      q.Exists(q.Match(q.Index('user_by_email'), q.Casefold(email))),
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(email))),
      false
    )
  )

  return response
}

const UpdateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const response = await getUser(req.body.email)

      if (!response)
        return res.status(404).json({ error: 'Usuário não encontrado' })

      await faunadb.query(
        q.Update(q.Ref(response.ref), {
          data: req.body
        })
      )

      return res.status(200).json({ status: 'success' })
    } catch (error) {
      console.log(error)

      throw new Error('Erro interno')
    }
  } else {
    throw new Error('Evento não tratado')
  }
}

export default UpdateUser
