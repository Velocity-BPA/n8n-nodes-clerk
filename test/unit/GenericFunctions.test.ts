/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { parseMetadata, cleanObject, toSnakeCase, convertKeysToSnakeCase } from '../../nodes/Clerk/GenericFunctions';

describe('GenericFunctions', () => {
  describe('parseMetadata', () => {
    it('should parse valid JSON string', () => {
      const result = parseMetadata('{"key": "value", "number": 42}');
      expect(result).toEqual({ key: 'value', number: 42 });
    });

    it('should return undefined for empty string', () => {
      const result = parseMetadata('');
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      const result = parseMetadata(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for invalid JSON', () => {
      const result = parseMetadata('not valid json');
      expect(result).toBeUndefined();
    });

    it('should handle nested objects', () => {
      const result = parseMetadata('{"nested": {"key": "value"}}');
      expect(result).toEqual({ nested: { key: 'value' } });
    });

    it('should handle arrays', () => {
      const result = parseMetadata('{"items": [1, 2, 3]}');
      expect(result).toEqual({ items: [1, 2, 3] });
    });

    it('should handle boolean values', () => {
      const result = parseMetadata('{"active": true, "disabled": false}');
      expect(result).toEqual({ active: true, disabled: false });
    });

    it('should handle null values in JSON', () => {
      const result = parseMetadata('{"value": null}');
      expect(result).toEqual({ value: null });
    });
  });

  describe('cleanObject', () => {
    it('should remove undefined values', () => {
      const result = cleanObject({ a: 1, b: undefined, c: 'test' });
      expect(result).toEqual({ a: 1, c: 'test' });
    });

    it('should remove null values', () => {
      const result = cleanObject({ a: 1, b: null, c: 'test' });
      expect(result).toEqual({ a: 1, c: 'test' });
    });

    it('should remove empty string values', () => {
      const result = cleanObject({ a: 1, b: '', c: 'test' });
      expect(result).toEqual({ a: 1, c: 'test' });
    });

    it('should keep false values', () => {
      const result = cleanObject({ a: false, b: undefined });
      expect(result).toEqual({ a: false });
    });

    it('should keep zero values', () => {
      const result = cleanObject({ a: 0, b: undefined });
      expect(result).toEqual({ a: 0 });
    });

    it('should keep empty arrays', () => {
      const result = cleanObject({ a: [], b: undefined });
      expect(result).toEqual({ a: [] });
    });

    it('should return empty object for all undefined values', () => {
      const result = cleanObject({ a: undefined, b: null, c: '' });
      expect(result).toEqual({});
    });
  });

  describe('toSnakeCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(toSnakeCase('firstName')).toBe('first_name');
      expect(toSnakeCase('lastName')).toBe('last_name');
    });

    it('should handle multiple uppercase letters', () => {
      expect(toSnakeCase('emailAddress')).toBe('email_address');
      expect(toSnakeCase('phoneNumber')).toBe('phone_number');
    });

    it('should return lowercase for already lowercase', () => {
      expect(toSnakeCase('name')).toBe('name');
    });

    it('should handle empty string', () => {
      expect(toSnakeCase('')).toBe('');
    });

    it('should handle consecutive uppercase', () => {
      expect(toSnakeCase('userID')).toBe('user_i_d');
    });
  });

  describe('convertKeysToSnakeCase', () => {
    it('should convert all keys to snake_case', () => {
      const result = convertKeysToSnakeCase({
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      });
      expect(result).toEqual({
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'john@example.com',
      });
    });

    it('should handle empty object', () => {
      const result = convertKeysToSnakeCase({});
      expect(result).toEqual({});
    });

    it('should preserve values', () => {
      const result = convertKeysToSnakeCase({
        userId: 123,
        isActive: true,
        tags: ['a', 'b'],
      });
      expect(result).toEqual({
        user_id: 123,
        is_active: true,
        tags: ['a', 'b'],
      });
    });
  });
});
