import { describe, expect, it } from 'vitest';
import { transformDate } from './transformDate';

describe('transformDate', () => {
  it('should transform day 0 to "1 января"', () => {
    expect(transformDate(0)).toBe('1 января');
  });

  it('should transform day 30 to "31 января"', () => {
    expect(transformDate(30)).toBe('31 января');
  });

  it('should transform day 31 to "1 февраля"', () => {
    expect(transformDate(31)).toBe('1 февраля');
  });

  it('should transform day 59 to "29 февраля"', () => {
    expect(transformDate(59)).toBe('29 февраля');
  });

  it('should transform day 60 to "1 марта"', () => {
    expect(transformDate(60)).toBe('1 марта');
  });

  it('should transform day 364 to "30 декабря"', () => {
    expect(transformDate(364)).toBe('30 декабря');
  });

  it('should transform day 365 to "31 декабря"', () => {
    expect(transformDate(365)).toBe('31 декабря');
  });

  it('should transform day 366 to "1 января"', () => {
    expect(transformDate(366)).toBe('1 января');
  });
});
