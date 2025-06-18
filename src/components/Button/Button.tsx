import React from 'react';
import styles from './Button.module.css';

type ButtonStyle = 'GREEN' | 'YELLOW' | 'BLACK' | 'INACTIVE';

type Props = {
  type?: 'button' | 'submit' | 'reset';
  styleType?: ButtonStyle;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<Props> = ({
  type = 'button',
  styleType = 'GREEN',
  disabled = styleType === 'INACTIVE',
  children,
  onClick,
  ...rest
}) => {
  const className = `
    ${styles.button} 
    ${styles[styleType]} 
    ${rest.className ?? ''}
  `;

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};
