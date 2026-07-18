// Bump when a cached shape changes so stale entries are ignored instead of
// being deserialized into code that no longer expects them.
const CACHE_VERSION = 1;

interface CacheEnvelope<T> {
	version: number;
	value: T;
}

const buildKey = (namespace: string, key: string): string =>
	`tcg-copy:${namespace}:${key}`;

/**
 * Reads a value previously stored with `setCached` for the given namespace/key.
 * Returns `undefined` on a cache miss, version mismatch, or if localStorage is
 * unavailable (private browsing, disabled storage, etc) — callers should treat
 * this the same as a miss and fall through to fetching fresh data.
 */
export const getCached = <T>(namespace: string, key: string): T | undefined => {
	try {
		const raw = localStorage.getItem(buildKey(namespace, key));
		if (!raw) return undefined;

		const envelope = JSON.parse(raw) as CacheEnvelope<T>;
		if (envelope.version !== CACHE_VERSION) return undefined;

		return envelope.value;
	} catch {
		return undefined;
	}
};

/**
 * Persists a value under the given namespace/key. Best-effort: failures
 * (quota exceeded, storage disabled) are swallowed since this is a cache,
 * not a source of truth.
 */
export const setCached = <T>(
	namespace: string,
	key: string,
	value: T,
): void => {
	try {
		const envelope: CacheEnvelope<T> = { version: CACHE_VERSION, value };
		localStorage.setItem(buildKey(namespace, key), JSON.stringify(envelope));
	} catch {
		// ignore — cache is best-effort
	}
};
