import styles from './DeleteIconButton.module.css';

type Props = {
  onDelete: () => void;
};

export const DeleteIconButton = ({ onDelete }: Props) => {
  return (
    <div className={styles.iconContainer} onClick={onDelete}>
      <img src="./icons/cancel.svg" alt="close icon" className={styles.icon} />
    </div>
  );
};
