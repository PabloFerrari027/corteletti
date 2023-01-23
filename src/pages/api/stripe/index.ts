import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '../../../services/stripe'

const Checkout = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const stripeCustomer = await stripe.customers.create({
      email: req.body.email
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'BRL',
            unit_amount: req.body.amount,
            product_data: {
              name: 'price_1MMaLtFx0Uu72S35sZSKCdAJ'
            }
          }
        }
      ],
      mode: 'payment',
      success_url: process.env.NEXT_PUBLIC_SUCCESS_URL!,
      cancel_url: process.env.NEXT_PUBLIC_CANCEL_URL!
    })

    return res.status(200).json({
      sessionId: checkoutSession.id,
      stripeCustomerId: stripeCustomer.id
    })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default Checkout
