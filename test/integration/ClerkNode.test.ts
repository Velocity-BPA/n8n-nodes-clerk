/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for n8n-nodes-clerk
 * 
 * These tests verify the node structure and configuration.
 * To run full integration tests with live API calls, set:
 *   CLERK_SECRET_KEY=sk_test_xxx
 * 
 * Run with: npm run test
 */

import { ClerkTrigger } from '../../nodes/Clerk/ClerkTrigger.node';

describe('Clerk Integration Tests', () => {
  describe('ClerkTrigger Node', () => {
    let clerkTrigger: ClerkTrigger;

    beforeEach(() => {
      clerkTrigger = new ClerkTrigger();
    });

    it('should have correct description properties', () => {
      expect(clerkTrigger.description.displayName).toBe('Clerk Trigger');
      expect(clerkTrigger.description.name).toBe('clerkTrigger');
      expect(clerkTrigger.description.group).toContain('trigger');
    });

    it('should have webhook configuration', () => {
      expect(clerkTrigger.description.webhooks).toBeDefined();
      expect(clerkTrigger.description.webhooks?.length).toBeGreaterThan(0);
      expect(clerkTrigger.description.webhooks?.[0].httpMethod).toBe('POST');
    });

    it('should require clerkApi credentials', () => {
      expect(clerkTrigger.description.credentials).toBeDefined();
      expect(clerkTrigger.description.credentials?.[0].name).toBe('clerkApi');
      expect(clerkTrigger.description.credentials?.[0].required).toBe(true);
    });

    it('should have events property', () => {
      const eventsProperty = clerkTrigger.description.properties.find(
        (p) => p.name === 'events'
      );
      expect(eventsProperty).toBeDefined();
      expect(eventsProperty?.type).toBe('multiOptions');
      expect(eventsProperty?.required).toBe(true);
    });

    it('should have webhookSecret property', () => {
      const secretProperty = clerkTrigger.description.properties.find(
        (p) => p.name === 'webhookSecret'
      );
      expect(secretProperty).toBeDefined();
      expect(secretProperty?.type).toBe('string');
      expect(secretProperty?.typeOptions?.password).toBe(true);
    });

    it('should have all user event types', () => {
      const eventsProperty = clerkTrigger.description.properties.find(
        (p) => p.name === 'events'
      );
      const options = eventsProperty?.options as Array<{ value: string }>;
      const eventValues = options?.map((o) => o.value) || [];

      expect(eventValues).toContain('user.created');
      expect(eventValues).toContain('user.updated');
      expect(eventValues).toContain('user.deleted');
    });

    it('should have all organization event types', () => {
      const eventsProperty = clerkTrigger.description.properties.find(
        (p) => p.name === 'events'
      );
      const options = eventsProperty?.options as Array<{ value: string }>;
      const eventValues = options?.map((o) => o.value) || [];

      expect(eventValues).toContain('organization.created');
      expect(eventValues).toContain('organization.updated');
      expect(eventValues).toContain('organization.deleted');
    });

    it('should have all session event types', () => {
      const eventsProperty = clerkTrigger.description.properties.find(
        (p) => p.name === 'events'
      );
      const options = eventsProperty?.options as Array<{ value: string }>;
      const eventValues = options?.map((o) => o.value) || [];

      expect(eventValues).toContain('session.created');
      expect(eventValues).toContain('session.ended');
      expect(eventValues).toContain('session.removed');
    });

    it('should have webhook methods defined', () => {
      expect(clerkTrigger.webhookMethods).toBeDefined();
      expect(clerkTrigger.webhookMethods.default).toBeDefined();
      expect(typeof clerkTrigger.webhookMethods.default.checkExists).toBe('function');
      expect(typeof clerkTrigger.webhookMethods.default.create).toBe('function');
      expect(typeof clerkTrigger.webhookMethods.default.delete).toBe('function');
    });
  });

  describe('Node Structure Validation', () => {
    it('should export ClerkTrigger class', () => {
      expect(ClerkTrigger).toBeDefined();
      expect(typeof ClerkTrigger).toBe('function');
    });

    it('should be instantiable', () => {
      const trigger = new ClerkTrigger();
      expect(trigger).toBeInstanceOf(ClerkTrigger);
    });
  });
});
