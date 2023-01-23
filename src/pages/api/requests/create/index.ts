import { NextApiRequest, NextApiResponse } from 'next'
import { faunadb } from '../../../../services/fauna'
import { query as q } from 'faunadb'

const CreateRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'POST') {
    try {
      await faunadb.query(
        q.Create(q.Collection('requests'), {
          data: { ...req.body, status: 'not pay' }
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

export default CreateRequest
