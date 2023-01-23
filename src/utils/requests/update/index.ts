import { faunadb } from '../../../services/fauna'
import { query as q } from 'faunadb'

interface Response {
  ref: string
}

const UpdateRequest = async function (customerId: string, status: string) {
  try {
    const response = await faunadb.query<Response>(
      q.Get(q.Match(q.Index('find_by_customer_id'), customerId))
    )

    await faunadb.query(
      q.Update(response.ref, {
        data: {
          status
        }
      })
    )
  } catch (error) {
    console.log(error)
    return
  }
}

export default UpdateRequest
