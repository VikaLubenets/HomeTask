import { useState } from 'react';
import { LStorage } from '../../services/storage';
import { LS_KEY, type HistoryEntry } from '../../store/store';
import { Button } from '../UI/Button/Button';
import { FileStatusRow } from '../UI/FileStatusRow/FileStatusRow';
import styles from './HistorySection.module.css';

export const HistorySection = () => {
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
          {data.map((row) => (
            <FileStatusRow {...row} onDelete={onDelete} key={row.id} />
          ))}
        </div>
      )}
      <div className={styles.btnContainer}>
        <Button>Cгенерировать больше</Button>
        {data.length > 0 && (
          <Button 
            styleType="BLACK"
            onClick={() => {
              LStorage.clear();
              setData([]);
            }}
          >
            Очистить все
          </Button>
        )}
      </div>
    </section>
  );
};
