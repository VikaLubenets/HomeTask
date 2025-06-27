import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CsvGeneratorSection } from './CsvGeneratorSection';
import type { GenStatus } from '../../store/useGeneratorStore';

let generateMock = vi.fn();
let clearMock = vi.fn();

let mockStore = {
  status: 'idle',
  fileUrl: '',
} as {
  status: GenStatus;
  fileUrl: string;
};

vi.mock('../../store/useGeneratorStore', () => ({
  useCsvGeneratorStore: () => ({
    get status() {
      return mockStore.status;
    },
    get fileUrl() {
      return mockStore.fileUrl;
    },
    generate: generateMock,
    clear: clearMock,
  }),
}));


const renderComponent = () => render(<CsvGeneratorSection />);

describe('CsvGeneratorSection on GenerationPage', () => {
  beforeEach(() => {
    generateMock = vi.fn();
    clearMock = vi.fn();
    mockStore = { status: 'idle', fileUrl: '' };
  });

  afterEach(() => {
    cleanup();
  });

  it('has btn to generate csv file', async () => {
    mockStore.status = 'idle';
    renderComponent();

    const btn = screen.getByTestId('idle-btn');
    expect(btn).toBeInTheDocument();
  });

  it('on click of btn request to api to generate a report is sending', async () => {
    mockStore.status = 'idle';
    renderComponent();

    const btn = screen.getByTestId('idle-btn');
    fireEvent.click(btn);

    expect(generateMock).toHaveBeenCalledWith({ size: 0.1 });
  });

  it('if error happens, user sees special error btn with info about error', async () => {
    mockStore.status = 'error';
    renderComponent();

    const errorBtn = await screen.findByTestId('error-btn');
    expect(errorBtn).toBeInTheDocument();
  });
});
