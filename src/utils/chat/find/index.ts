import { faunadb } from '../../../services/fauna'
import { query as q } from 'faunadb'

interface Data {
  ref: { id: string }
  data: {
    message: string
    whereof: 'user' | 'admin'
    room: string
    timestamp: Date
  }
}

interface MessagesResponse {
  data?: Data[]
}

const FindMessagesByRoom = async function (room: string): Promise<Data[] | []> {
  try {
    const response = await faunadb.query<MessagesResponse>(
      q.Filter(
        q.Map(
          q.Paginate(q.Documents(q.Collection('messages'))),
          q.Lambda('messages', q.Get(q.Var('messages')))
        ),
        q.Lambda(
          'all',
          q.ContainsValue(room, q.SelectAll(['data', 'room'], q.Var('all')))
        )
      )
    )

    if (response?.data) {
      return response.data
    } else return []
  } catch (error) {
    console.log(error)
    return []
  }
}

export default FindMessagesByRoom
