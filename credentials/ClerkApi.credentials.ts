/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClerkApi implements ICredentialType {
	name = 'clerkApi';
	displayName = 'Clerk API';
	documentationUrl = 'https://clerk.com/docs/reference/backend-api';
	properties: INodeProperties[] = [
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Clerk secret key (sk_live_xxx or sk_test_xxx) from your Clerk Dashboard',
		},
		{
			displayName: 'API Version',
			name: 'apiVersion',
			type: 'string',
			default: '',
			description: 'Optional API version date (e.g., 2025-04-10). Leave empty for latest.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.secretKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.clerk.com/v1',
			url: '/users',
			method: 'GET',
			qs: {
				limit: 1,
			},
		},
	};
}
