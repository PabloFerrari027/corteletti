import { faunadb } from '../../../services/fauna'
import { query as q } from 'faunadb'

interface Message {
  message: string
  whereof: 'admin' | 'user'
  room: string
  timestamp: string
}

const CreateMessage = async function (data: Message) {
  try {
    faunadb.query(
      q.Create(q.Collection('messages'), {
        data: { ...data, visualized: false }
      })
    )
    return
  } catch (error) {
    console.log(error)
    return
  }
}

export default CreateMessage
