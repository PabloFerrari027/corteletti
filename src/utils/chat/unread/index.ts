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

const Unread = async function (room: string, whereof: string) {
  try {
    const response = await faunadb.query<MessagesResponse>(
      q.Filter(
        q.Map(
          q.Paginate(q.Documents(q.Collection('messages'))),
          q.Lambda('messages', q.Get(q.Var('messages')))
        ),
        q.Lambda(
          'all',
          q.Equals(
            q.ContainsValue(room, q.SelectAll(['data', 'room'], q.Var('all'))),
            q.ContainsValue(
              whereof,
              q.SelectAll(['data', 'whereof'], q.Var('all'))
            ),
            q.ContainsValue(
              false,
              q.SelectAll(['data', 'visualized'], q.Var('all'))
            )
          )
        )
      )
    )

    if (response?.data) return response.data.length
    else return 0
  } catch (error) {
    console.log(error)
    return
  }
}

export default Unread
