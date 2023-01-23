import { faunadb } from '../../../services/fauna'
import { query as q } from 'faunadb'

interface Data {
  data: {
    products: {
      id: string
      quantity: number
    }
    total: number
    note: string
    status: string
  }
}

interface ResquestResponse {
  data?: Data[]
}

const GetRequest = async function (email: string) {
  const response = await faunadb.query<ResquestResponse>(
    q.Filter(
      q.Map(
        q.Paginate(q.Documents(q.Collection('requests'))),
        q.Lambda('requests', q.Get(q.Var('requests')))
      ),
      q.Lambda(
        'all',
        q.ContainsValue(email, q.SelectAll(['data', 'email'], q.Var('all')))
      )
    )
  )

  return response
}

export default GetRequest
