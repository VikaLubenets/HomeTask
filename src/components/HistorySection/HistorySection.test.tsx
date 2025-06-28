import '@testing-library/jest-dom/vitest';
import { screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HistorySection } from './HistorySection';
import { LStorage } from '../../services/storage';
import { renderWithRouter } from '../../util/test-utils';
import { LS_KEY } from '../../store/useAnalyticsStore';
import { transformDataForRows } from '../../services/transformDataForRows';

vi.mock('../../services/storage');

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual =
    (await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    ))!;
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const mockSet = vi.fn();
const mockClear = vi.fn();

const historyRow = {
  id: '1750432752050',
  fileName: 'report (7).csv',
  date: '2025-06-20T15:19:12.050Z',
  status: 'success',
  result: {
    total_spend_galactic: 1432542813.5,
    rows_affected: 2862809,
    less_spent_at: 166,
    big_spent_at: 302,
    less_spent_value: 3759426.5,
    big_spent_value: 4140109,
    average_spend_galactic: 500.3976211825518,
    big_spent_civ: 'monsters',
    less_spent_civ: 'humans',
  },
};

const renderComponent = () => renderWithRouter(<HistorySection />);

describe('HistorySection', () => {
  let getSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    getSpy = vi.spyOn(LStorage, 'get').mockReturnValue([]) as ReturnType<
      typeof vi.spyOn
    >;
    vi.spyOn(LStorage, 'set').mockImplementation(mockSet);
    vi.spyOn(LStorage, 'clear').mockImplementation(mockClear);
  });

  afterEach(() => {
    cleanup();
  });

  it('loads data from localStorage with correct key', () => {
    getSpy.mockReturnValue([historyRow]);
    renderComponent();
    expect(getSpy).toHaveBeenCalledOnce();
    expect(getSpy).toHaveBeenCalledWith(LS_KEY);
    expect(screen.getByText(historyRow.fileName)).toBeInTheDocument();
  });

  it('renders data rows with correct data from localStorage', () => {
    getSpy.mockReturnValue([historyRow]);
    renderComponent();
    expect(screen.getByText(historyRow.fileName)).toBeInTheDocument();
  });

  it('renders button "Очистить все" when localStorage is not empty', () => {
    getSpy.mockReturnValue([historyRow]);
    renderComponent();
    expect(screen.getByTestId('btn-clear')).toBeInTheDocument();
  });

  it('does not render button "Очистить все" when localStorage is empty', () => {
    getSpy.mockReturnValue([]);
    renderComponent();
    expect(screen.queryByTestId('btn-clear')).not.toBeInTheDocument();
  });

  it('does not render any data row when localStorage is empty', () => {
    getSpy.mockReturnValue([]);
    renderComponent();
    expect(screen.queryByTestId('data-row')).not.toBeInTheDocument();
  });

  it('removes success row from UI on delete', () => {
    getSpy.mockReturnValue([historyRow]);
    renderComponent();
    const deleteBtn = screen.getByTestId('btn-delete');
    expect(screen.queryByText(historyRow.fileName)).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(screen.queryByText(historyRow.fileName)).not.toBeInTheDocument();
  });

  it('removes data row from local storage on delete', () => {
    getSpy.mockReturnValue([historyRow]);
    renderComponent();
    const deleteBtn = screen.getByTestId('btn-delete');
    expect(screen.getByText(historyRow.fileName)).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(mockSet).toHaveBeenCalledWith(LS_KEY, []);
  });

  it('removes data row with error status from UI', () => {
    const errorEntry = {
      id: 1750432752050,
      fileName: 'report (7).csv',
      date: '2025-06-20T15:19:12.050Z',
      status: 'error',
    };
    getSpy.mockReturnValue([errorEntry]);
    renderComponent();
    const deleteBtn = screen.getByTestId('btn-delete');
    expect(screen.queryByText(historyRow.fileName)).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(screen.queryByText(historyRow.fileName)).not.toBeInTheDocument();
  });

  it('clears localStorage when "Очистить все" is clicked', () => {
    getSpy.mockReturnValue([historyRow]);
    renderComponent();
    const clearBtn = screen.getByTestId('btn-clear');
    fireEvent.click(clearBtn);
    expect(mockClear).toHaveBeenCalled();
  });

  it('renders the exact same amount of data rows as saved in localStorage', () => {
    const rows = [
      { ...historyRow, id: '1', fileName: '1.csv' },
      { ...historyRow, id: '2', fileName: '2.csv' },
      { ...historyRow, id: '3', fileName: '3.csv' },
    ];
    getSpy.mockReturnValue(rows);
    renderComponent();

    const renderedRows = screen.getAllByTestId('data-row');
    expect(renderedRows).toHaveLength(3);
    expect(screen.getByText('1.csv')).toBeInTheDocument();
    expect(screen.getByText('2.csv')).toBeInTheDocument();
    expect(screen.getByText('3.csv')).toBeInTheDocument();
  });

  it("button 'Сгенерировать больше' calls redirect to  route '/generation'", () => {
    renderComponent();
    const generateBtn = screen.getByTestId('btn-gen-more');
    fireEvent.click(generateBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/generation');
  });

  it('click on success row in UI opens modal with relevant highlights', () => {
    getSpy.mockReturnValue([historyRow]);
    const result = transformDataForRows(historyRow.result);
    renderComponent();
    const dataRow = screen.getByTestId('data-row');
    fireEvent.click(dataRow);
    expect(screen.getByTestId('show-modal')).toBeInTheDocument();
    result.forEach((r) => {
      expect(screen.getByText(r.title)).toBeInTheDocument();
      expect(screen.getByText(r.subtitle)).toBeInTheDocument();
    });
  });

  it('click on error row in UI does not open modal with relevant highlights', () => {
    const errorEntry = {
      id: 1750432752050,
      fileName: 'report (7).csv',
      date: '2025-06-20T15:19:12.050Z',
      status: 'error',
    };
    getSpy.mockReturnValue([errorEntry]);
    renderComponent();
    const dataRow = screen.getByTestId('data-row');
    fireEvent.click(dataRow);
    expect(screen.queryByTestId('show-modal')).not.toBeInTheDocument();
  });
});
