import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { HighlightsSection } from './HighlightsSection';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { transformDataForRows } from '../../services/transformDataForRows';
import type { Mock } from 'vitest';

vi.mock('../../store/useAnalyticsStore');
vi.mock('../../services/transformDataForRows', () => {
  return {
    transformDataForRows: vi.fn(),
  };
});

const mockUseAnalyticsStore = useAnalyticsStore as unknown as Mock;
const mockTransformDataForRows = transformDataForRows as Mock;

const testData = {
  total_spend_galactic: 1432542813.5,
  rows_affected: 2862809,
  less_spent_at: 166,
  big_spent_at: 302,
  less_spent_value: 3759426.5,
  big_spent_value: 4140109,
  average_spend_galactic: 500.3976211825518,
  big_spent_civ: 'monsters',
  less_spent_civ: 'humans',
};

const transformedMock = [
  { title: 'Total Spend', subtitle: '1,432,542,813.5' },
  { title: 'Biggest Spend Civilization', subtitle: 'monsters' },
];

describe('HighlightsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders placeholder when no result is available', () => {
    mockUseAnalyticsStore.mockReturnValue(null);

    render(<HighlightsSection />);
    expect(screen.getByText('Здесь')).toBeInTheDocument();
    expect(screen.getByText('появятся хайлайты')).toBeInTheDocument();
  });

  it('renders transformed rows when result exists', () => {
    mockUseAnalyticsStore.mockReturnValue(testData);
    mockTransformDataForRows.mockReturnValue(transformedMock);

    render(<HighlightsSection />);
    expect(transformDataForRows).toHaveBeenCalledWith(testData);

    transformedMock.forEach((row) => {
      expect(screen.getByText(row.title)).toBeInTheDocument();
      expect(screen.getByText(row.subtitle)).toBeInTheDocument();
    });
  });
});
