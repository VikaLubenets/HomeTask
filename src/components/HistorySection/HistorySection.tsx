import { useState } from 'react';
import { LStorage } from '../../services/storage';
import { LS_KEY, type HistoryEntry } from '../../store/useAnalyticsStore';
import { Button } from '../UI/Button/Button';
import { FileStatusRow } from '../UI/FileStatusRow/FileStatusRow';
import styles from './HistorySection.module.css';
import { useNavigate } from 'react-router-dom';
import {
  ModalShowRecord,
  type HistoryEntryWithResult,
} from './ModalShowRecord';

function hasResult(entry: HistoryEntry): entry is HistoryEntryWithResult {
  return !!entry.result;
}

export const HistorySection = () => {
  const navigate = useNavigate();
  const [activeRow, setActiveRow] = useState<HistoryEntryWithResult | null>(
    null
  );
  const [data, setData] = useState(
    () => LStorage.get<HistoryEntry[]>(LS_KEY) ?? []
  );

  const onDelete = (id: string) => {
    const newData = data.filter((row) => row.id !== id);
    LStorage.set(LS_KEY, newData);
    setData(newData);
  };

  return (
    <section className={styles.section}>
      {data.length > 0 && (
        <div className={styles.rowsContainer}>
          {data.map((row) => {
            const canOpenModal = row.status === 'success';
            return (
              <div
                data-testid="data-row"
                key={row.id}
                className={`${styles.rowWrapper} ${!canOpenModal ? styles.disabled : ''}`}
                onClick={() => {
                  if (canOpenModal && hasResult(row)) {
                    setActiveRow(row);
                  }
                }}
              >
                <FileStatusRow {...row} onDelete={() => onDelete(row.id)} />
              </div>
            );
          })}
        </div>
      )}
      <div className={styles.btnContainer}>
        <Button
          onClick={() => navigate('/generation')}
          data-testid="btn-gen-more"
        >
          Сгенерировать больше
        </Button>
        {data.length > 0 && (
          <Button
            styleType="BLACK"
            onClick={() => {
              LStorage.clear();
              setData([]);
            }}
            data-testid="btn-clear"
          >
            Очистить все
          </Button>
        )}
      </div>
      {activeRow && activeRow.result && (
        <ModalShowRecord row={activeRow} onClose={() => setActiveRow(null)} />
      )}
    </section>
  );
};
