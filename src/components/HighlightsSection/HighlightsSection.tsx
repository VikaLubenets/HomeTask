import type { AggregateResult } from '../../api/CsvApi';
import { Row } from '../UI/Row/Row';
import styles from './HighlightsSection.module.css'

export const HighlightsSection = () => {
    const data: AggregateResult = [];

    return (
        <section className={styles.section}>
            {data.length === 0 && (
                <div className={styles.text}>
                    <p>Здесь</p>
                    <p>появятся хайлайты</p>
                </div>
            )}
            {data.length > 0 && (
                data.map((row) => <Row title={row.title} subtitle={row?.subtitle ?? ''} />)
            )}
        </section>
    )
}