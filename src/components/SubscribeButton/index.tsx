import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

interface SubcribeButtonProps {
  priceId: string;
}

export default function SubcribeButton({ priceId }: SubcribeButtonProps) {
  const Session = useSession();
  

  function handleSubscribe(){ 
    if(!Session){
      signIn('github')
      return
    }

    

  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe Now
    </button>
  );
}
