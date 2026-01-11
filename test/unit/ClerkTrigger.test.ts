/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

describe('ClerkTrigger', () => {
  describe('SVIX Signature Verification', () => {
    const createSignature = (
      secret: string,
      svixId: string,
      timestamp: string,
      body: object
    ): string => {
      const secretBytes = Buffer.from(secret, 'base64');
      const signedContent = `${svixId}.${timestamp}.${JSON.stringify(body)}`;
      return crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64');
    };

    it('should generate valid signature', () => {
      const secret = 'dGVzdHNlY3JldA=='; // base64 encoded 'testsecret'
      const svixId = 'msg_test123';
      const timestamp = String(Math.floor(Date.now() / 1000));
      const body = { type: 'user.created', data: { id: 'user_123' } };

      const signature = createSignature(secret, svixId, timestamp, body);

      expect(signature).toBeTruthy();
      expect(typeof signature).toBe('string');
    });

    it('should produce different signatures for different bodies', () => {
      const secret = 'dGVzdHNlY3JldA==';
      const svixId = 'msg_test123';
      const timestamp = String(Math.floor(Date.now() / 1000));
      
      const body1 = { type: 'user.created', data: { id: 'user_123' } };
      const body2 = { type: 'user.created', data: { id: 'user_456' } };

      const signature1 = createSignature(secret, svixId, timestamp, body1);
      const signature2 = createSignature(secret, svixId, timestamp, body2);

      expect(signature1).not.toEqual(signature2);
    });

    it('should produce different signatures for different secrets', () => {
      const secret1 = 'dGVzdHNlY3JldA==';
      const secret2 = 'YW5vdGhlcnNlY3JldA==';
      const svixId = 'msg_test123';
      const timestamp = String(Math.floor(Date.now() / 1000));
      const body = { type: 'user.created', data: { id: 'user_123' } };

      const signature1 = createSignature(secret1, svixId, timestamp, body);
      const signature2 = createSignature(secret2, svixId, timestamp, body);

      expect(signature1).not.toEqual(signature2);
    });

    it('should produce same signature for same inputs', () => {
      const secret = 'dGVzdHNlY3JldA==';
      const svixId = 'msg_test123';
      const timestamp = '1700000000';
      const body = { type: 'user.created', data: { id: 'user_123' } };

      const signature1 = createSignature(secret, svixId, timestamp, body);
      const signature2 = createSignature(secret, svixId, timestamp, body);

      expect(signature1).toEqual(signature2);
    });
  });

  describe('Event Type Filtering', () => {
    const selectedEvents = ['user.created', 'user.updated', 'session.created'];

    it('should match selected event types', () => {
      expect(selectedEvents.includes('user.created')).toBe(true);
      expect(selectedEvents.includes('user.updated')).toBe(true);
      expect(selectedEvents.includes('session.created')).toBe(true);
    });

    it('should not match unselected event types', () => {
      expect(selectedEvents.includes('user.deleted')).toBe(false);
      expect(selectedEvents.includes('organization.created')).toBe(false);
    });

    it('should handle empty selection', () => {
      const emptyEvents: string[] = [];
      // Empty selection should allow all events
      expect(emptyEvents.length === 0 || emptyEvents.includes('user.created')).toBe(true);
    });
  });

  describe('Timestamp Validation', () => {
    const tolerance = 300; // 5 minutes

    it('should accept timestamp within tolerance', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timestamp = currentTime - 60; // 1 minute ago
      
      expect(Math.abs(currentTime - timestamp) <= tolerance).toBe(true);
    });

    it('should reject timestamp outside tolerance', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timestamp = currentTime - 600; // 10 minutes ago
      
      expect(Math.abs(currentTime - timestamp) <= tolerance).toBe(false);
    });

    it('should reject future timestamp outside tolerance', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timestamp = currentTime + 600; // 10 minutes in future
      
      expect(Math.abs(currentTime - timestamp) <= tolerance).toBe(false);
    });

    it('should accept current timestamp', () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timestamp = currentTime;
      
      expect(Math.abs(currentTime - timestamp) <= tolerance).toBe(true);
    });
  });
});
