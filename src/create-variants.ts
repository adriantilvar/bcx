import { cn, type ClassValue } from "./class-builder";

type TConfig = {
	base: ClassValue;
	variant: { default: ClassValue } & Record<string, ClassValue>;
	size: { default: ClassValue } & Record<string, ClassValue>;
};

type TSelectionProps<S extends TConfig> = Partial<{
	[K in keyof Omit<TConfig, "base">]: keyof S[K];
}>;

export const createVariants = <T extends TConfig>(config: T) => (props: TSelectionProps<T>) =>
		cn(
			config.base,
			config.variant[props.variant ?? "default"],
			config.size[props.size ?? "default"],
		);

export type VariantProps<T> = 
  T extends (props: infer P) => string ? P : never;