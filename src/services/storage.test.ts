import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { CustomStorage } from './storage';

describe('CustomStorage tests of', () => {
  let storage: CustomStorage;
  const key = 'key';
  const value = { text: 'Hello, world and sri!' };

  beforeAll(() => {
    localStorage.clear();
    storage = new CustomStorage('localStorage');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('localStorage should set an item', () => {
    const spySet = vi.spyOn(Storage.prototype, 'setItem');
    storage.set(key, value);
    expect(spySet).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('localStorage should get an item', () => {
    const spyGet = vi.spyOn(Storage.prototype, 'getItem');
    spyGet.mockReturnValueOnce(JSON.stringify(value));
    const result = storage.get<typeof value>(key);
    expect(result).toEqual(value);
    expect(spyGet).toHaveBeenCalledWith(key);
  });

  it('localStorage should remove an item', () => {
    const spyRemove = vi.spyOn(Storage.prototype, 'removeItem');
    storage.remove(key);
    expect(spyRemove).toHaveBeenCalledWith(key);
  });

  it('localStorage should clear all items', () => {
    const spyClear = vi.spyOn(Storage.prototype, 'clear');
    storage.clear();
    expect(spyClear).toHaveBeenCalled();
  });

  it('should return null on invalid JSON', () => {
    const spyGet = vi.spyOn(Storage.prototype, 'getItem');
    const key = 'broken';
    spyGet.mockReturnValueOnce('invalid-json');
    const result = storage.get(key);
    expect(result).toBeNull();
  });
});
