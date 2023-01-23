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

const UpdateMessage = async function (
  room: string,
  whereof: 'user' | 'admin'
): Promise<void> {
  try {
    const response = await faunadb.query<MessagesResponse>(
      q.Foreach(
        q.Filter(
          q.Map(
            q.Paginate(q.Documents(q.Collection('messages'))),
            q.Lambda('messages', q.Get(q.Var('messages')))
          ),
          q.Lambda(
            'all',
            q.Equals(
              q.ContainsValue(
                room,
                q.SelectAll(['data', 'room'], q.Var('all'))
              ),
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
        ),
        q.Lambda(
          'data',
          q.Update(q.Select(['ref'], q.Var('data')), {
            data: {
              visualized: true
            }
          })
        )
      )
    )
  } catch (error) {
    console.log(error)
    return
  }
}

export default UpdateMessage
