/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IDataObject,
  IHookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookFunctions,
  IWebhookResponseData,
} from 'n8n-workflow';
import * as crypto from 'crypto';

export class ClerkTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Clerk Trigger',
    name: 'clerkTrigger',
    icon: 'file:clerk.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Starts workflow when Clerk events occur',
    defaults: {
      name: 'Clerk Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'clerkApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        description: 'The events to listen for',
        options: [
          {
            name: 'Email Created',
            value: 'email.created',
          },
          {
            name: 'Organization Created',
            value: 'organization.created',
          },
          {
            name: 'Organization Deleted',
            value: 'organization.deleted',
          },
          {
            name: 'Organization Invitation Accepted',
            value: 'organizationInvitation.accepted',
          },
          {
            name: 'Organization Invitation Created',
            value: 'organizationInvitation.created',
          },
          {
            name: 'Organization Invitation Revoked',
            value: 'organizationInvitation.revoked',
          },
          {
            name: 'Organization Membership Created',
            value: 'organizationMembership.created',
          },
          {
            name: 'Organization Membership Deleted',
            value: 'organizationMembership.deleted',
          },
          {
            name: 'Organization Membership Updated',
            value: 'organizationMembership.updated',
          },
          {
            name: 'Organization Updated',
            value: 'organization.updated',
          },
          {
            name: 'Session Created',
            value: 'session.created',
          },
          {
            name: 'Session Ended',
            value: 'session.ended',
          },
          {
            name: 'Session Removed',
            value: 'session.removed',
          },
          {
            name: 'Session Revoked',
            value: 'session.revoked',
          },
          {
            name: 'SMS Created',
            value: 'sms.created',
          },
          {
            name: 'User Created',
            value: 'user.created',
          },
          {
            name: 'User Deleted',
            value: 'user.deleted',
          },
          {
            name: 'User Updated',
            value: 'user.updated',
          },
        ],
      },
      {
        displayName: 'Webhook Signing Secret',
        name: 'webhookSecret',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        description: 'The signing secret from your Clerk Dashboard webhook endpoint (starts with whsec_)',
      },
      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Skip Signature Verification',
            name: 'skipVerification',
            type: 'boolean',
            default: false,
            description: 'Whether to skip SVIX signature verification (not recommended for production)',
          },
          {
            displayName: 'Tolerance (Seconds)',
            name: 'tolerance',
            type: 'number',
            default: 300,
            description: 'Maximum age of the webhook timestamp in seconds',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        // Clerk webhooks are managed externally in the Clerk Dashboard
        // This method returns true to indicate the webhook is always "ready"
        return true;
      },
      async create(this: IHookFunctions): Promise<boolean> {
        // Webhooks must be created manually in Clerk Dashboard
        // The webhook URL is available via this.getNodeWebhookUrl('default')
        return true;
      },
      async delete(this: IHookFunctions): Promise<boolean> {
        // Webhooks must be deleted manually in Clerk Dashboard
        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const req = this.getRequestObject();
    const body = this.getBodyData() as IDataObject;
    const options = this.getNodeParameter('options', {}) as IDataObject;
    const webhookSecret = this.getNodeParameter('webhookSecret') as string;
    const selectedEvents = this.getNodeParameter('events') as string[];
    const skipVerification = options.skipVerification as boolean;
    const tolerance = (options.tolerance as number) || 300;

    // Get SVIX headers
    const svixId = req.headers['svix-id'] as string;
    const svixTimestamp = req.headers['svix-timestamp'] as string;
    const svixSignature = req.headers['svix-signature'] as string;

    // Verify SVIX signature if not skipped
    if (!skipVerification) {
      if (!svixId || !svixTimestamp || !svixSignature) {
        return {
          webhookResponse: {
            status: 400,
            body: { error: 'Missing SVIX headers' },
          },
        };
      }

      // Verify timestamp is within tolerance
      const timestamp = parseInt(svixTimestamp, 10);
      const currentTime = Math.floor(Date.now() / 1000);

      if (isNaN(timestamp) || Math.abs(currentTime - timestamp) > tolerance) {
        return {
          webhookResponse: {
            status: 400,
            body: { error: 'Webhook timestamp is outside tolerance' },
          },
        };
      }

      // Verify signature
      const signedContent = `${svixId}.${svixTimestamp}.${JSON.stringify(body)}`;

      // Extract the secret (remove 'whsec_' prefix if present)
      const secret = webhookSecret.startsWith('whsec_')
        ? webhookSecret.substring(6)
        : webhookSecret;

      // Decode the base64 secret
      const secretBytes = Buffer.from(secret, 'base64');

      // Calculate expected signature
      const expectedSignature = crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64');

      // Parse the signatures from the header (format: "v1,signature1 v1,signature2")
      const signatures = svixSignature.split(' ').map((sig) => {
        const [version, signature] = sig.split(',');
        return { version, signature };
      });

      // Check if any signature matches
      const isValid = signatures.some(
        (sig) => sig.version === 'v1' && sig.signature === expectedSignature
      );

      if (!isValid) {
        return {
          webhookResponse: {
            status: 400,
            body: { error: 'Invalid signature' },
          },
        };
      }
    }

    // Get the event type
    const eventType = body.type as string;

    // Check if this event type is one we're listening for
    if (selectedEvents.length > 0 && !selectedEvents.includes(eventType)) {
      // Event type not selected, acknowledge but don't trigger workflow
      return {
        webhookResponse: {
          status: 200,
          body: { received: true, processed: false },
        },
      };
    }

    // Return the webhook data to trigger the workflow
    return {
      workflowData: [
        this.helpers.returnJsonArray([
          {
            type: eventType,
            data: body.data,
            object: body.object,
            timestamp: svixTimestamp,
            webhookId: svixId,
            raw: body,
          },
        ]),
      ],
    };
  }
}
