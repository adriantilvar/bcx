import { cx, type ClassValue } from "./class-builder";

export type VariantProps<T> = 
  T extends (props: infer P) => string ? P : never;

type TConfig = {
	base: ClassValue;
	variant: { default: ClassValue } & Record<string, ClassValue>;
	size: { default: ClassValue } & Record<string, ClassValue>;
};

type TSelectionProps<S extends TConfig> = Partial<{
	[K in keyof Omit<TConfig, "base">]: keyof S[K];
}>;

export const createVariants = <T extends TConfig>(config: T) => (props: TSelectionProps<T>) =>  cx(
			config.base,
			config.variant[props && props.variant ? props.variant : "default"],
			config.size[props && props.size ? props.size : "default"],
);