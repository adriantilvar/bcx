# better-variants

A lightweight utility for working with CSS classes and variants.

## Why does this exist?

If you're using Tailwind CSS, you’ve likely used `clsx`, `tailwind-merge`, or `class-variance-authority (cva)` as well. Possibly all three, given the popularity of shadcn/ui.

These tools have been serving me well, but I couldn't help thinking about simplifying them for a better DX and a leaner bundle size. That's the aim of `better-variants`: unify the strengths of `clsx`and `cva` with sensible constraints and streamlined API. 

## Features

- **Conditional Class Name Composition**: Merge classes conditionally, similar to `clsx`, with support for strings, objects, booleans, and nullish values
- **Variant Class Management**: Define and apply variants (e.g., styles for different states or sizes) with a simple, type-safe API inspired by `cva`
- **Type Safety**: Use TypeScript generics to ensure props match your config, providing auto-completion and error checking.
- **Required Defaults**: Variants and sizes must include a `default` key, ensuring predictable fallbacks without optional props.

## Installation

```bash
npm install better-variants
# or
pnpm add better-variants
# or
yarn add better-variants
```

## Usage

### Merging Classes with `cx`

Use `cx` to combine classes conditionally:

```typescript
const classes = cx("bg-gray-200", { "text-white": true }, "px-4", null);
// -> "bg-gray-200 text-white px-4"
```

### Creating Variants with `createVariants`

Define a config object with `base`, `variant`, and `size` properties:

```typescript
const button = createVariants({
  base: "inline-flex items-center justify-center rounded text-sm",
  variant: {
    default: "bg-gray-200 text-black",
    primary: "bg-blue-500 text-white",
    destructive: "bg-red-600 text-white",
  },
  size: {
    default: "h-9 px-4",
    sm: "h-8 px-3 text-xs",
  },
});
```

Apply the variant function with optional props:

```typescript
// Uses defaults
const defaultClasses = button(); 
// -> "inline-flex items-center justify-center rounded text-sm bg-gray-200 text-black h-9 px-4"

// Custom variant and size
button({ variant: "primary", size: "sm" }); 
// -> "inline-flex items-center justify-center rounded text-sm bg-blue-500 text-white h-8 px-3 text-xs"

// Only custom variant (uses default size)
button({ variant: "primary" }); 
// -> "inline-flex items-center justify-center rounded text-sm bg-blue-500 text-white h-9 px-4"

// Only custom size (uses default variant)
button({ size: "sm" }); 
// -> "inline-flex items-center justify-center rounded text-sm bg-gray-200 text-black h-8 px-3 text-xs"
```

### Type-Safe Props

The `VariantProps` utility extracts the expected prop types from your config:

```typescript
import { VariantProps } from "better-variants";

type ButtonProps = VariantProps<typeof button>;
// type ButtonProps = { variant?: "default" | "primary" | "destructive"; size?: "default" | "sm" }

```

### Button Component Example

```tsx
import { createVariants, type VariantProps } from "better-variants";
import { cn } from "@/lib/utils";

const buttonVariants = createVariants({
  base: "inline-flex items-center justify-center rounded text-sm font-medium transition-colors focus:outline-none",
  variant: {
    default: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
  },
});

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

const Button = ({ className, variant, size, children, ...props }: ButtonProps) => {
  return (
    <button className={cn(className, buttonVariants({ variant, size })} {...props}>
      {children}
    </button>
  );
};

export { Button, buttonVariants };
```

Usage:
```tsx
<Button variant="primary" size="sm">Submit</Button>
```

## API Reference

### `cx(...inputs: ClassValue[])`

- **Parameters**: Variable number of `string`, `Record<string, boolean>`, `boolean`, `null`, `undefined`.
- **Returns**: A string of space-separated class names.
- **Purpose**: Merges classes, ignoring falsy or non-true values.

### `createVariants<T extends TConfig>(config: T)`

- **Parameters**: 
  - `config`: An object with `base`, `variant`, and `size` properties.
    - `base`:  Classes that will always be applied.
    - `variant`: Variant-specific classes. Must include a 'default' which is used as a fallback.
    - `size`: Size-specific classes. Must include a 'default' which is used as a fallback.
- **Returns**: A function that optionally takes `variant` and `size` props and returns a combined class string.
- **Purpose**: Generates a variant selection function with type-safe props.

### `VariantProps<T>`

- **Parameters**: A function returned by `createVariants`
- **Returns**: The inferred `variant` and `size` types
- **Purpose**: Type helper for component prop definitions

## Limitations

- ❌ No compound variants supported (e.g., `variant=primary` + `size=lg` → add special class)
- 🔒 Configuration is limited to `base`, `variant`, and `size` (no arbitrary keys for now)

Your **Contributing** section is solid in tone and intent, but it could be a little more specific and structured to encourage action and follow open source norms. Here's your original:

> ## Contributing
>
> Feedback and contributions are very much welcome. If you found a bug or have a feature request, feel free to open an issue or submit a PR.

This is perfectly acceptable for a small utility, but here's an improved version that maintains your casual tone while adding a bit of structure:

---

## Contributing

Contributions are welcome! If you:

* Found a bug
* Have a feature request
* Want to improve the docs
* Or just feel like helping out

Feel free to open an issue or submit a PR.

Before contributing, please:

* Check open issues and discussions to avoid duplicates
* Keep PRs focused and minimal
* Follow existing coding and documentation style

Thanks for helping make `better-variants` better!