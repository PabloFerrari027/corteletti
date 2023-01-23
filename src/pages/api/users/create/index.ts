import { faunadb } from '../../../../services/fauna'
import { query as q } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import sgMail from '@sendgrid/mail'

interface SaveUserProps {
  name: string
  email: string
  password?: string
  token?: string
  withGoogle?: boolean
}

async function saveUser({
  email,
  name,
  password,
  token,
  withGoogle
}: SaveUserProps) {
  if (withGoogle) {
    await faunadb.query(
      q.Create(q.Collection('users'), {
        data: {
          name,
          email,
          status: true,
          timestamp: new Date()
        }
      })
    )
  } else {
    await faunadb.query(
      q.Create(q.Collection('users'), {
        data: {
          name,
          email,
          password,
          token,
          timestamp: new Date(),
          status: false
        }
      })
    )
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
  const { email, name, password, withGoogle } = req.body

  if (req.method == 'POST') {
    try {
      if (withGoogle) {
        saveUser({ email, name, withGoogle })
        return res.status(200).json({ status: 'success' })
      }

      const token = uuid()

      bcrypt.hash(password, 10, async (err, hash) => {
        await sendEmail(token, email)

        await saveUser({ email, name, password: hash, token })
      })

      return res.status(200).json({ status: 'success' })
    } catch (error) {
      console.log(error)

      throw new Error('Erro interno')
    }
  } else {
    throw new Error('Evento não tratado')
  }
}

export default CreateUsers
