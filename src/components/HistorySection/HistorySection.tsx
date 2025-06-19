import { Button } from '../UI/Button/Button';
import { FileStatusRow } from '../UI/FileStatusRow/FileStatusRow';
import styles from './HistorySection.module.css'

type Data = {
    fileName: string;
    date: string;
    status: 'error' | 'success';
}[]

export const HistorySection = () => {
    const data: Data = [];

    return (
        <section className={styles.section}>
            {data.length > 0 && (
                <div className={styles.rowsContainer} >
                    {data.map((row) => <FileStatusRow {...row} />)}
                </div>
            )}
            <div className={styles.btnContainer}>
                <Button>
                    Cгенерировать больше
                </Button>
                {data.length > 0 && (
                    <Button>
                        Очистить все
                    </Button>
                )}
            </div>
        </section>
    )
}