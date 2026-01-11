/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const sessionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['session'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a session by ID',
				action: 'Get a session',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sessions',
				action: 'Get many sessions',
			},
			{
				name: 'Revoke',
				value: 'revoke',
				description: 'Revoke a session',
				action: 'Revoke a session',
			},
			{
				name: 'Verify',
				value: 'verify',
				description: 'Verify a session token',
				action: 'Verify a session',
			},
		],
		default: 'getAll',
	},
];

export const sessionFields: INodeProperties[] = [
	// ----------------------------------
	//         session:get
	// ----------------------------------
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['get', 'revoke', 'verify'],
			},
		},
		description: 'The ID of the session (sess_xxx)',
	},

	// ----------------------------------
	//         session:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['session'],
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
				resource: ['session'],
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
				resource: ['session'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Client ID',
				name: 'clientId',
				type: 'string',
				default: '',
				description: 'Filter by client ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Abandoned',
						value: 'abandoned',
					},
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Ended',
						value: 'ended',
					},
					{
						name: 'Expired',
						value: 'expired',
					},
					{
						name: 'Removed',
						value: 'removed',
					},
					{
						name: 'Replaced',
						value: 'replaced',
					},
					{
						name: 'Revoked',
						value: 'revoked',
					},
				],
				default: 'active',
				description: 'Filter by session status',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter by user ID',
			},
		],
	},

	// ----------------------------------
	//         session:verify
	// ----------------------------------
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['verify'],
			},
		},
		description: 'The session token to verify',
	},
];
