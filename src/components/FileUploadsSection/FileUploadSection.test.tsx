import '@testing-library/jest-dom/vitest';
import { screen, cleanup, render, fireEvent } from '@testing-library/react';
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { FileUploadSection } from './FileUploadsSection';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { LStorage } from '../../services/storage';

vi.mock('../../store/useAnalyticsStore');

const selectFile = vi.fn();
const clear = vi.fn();
const send = vi.fn();
const mockSet = vi.fn();

const renderComponent = () => render(<FileUploadSection />);

const createFile = (name: string, type: string) =>
  new File(['a,b'], name, { type });

describe('FileUploadSection', () => {
  beforeAll(() => {
    global.DataTransfer = class {
      files: File[] = [];
      items = {
        add: (file: File) => this.files.push(file),
        remove: () => {},
        clear: () => {},
      };
    } as any;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (useAnalyticsStore as any).mockReturnValue({
      file: null,
      status: 'general',
      selectFile,
      clear,
      send,
    });
    vi.spyOn(LStorage, 'set').mockImplementation(mockSet);
  });

  afterEach(() => {
    cleanup();
  });

  it('drag&drop works to load csv file', () => {
    const file = createFile('file.csv', 'text/csv');
    renderComponent();
    const dropArea = screen.getByTestId('drop-area');

    fireEvent.dragEnter(dropArea, {
      dataTransfer: new DataTransfer(),
    });

    fireEvent.drop(dropArea, {
      dataTransfer: { files: [file] },
    });

    expect(selectFile).toHaveBeenCalledWith(file);
  });

  it('drag&drop ignores non-csv file and shows alert', () => {
    const file = createFile('not-an-excel.txt', 'text/plain');
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderComponent();

    const dropArea = screen.getByTestId('drop-area');

    fireEvent.dragEnter(dropArea, {
      dataTransfer: new DataTransfer(),
    });

    fireEvent.drop(dropArea, {
      dataTransfer: { files: [file] },
    });

    expect(clear).toHaveBeenCalled();
    expect(selectFile).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Пожалуйста, загрузите файл в формате .csv'
    );
  });

  it('there is a button to upload file in default state', () => {
    renderComponent();
    expect(screen.getByTestId('upload-input')).toBeInTheDocument();
    expect(screen.getByText('Загрузить файл')).toBeInTheDocument();
    expect(screen.getByText('или перетащите сюда')).toBeInTheDocument();
  });

  it('a button to upload file is restricted to csv only extentions', () => {
    renderComponent();
    const input = screen.getByTestId('upload-input') as HTMLInputElement;
    expect(input.accept).toBe('.csv');
  });

  it('when csv file is uploaded there is an active btn "отправить"', () => {
    (useAnalyticsStore as any).mockReturnValue({
      file: createFile('file.csv', 'text/csv'),
      status: 'upload',
      selectFile,
      clear,
      send,
    });
    renderComponent();
    expect(screen.getByTestId('send-btn')).toBeEnabled();
    expect(screen.getByText('файл загружен!')).toBeInTheDocument();
  });

  it('when csv file is not uploaded there is a disabled btn "отправить"', () => {
    renderComponent();
    expect(screen.getByTestId('send-btn')).toBeDisabled();
  });

  it('upon click on btn "отправить" sends aggregate api request', () => {
    (useAnalyticsStore as any).mockReturnValue({
      file: createFile('file.csv', 'text/csv'),
      status: 'upload',
      selectFile,
      clear,
      send,
    });
    renderComponent();
    fireEvent.click(screen.getByTestId('send-btn'));
    expect(send).toHaveBeenCalled();
  });

  it('during the request while data is reading there is a loader pf progress in button', () => {
    (useAnalyticsStore as any).mockReturnValue({
      file: createFile('file.csv', 'text/csv'),
      status: 'parcing',
      selectFile,
      clear,
      send,
    });
    renderComponent();
    expect(screen.queryByTestId('send-btn')).not.toBeInTheDocument();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText('идёт парсинг файла')).toBeInTheDocument();
  });

  it('in case of request error there is a error button and no highlights', () => {
    (useAnalyticsStore as any).mockReturnValue({
      file: createFile('file.csv', 'text/csv'),
      status: 'error',
      selectFile,
      clear,
      send,
    });
    renderComponent();
    expect(screen.queryByTestId('send-btn')).not.toBeInTheDocument();
    expect(screen.getByTestId('upload-input')).toBeDisabled();
    expect(screen.getByText('упс, не то...')).toBeInTheDocument();
  });

  it('upon click on clear btn there is default component of hilights with no highlights and no file with default btn', () => {
    (useAnalyticsStore as any).mockReturnValue({
      file: createFile('file.csv', 'text/csv'),
      status: 'ready',
      selectFile,
      clear,
      send,
    });
    renderComponent();
    fireEvent.click(screen.getByTestId('clear-btn'));
    expect(clear).toHaveBeenCalled();
  });
});
