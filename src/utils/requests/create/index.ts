import { faunadb } from '../../../services/fauna'
import { query as q } from 'faunadb'

interface Request {
  email: string
  products: {
    id: string
    quantity: number
  }[]
  total: number
  note: string
}

const CreateRequest = async function (data: Request) {
  try {
    faunadb.query(
      q.Create(q.Collection('requests'), {
        data: { ...data, status: 'processing' }
      })
    )
    return
  } catch (error) {
    console.log(error)
    return
  }
}

export default CreateRequest
