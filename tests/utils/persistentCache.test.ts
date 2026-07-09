import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getCached, setCached } from '@/utils/persistentCache';

describe('persistentCache', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('returns undefined on a cache miss', () => {
		expect(getCached('ns', 'missing')).toBeUndefined();
	});

	it('stores and retrieves a value', () => {
		setCached('ns', 'key', { hello: 'world' });
		expect(getCached('ns', 'key')).toEqual({ hello: 'world' });
	});

	it('keeps namespaces and keys independent', () => {
		setCached('ns-a', 'key', 'a');
		setCached('ns-b', 'key', 'b');

		expect(getCached('ns-a', 'key')).toBe('a');
		expect(getCached('ns-b', 'key')).toBe('b');
	});

	it('ignores entries written under a different cache version', () => {
		localStorage.setItem(
			'tcg-copy:ns:key',
			JSON.stringify({ version: -1, value: 'stale' }),
		);

		expect(getCached('ns', 'key')).toBeUndefined();
	});

	it('ignores malformed entries instead of throwing', () => {
		localStorage.setItem('tcg-copy:ns:key', 'not-json');
		expect(getCached('ns', 'key')).toBeUndefined();
	});
});
