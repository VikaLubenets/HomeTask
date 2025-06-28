import '@testing-library/jest-dom/vitest';
import { screen } from '@testing-library/react';
import { renderAtRoute } from '../util/test-utils';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App routes', () => {
  it('renders analytics page at "/"', () => {
    renderAtRoute(<App />, { route: '/' });
    expect(screen.getByTestId('analitics-page')).toBeInTheDocument();
  });

  it('renders generator page at "/generation"', () => {
    renderAtRoute(<App />, { route: '/generation' });
    expect(screen.getByTestId('generator-page')).toBeInTheDocument();
  });

  it('renders history page at "/history"', () => {
    renderAtRoute(<App />, { route: '/history' });
    expect(screen.getByTestId('history-page')).toBeInTheDocument();
  });
})

