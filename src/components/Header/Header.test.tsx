import { screen, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithRouter } from '../../util/test-utils';
import { Header } from './Header';

const renderComponent = () => renderWithRouter(<Header />);

describe('Header navigation (via navigate)', () => {

  afterEach(() => {
    cleanup();
  });

  it('link navigate to /generation on CSV Генератор link click', () => {
    renderComponent();
    const generatorLink = screen.getByText('CSV Генератор') as HTMLAnchorElement;
    expect(generatorLink.href).toContain('/generation');
  });

  it('link navigate to /history on История link click', () => {
    renderComponent();
    const generatorLink = screen.getByText('История') as HTMLAnchorElement;
    expect(generatorLink.href).toContain('/history');
  });

  it('link navigate to / on CSV Аналитик link click', () => {
    renderComponent();
    const generatorLink = screen.getByText('CSV Аналитик') as HTMLAnchorElement;
    expect(generatorLink.href).toContain('/');
  });
});
