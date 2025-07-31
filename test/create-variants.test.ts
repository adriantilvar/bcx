import { describe, expect, test } from "vitest";
import { createVariants, type VariantProps } from "../src/create-variants";

const basicConfig = {
  base: "btn",
  variant: {
    default: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  },
  size: {
    default: "btn-md",
    sm: "btn-sm",
    lg: "btn-lg",
  },
};

describe("createVariants", () => {
  describe("happy path scenarios", () => {
    test("should create variant function with basic config", () => {
      const variants = createVariants(basicConfig);
      expect(typeof variants).toBe("function");
    });

    test("should return string when variant function is called", () => {
      const variants = createVariants(basicConfig);
      const result = variants({});
      expect(typeof result).toBe("string");
    });

    test("should use defaults when no props provided", () => {
      const variants = createVariants(basicConfig);
      const result = variants({});
      expect(result).toBe("btn btn-primary btn-md");
    });

    test("should apply specified variant", () => {
      const variants = createVariants(basicConfig);
      const result = variants({ variant: "secondary" });
      expect(result).toBe("btn btn-secondary btn-md");
    });

    test("should apply specified size", () => {
      const variants = createVariants(basicConfig);
      const result = variants({ size: "lg" });
      expect(result).toBe("btn btn-primary btn-lg");
    });

    test("should apply both variant and size", () => {
      const variants = createVariants(basicConfig);
      const result = variants({ variant: "ghost", size: "sm" });
      expect(result).toBe("btn btn-ghost btn-sm");
    });
  });

  describe("boundary conditions", () => {
    test("should handle empty config objects", () => {
      const emptyConfig = {
        base: "",
        variant: { default: "" },
        size: { default: "" },
      };
      const variants = createVariants(emptyConfig);
      const result = variants({});
      expect(result).toBe("");
    });

    test("should handle minimal config with only defaults", () => {
      const minimalConfig = {
        base: "base",
        variant: { default: "var-default" },
        size: { default: "size-default" },
      };
      const variants = createVariants(minimalConfig);
      const result = variants({});
      expect(result).toBe("base var-default size-default");
    });

    test("should handle config with many variants", () => {
      const config = {
        base: "component",
        variant: {
          default: "var1",
          v2: "var2",
          v3: "var3",
          v4: "var4",
          v5: "var5",
        },
        size: {
          default: "size1",
          s2: "size2",
          s3: "size3",
        },
      };
      const variants = createVariants(config);
      const result = variants({ variant: "v4", size: "s3" });
      expect(result).toBe("component var4 size3");
    });
  });

  describe("null/undefined handling", () => {
    test("should handle undefined props object", () => {
      const variants = createVariants(basicConfig);
      const result = variants(undefined as any);
      expect(result).toBe("btn btn-primary btn-md");
    });

    test("should handle null variant property", () => {
      const variants = createVariants(basicConfig);
      const result = variants({ variant: null as any });
      expect(result).toBe("btn btn-primary btn-md");
    });

    test("should handle undefined variant property", () => {
      const variants = createVariants(basicConfig);
      const result = variants({ variant: undefined });
      expect(result).toBe("btn btn-primary btn-md");
    });

    test("should handle empty object props", () => {
      const variants = createVariants(basicConfig);
      const result = variants({});
      expect(result).toBe("btn btn-primary btn-md");
    });
  });

  describe("error conditions", () => {
    test("should handle non-existent variant gracefully", () => {
      const variants = createVariants(basicConfig);
      const result = variants({ variant: "nonexistent" as any });
      expect(result).toBe("btn btn-md");
    });

    test("should handle non-existent size gracefully", () => {
      const variants = createVariants(basicConfig);
      const result = variants({ size: "nonexistent" as any });
      expect(result).toBe("btn btn-primary");
    });

    test("should handle config with null/undefined values", () => {
      const configWithNulls = {
        base: null as any,
        variant: {
          default: undefined as any,
          test: "test-variant",
        },
        size: {
          default: "default-size",
          null: null as any,
        },
      };
      const variants = createVariants(configWithNulls);
      const result = variants({ variant: "test", size: "null" });
      expect(result).toBe("test-variant");
    });
  });

  describe("input format conformance", () => {
    test("should work with string base class", () => {
      const config = {
        base: "string-base",
        variant: { default: "default-variant" },
        size: { default: "default-size" },
      };
      const variants = createVariants(config);
      const result = variants({});
      expect(result).toBe("string-base default-variant default-size");
    });

    test("should work with object-style ClassValue", () => {
      const config = {
        base: { "base-class": true },
        variant: {
          default: { "default-variant": true },
          active: { "active-variant": true, extra: false },
        },
        size: { default: "size" },
      };
      const variants = createVariants(config);
      const result = variants({ variant: "active" });
      expect(result).toBe("base-class active-variant size");
    });
  });

  describe("cross-validation", () => {
    test("should produce consistent results for same inputs", () => {
      const variants = createVariants(basicConfig);
      const result1 = variants({ variant: "secondary", size: "lg" });
      const result2 = variants({ variant: "secondary", size: "lg" });
      expect(result1).toBe(result2);
    });

    test("should produce different results for different inputs", () => {
      const variants = createVariants(basicConfig);
      const result1 = variants({ variant: "secondary" });
      const result2 = variants({ variant: "ghost" });
      expect(result1).not.toBe(result2);
    });

    test("should maintain order independence for same logical inputs", () => {
      const variants = createVariants(basicConfig);
      const result1 = variants({ variant: "ghost", size: "sm" });
      const result2 = variants({ size: "sm", variant: "ghost" });
      expect(result1).toBe(result2);
      expect(result1).toBe("btn btn-ghost btn-sm");
    });
  });

  describe("range and edge cases", () => {
    test("should handle single character strings", () => {
      const config = {
        base: "a",
        variant: { default: "b", x: "y" },
        size: { default: "c", z: "w" },
      };
      const variants = createVariants(config);
      const result = variants({ variant: "x", size: "z" });
      expect(result).toBe("a y w");
    });

    test("should handle very long class names", () => {
      const longName =
        "very-long-class-name-that-goes-on-and-on-with-many-hyphens-and-descriptive-words";
      const config = {
        base: longName,
        variant: { default: `${longName}-variant` },
        size: { default: `${longName}-size` },
      };
      const variants = createVariants(config);
      const result = variants({});
      expect(result).toBe(`${longName} ${longName}-variant ${longName}-size`);
    });
  });

  describe("config structure variations", () => {
    test("should work with numeric keys", () => {
      const config = {
        base: "base",
        variant: { default: "var-default", "1": "var-1", "2": "var-2" },
        size: { default: "size-default", "10": "size-10" },
      };
      const variants = createVariants(config);
      const result = variants({ variant: "1", size: "10" });
      expect(result).toBe("base var-1 size-10");
    });

    test("should work with special character keys", () => {
      const config = {
        base: "base",
        variant: {
          default: "var-default",
          "with-dash": "var-dash",
          with_underscore: "var-underscore",
          "with.dot": "var-dot",
        },
        size: { default: "size-default" },
      };
      const variants = createVariants(config);
      expect(variants({ variant: "with-dash" })).toBe(
        "base var-dash size-default"
      );
      expect(variants({ variant: "with_underscore" })).toBe(
        "base var-underscore size-default"
      );
      expect(variants({ variant: "with.dot" })).toBe(
        "base var-dot size-default"
      );
    });
  });

  describe("inverse relationships", () => {
    test("should maintain consistent mapping between keys and values", () => {
      const variants = createVariants(basicConfig);
      const variantKeys = Object.keys(basicConfig.variant);
      const sizeKeys = Object.keys(basicConfig.size);

      variantKeys.forEach((vKey) => {
        sizeKeys.forEach((sKey) => {
          const result = variants({
            variant: vKey as any,
            size: sKey as any,
          });
          const expectedVariant =
            vKey === "default"
              ? basicConfig.variant.default
              : basicConfig.variant[vKey];
          const expectedSize =
            sKey === "default"
              ? basicConfig.size.default
              : basicConfig.size[sKey];
          const expected = ["btn", expectedVariant, expectedSize]
            .filter(Boolean)
            .join(" ");
          expect(result).toBe(expected);
        });
      });
    });
  });
});

describe("VariantProps type extraction", () => {
  test("should extract correct prop types from variant function", () => {
    const variants = createVariants(basicConfig);
    type Props = VariantProps<typeof variants>;
    const validProps: Props = {
      variant: "secondary",
      size: "lg",
    };
    const result = variants(validProps);
    expect(result).toBe("btn btn-secondary btn-lg");
  });

  test("should work with minimal config types", () => {
    const minimalVariants = createVariants({
      base: "base",
      variant: { default: "var" },
      size: { default: "size" },
    });
    type MinimalProps = VariantProps<typeof minimalVariants>;
    const props: MinimalProps = {};
    const result = minimalVariants(props);
    expect(result).toBe("base var size");
  });
});

describe("temporal consistency", () => {
  test("should produce same results across time", async () => {
    const variants = createVariants(basicConfig);
    const props = { variant: "ghost", size: "sm" } as const;
    const result1 = variants(props);
    await new Promise((resolve) => setTimeout(resolve, 50));
    const result2 = variants(props);
    expect(result1).toBe(result2);
  });

  test("should be stateless between calls", () => {
    const variants = createVariants(basicConfig);
    const result1 = variants({ variant: "secondary" });
    const result2 = variants({ size: "lg" });
    const result3 = variants({ variant: "ghost", size: "sm" });
    const result4 = variants({});

    expect(result1).toBe("btn btn-secondary btn-md");
    expect(result2).toBe("btn btn-primary btn-lg");
    expect(result3).toBe("btn btn-ghost btn-sm");
    expect(result4).toBe("btn btn-primary btn-md");
  });
});
