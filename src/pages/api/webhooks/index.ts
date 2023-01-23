import { NextApiRequest, NextApiResponse } from 'next'
import { Readable } from 'stream'
import { stripe } from '../../../services/stripe'
import UpdateRequest from '../../../utils/requests/update'

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

let events: string[] = []

const Webhooks = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const secret = req.headers['stripe-signature']

    let event: any

    try {
      if (secret) {
        event = stripe.webhooks.constructEvent(
          buf,
          secret,
          process.env.STRIPE_WEBHOOK_SECRET!
        )
      }
    } catch (error) {
      return res.status(400).send(`Webhook error: ${error}`)
    }

    events.push(event.type)

    const customerId = event.data.object.customer

    if (events.includes('payment_intent.succeeded')) {
      await UpdateRequest(customerId, 'paid')

      res.status(200).json({ status: 200 })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default Webhooks

export const config = {
  api: {
    bodyParser: false
  }
}
