import styles from './Layout.module.css'

type Props = {
    children: React.ReactNode;
    className?: string;
}

export default function Layout ({children, className}: Props) {
    return (
        <div className={`${styles.layout} ${className ? className : ''}`}>
            {children}
        </div>
)
}