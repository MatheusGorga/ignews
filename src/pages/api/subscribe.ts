import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type UserProps = {
  ref: {
    id: string;
  } ,
  data: {
    stripe_customer_id : string
  }
}


export default async (req: NextApiRequest, res:NextApiResponse) => {

  if(req.method === 'POST'){
    const session = await getSession({req})
    
    const user  = await fauna.query<UserProps>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
      
    )

  
    let custumerId = user.data.stripe_customer_id

    if(!custumerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      })

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: { 
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )

      custumerId = stripeCustomer.id
    }
    


    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: custumerId,
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