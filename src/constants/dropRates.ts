// Taux de drop pour chaque rareté (en %)
export const DROP_RATES = [
	72.5, // rareté 0
	20, // rareté 1
	5, // rareté 2
	2.1, // rareté 3
	0.3, // rareté 4
	0.1, // rareté 5
];

/**
 * Convertit les taux en seuils cumulés :
 * Ex : [72.5, 20, ...] → [72.5, 92.5, ...]
 */
export const DROP_THRESHOLDS = DROP_RATES.reduce<number[]>((acc, rate) => {
	const last = acc[acc.length - 1] ?? 0;
	acc.push(last + rate);
	return acc;
}, []);
