import { describe, expect, test } from 'vitest'
import { cx } from "../src/merge-classes"

describe('cx', () => {
	describe('Happy paths', () => {
		test('should concatenate string inputs with spaces', () => {
			expect(cx('foo', 'bar', 'baz')).toBe('foo bar baz');
		});

		test('should handle object with truthy values', () => {
			expect(cx({ foo: true, bar: true })).toBe('foo bar');
		});

		test('should combine strings and objects', () => {
			expect(cx('base', { active: true, disabled: false })).toBe('base active');
		});

		test('should filter out falsy object values', () => {
			expect(cx({ foo: true, bar: false, baz: true })).toBe('foo baz');
		});
	});

	describe('Boundary conditions', () => {
		test('should handle empty input', () => {
			expect(cx()).toBe('');
		});

		test('should handle null values', () => {
			expect(cx(null)).toBe('');
		});

		test('should handle undefined values', () => {
			expect(cx(undefined)).toBe('');
		});

		test('should handle boolean true', () => {
			expect(cx(true)).toBe('');
		});

		test('should handle boolean false', () => {
			expect(cx(false)).toBe('');
		});

		test('should handle empty string', () => {
			expect(cx('')).toBe('');
		});

		test('should handle empty object', () => {
			expect(cx({})).toBe('');
		});

		test('should handle object with all falsy values', () => {
      // @ts-expect-error May be passed by accident
			expect(cx({ foo: false, bar: null, baz: undefined, qux: 0 })).toBe('');
		});

		test('should handle very long strings', () => {
			const longString = 'a'.repeat(10000);
			expect(cx(longString)).toBe(longString);
		});

		test('should handle object with many keys', () => {
			const manyKeys = Object.fromEntries(
				Array.from({ length: 1000 }, (_, i) => [`key${i}`, true])
			);
			const result = cx(manyKeys);
			expect(result).toContain('key0');
			expect(result).toContain('key999');
		});
	});

	describe('Existence and cardinality', () => {
		test('should handle mix of null, undefined, and valid inputs', () => {
			expect(cx('foo', null, 'bar', undefined, 'baz')).toBe('foo bar baz');
		});

		test('should handle array with only falsy values', () => {
			expect(cx(null, undefined, false, true, '')).toBe('');
		});

		test('should handle single valid input among many invalid ones', () => {
			expect(cx(null, undefined, false, 'valid', true, '')).toBe('valid');
		});
	});

	describe('Input format conformance', () => {
		test('should handle strings with spaces', () => {
			expect(cx('foo bar', 'baz qux')).toBe('foo bar baz qux');
		});

		test('should handle strings with special characters', () => {
			expect(cx('foo-bar', 'baz_qux', 'test@example')).toBe('foo-bar baz_qux test@example');
		});

		test('should handle objects with special characters in keys', () => {
			expect(cx({ 'foo-bar': true, 'baz_qux': true, 'test@example': false })).toBe('foo-bar baz_qux');
		});

		test('should handle unicode strings', () => {
			expect(cx('🎉', 'café', 'naïve')).toBe('🎉 café naïve');
		});

		test('should handle objects with unicode keys', () => {
			expect(cx({ '🎉': true, 'café': true, 'naïve': false })).toBe('🎉 café');
		});
	});

	describe('Input ordering', () => {
		test('should maintain order of string inputs', () => {
			expect(cx('first', 'second', 'third')).toBe('first second third');
		});

		test('should maintain order when mixing strings and objects', () => {
			expect(cx('first', { middle: true }, 'last')).toBe('first middle last');
		});

		test('should maintain object key insertion order', () => {
			const obj = { c: true, a: true, b: true };
			expect(cx(obj)).toBe('c a b');
		});
	});

	describe('Range testing', () => {
		test('should handle maximum reasonable number of arguments', () => {
			const args = Array(100).fill('class');
			const result = cx(...args);
			expect(result).toBe('class '.repeat(100).trimEnd());
		});

		test('should handle single input', () => {
			expect(cx('single')).toBe('single');
		});

		test('should handle object with single key', () => {
			expect(cx({ single: true })).toBe('single');
		});
	});

	describe('Error conditions', () => {
		test('should handle objects with non-string keys gracefully', () => {
			const objWithNumberKey = { 123: true, 'string': true };
			expect(cx(objWithNumberKey)).toBe('123 string');
		});

		test('should handle objects with symbol keys', () => {
			const sym = Symbol('test');
			const objWithSymbol = { [sym]: true, 'normal': true };
      
			expect(cx(objWithSymbol)).toBe('normal');
		});

		test('should handle circular references in object values', () => {
			const circular: any = { self: true };
			circular.ref = circular;
			// This should not throw since we only check truthiness of values
			expect(() => cx(circular)).not.toThrow();
		});
	});

	describe('Cross-checking', () => {
		test('should produce same result with equivalent object and string inputs', () => {
			const stringResult = cx('foo', 'bar');
			const objectResult = cx({ foo: true, bar: true });

			// Both should contain same classes (ignoring trailing space differences)
			expect(stringResult.trim().split(' ').sort()).toEqual(
				objectResult.trim().split(' ').sort()
			);
		});

		test('should be equivalent when splitting combined operations', () => {
			const combined = cx('foo bar', { baz: true, qux: false });
			const split = cx('foo', 'bar', { baz: true }, { qux: false });
			expect(combined).toBe(split);
		});
	});

	describe('Inverse relationships', () => {
		test('should be able to reconstruct inputs from output (strings)', () => {
			const inputs = ['foo', 'bar', 'baz'];
			const result = cx(...inputs);
			const reconstructed = result.trim().split(' ');
			expect(reconstructed).toEqual(inputs);
		});

		test('should handle toggling object values', () => {
			const baseClasses = { foo: true, bar: false };
			const toggledClasses = { foo: false, bar: true };
			
			const result1 = cx(baseClasses);
			const result2 = cx(toggledClasses);
			
			expect(result1.includes('foo')).toBe(true);
			expect(result1.includes('bar')).toBe(false);
			expect(result2.includes('foo')).toBe(false);
			expect(result2.includes('bar')).toBe(true);
		});
	});

	describe('Performance characteristics', () => {
		test('should handle large inputs efficiently', () => {
      
      // Reasonably large test case
			const largeInputs = [
        ...Array(50).fill('test-class'),
				...Array(50).fill({ 'dynamic-class': true, 'inactive': false })
			];
			
      const start = performance.now();
			const result = cx(...largeInputs);
			const end = performance.now();
			
			expect(end - start).toBeLessThan(0.05); // 0.05ms threshold
			expect(result).toBeTruthy();
		});

		test('should have consistent performance across multiple calls', () => {
			const inputs = ['class1', { class2: true, class3: false }, 'class4'];
			const times: number[] = [];
			
			for (let i = 0; i < 10; i++) {
				const start = performance.now();
				cx(...inputs);
				const end = performance.now();
				times.push(end - start);
			}
			
			// All times should be reasonable (no major outliers)
			const maxTime = Math.max(...times);
			const minTime = Math.min(...times);
			expect(maxTime - minTime).toBeLessThan(0.05); // 0.05ms allowed difference
		});
	});

	describe('Isolation and repeatability', () => {
		test('should produce same result on multiple calls with same input', () => {
			const input = ['consistent', { test: true }];
			const result1 = cx(...input);
			const result2 = cx(...input);
			const result3 = cx(...input);
			
			expect(result1).toBe(result2);
			expect(result2).toBe(result3);
			expect(result1).toBe('consistent test');
		});

		test('should not maintain state between calls', () => {
			cx('first', 'call');
			const result = cx('second', 'call');
			expect(result).toBe('second call');
		});
	});

	describe('Output validation', () => {
		test('should never end with space when result is empty', () => {
			expect(cx()).toBe('');
			expect(cx(false, null, undefined)).toBe('');
		});

		test('should never contain double spaces', () => {
			const result = cx('test1', '', 'test2', { test3: true });
			expect(result).not.toMatch(/  /);
		});

		test('should contain only valid class names and spaces', () => {
			const result = cx('valid-class', { 'another_class': true });
			expect(result).toMatch(/^[\w\-_@🎉café naïve ]*$/);
		});
	});
});