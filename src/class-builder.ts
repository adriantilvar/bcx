export type ClassValue =
	| string
	| Record<string, boolean>
	| boolean
	| null
	| undefined;

// TODO: Add conflict resolution, similar to twMerge
export const cn = (...inputs: ClassValue[]) => {
	let result = "";

	for (const input of inputs) {
		if (!input || typeof input === "boolean") continue;

		if (typeof input === "string") {
			result += `${input} `;
			continue;
		}

		for (const [key, value] of Object.entries(input)) {
			if (value) result += `${key} `;
		}
	}

	return result;
};
