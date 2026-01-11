/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const invitationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['invitation'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user invitation',
				action: 'Create an invitation',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an invitation by ID',
				action: 'Get an invitation',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many invitations',
				action: 'Get many invitations',
			},
			{
				name: 'Revoke',
				value: 'revoke',
				description: 'Revoke an invitation',
				action: 'Revoke an invitation',
			},
		],
		default: 'getAll',
	},
];

export const invitationFields: INodeProperties[] = [
	// ----------------------------------
	//         invitation:create
	// ----------------------------------
	{
		displayName: 'Email Address',
		name: 'emailAddress',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invitation'],
				operation: ['create'],
			},
		},
		description: 'Email address to invite',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invitation'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Expires In Days',
				name: 'expiresInDays',
				type: 'number',
				default: 30,
				description: 'Number of days until the invitation expires',
			},
			{
				displayName: 'Ignore Existing',
				name: 'ignoreExisting',
				type: 'boolean',
				default: false,
				description: 'Whether to ignore if the user already exists',
			},
			{
				displayName: 'Notify',
				name: 'notify',
				type: 'boolean',
				default: true,
				description: 'Whether to send invitation email',
			},
			{
				displayName: 'Public Metadata',
				name: 'publicMetadata',
				type: 'json',
				default: '{}',
				description: 'Public metadata (JSON)',
			},
			{
				displayName: 'Redirect URL',
				name: 'redirectUrl',
				type: 'string',
				default: '',
				description: 'URL to redirect to after accepting the invitation',
			},
		],
	},

	// ----------------------------------
	//         invitation:get/revoke
	// ----------------------------------
	{
		displayName: 'Invitation ID',
		name: 'invitationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invitation'],
				operation: ['get', 'revoke'],
			},
		},
		description: 'The ID of the invitation',
	},

	// ----------------------------------
	//         invitation:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['invitation'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['invitation'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['invitation'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'options',
				options: [
					{
						name: 'Created At (Asc)',
						value: 'created_at',
					},
					{
						name: 'Created At (Desc)',
						value: '-created_at',
					},
				],
				default: '-created_at',
				description: 'Order results by field',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Search query to filter invitations',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Accepted',
						value: 'accepted',
					},
					{
						name: 'All',
						value: 'all',
					},
					{
						name: 'Expired',
						value: 'expired',
					},
					{
						name: 'Pending',
						value: 'pending',
					},
					{
						name: 'Revoked',
						value: 'revoked',
					},
				],
				default: 'pending',
				description: 'Filter by invitation status',
			},
		],
	},
];
