import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStripJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubcribeButtonProps {
  priceId: string;
}

export default function SubcribeButton({ priceId }: SubcribeButtonProps) {
  const Session = useSession();
  

  async function handleSubscribe(){ 
    if(!Session){
      signIn('github')
      return
    }

    try {
      const response = await api.post('/subscribe')
      const {sessionId} = response.data
      const stripe = await getStripJs()

      await stripe.redirectToCheckout({sessionId:sessionId })
    }catch(err) {
      alert(err.message)
    }

  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe Now
    </button>
  );
}
