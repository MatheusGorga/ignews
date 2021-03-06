import styles from "./styles.module.scss";

interface SubcribeButtonProps {
  priceId: string;
}

export default function SubcribeButton({ priceId }: SubcribeButtonProps) {
  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe Now
    </button>
  );
}
