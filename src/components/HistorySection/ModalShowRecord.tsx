import { createPortal } from 'react-dom';
import styles from './ModalShowRecord.module.css';
import { useEffect } from 'react';
import type { HistoryEntry } from '../../store/useAnalyticsStore';
import { DeleteIconButton } from '../UI/DeleteIconButton/DeleteIconButton';
import { getDataForRows } from '../HighlightsSection/HighlightsSection';
import type { AggregateResult } from '../../api/CsvApi';
import { Row } from '../UI/Row/Row';

export type HistoryEntryWithResult = HistoryEntry & { result: AggregateResult };

type Props = {
  row: HistoryEntryWithResult;
  onClose: () => void;
};

export const ModalShowRecord = ({ row, onClose }: Props) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const rows = getDataForRows(row.result ?? []);

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal}>
        <div className={styles.deleteBtn}>
          <DeleteIconButton onDelete={onClose} />
        </div>
        {rows.map((row) => (
          <Row key={row.title} title={row.title} subtitle={row.subtitle} />
        ))}
      </div>
    </div>,
    document.body
  );
};
