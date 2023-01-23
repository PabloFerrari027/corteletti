import { faunadb } from '../../../../services/fauna'
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuid } from 'uuid'
import sgMail from '@sendgrid/mail'

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

const UpdateUser = async (email: string, token: string) => {
  try {
    const response = await getUser(email)

    await faunadb.query(
      q.Update(q.Ref(response.ref), {
        data: {
          token: token
        }
      })
    )
  } catch (error) {
    console.log(error)

    throw new Error('Erro interno')
  }
}

async function sendEmail(token: string, email: string) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

    const msg = {
      to: email,
      from: 'pabloferraricaliari@gmail.com',
      subject: 'Token de verificação de e-mail de conta Corteletti',
      html: `
      <p>
        Para que seu cadastro na Corteletti seja validado, clique no link abaixo:
      </p>

      <br>

      <strong>
        <a href="http://localhost:3000/user/account/verification/${token}/${email}">
          Clique aqui para validar seu e-mail
        </a>
      </strong>`
    }

    await sgMail.send(msg)

    return
  } catch (error) {
    console.log(error)
  }
}

const CreateUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body

  if (req.method == 'POST') {
    try {
      const token = uuid()

      await UpdateUser(email, token)

      await sendEmail(token, email)

      return res.status(200).json({ status: 'success' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error })
    }
  } else {
    throw new Error('Evento não tratado')
  }
}

export default CreateUsers
