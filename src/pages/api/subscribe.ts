import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res:NextApiResponse) => {
  if(req.method === 'POST'){
    const session = await getSession({req})

    const stripCustumer = await stripe.customers.create({
      email: session.user.email,
    })


    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripCustumer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1KVQYCHScsb8A81dcI3mgvJq', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      success_url: process.env.STRIPE_SUCCESS_URL
    })

    return res.status(200).json({sessionId: stripeCheckoutSession.id})

  }else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}