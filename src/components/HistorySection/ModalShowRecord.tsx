import { createPortal } from 'react-dom';
import styles from './ModalShowRecord.module.css';
import { useEffect } from 'react';
import type { HistoryEntry } from '../../store/useAnalyticsStore';
import { DeleteIconButton } from '../UI/DeleteIconButton/DeleteIconButton';
import type { AggregateResult } from '../../api';
import { Row } from '../UI/Row/Row';
import { transformDataForRows } from '../../services/transformDataForRows';

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

  const rows = transformDataForRows(row.result ?? []);

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.deleteBtnPosition}>
          <DeleteIconButton onDelete={onClose} />
        </div>
        {rows.map((row) => (
          <Row
            key={row.title}
            title={row.title}
            subtitle={row.subtitle}
            isPinkGg={true}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};
