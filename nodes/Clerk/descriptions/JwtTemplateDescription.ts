/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const jwtTemplateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['jwtTemplate'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new JWT template',
				action: 'Create a JWT template',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a JWT template',
				action: 'Delete a JWT template',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a JWT template by ID',
				action: 'Get a JWT template',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many JWT templates',
				action: 'Get many JWT templates',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a JWT template',
				action: 'Update a JWT template',
			},
		],
		default: 'getAll',
	},
];

export const jwtTemplateFields: INodeProperties[] = [
	// ----------------------------------
	//         jwtTemplate:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['jwtTemplate'],
				operation: ['create'],
			},
		},
		description: 'Name of the JWT template',
	},
	{
		displayName: 'Claims',
		name: 'claims',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: {
				resource: ['jwtTemplate'],
				operation: ['create'],
			},
		},
		description: 'Custom claims for the JWT (JSON)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['jwtTemplate'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Allowed Clock Skew',
				name: 'allowedClockSkew',
				type: 'number',
				default: 0,
				description: 'Clock skew tolerance in seconds',
			},
			{
				displayName: 'Custom Signing Key',
				name: 'customSigningKey',
				type: 'boolean',
				default: false,
				description: 'Whether to use a custom signing key',
			},
			{
				displayName: 'Lifetime',
				name: 'lifetime',
				type: 'number',
				default: 60,
				description: 'Token lifetime in seconds',
			},
			{
				displayName: 'Signing Algorithm',
				name: 'signingAlgorithm',
				type: 'options',
				options: [
					{
						name: 'RS256',
						value: 'RS256',
					},
					{
						name: 'RS384',
						value: 'RS384',
					},
					{
						name: 'RS512',
						value: 'RS512',
					},
					{
						name: 'ES256',
						value: 'ES256',
					},
					{
						name: 'ES384',
						value: 'ES384',
					},
					{
						name: 'ES512',
						value: 'ES512',
					},
					{
						name: 'PS256',
						value: 'PS256',
					},
					{
						name: 'PS384',
						value: 'PS384',
					},
					{
						name: 'PS512',
						value: 'PS512',
					},
					{
						name: 'HS256',
						value: 'HS256',
					},
					{
						name: 'HS384',
						value: 'HS384',
					},
					{
						name: 'HS512',
						value: 'HS512',
					},
				],
				default: 'RS256',
				description: 'Algorithm used to sign the JWT',
			},
			{
				displayName: 'Signing Key',
				name: 'signingKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Custom signing key (required if customSigningKey is true)',
			},
		],
	},

	// ----------------------------------
	//         jwtTemplate:get/delete/update
	// ----------------------------------
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['jwtTemplate'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The ID of the JWT template',
	},

	// ----------------------------------
	//         jwtTemplate:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['jwtTemplate'],
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
				resource: ['jwtTemplate'],
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

	// ----------------------------------
	//         jwtTemplate:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['jwtTemplate'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Allowed Clock Skew',
				name: 'allowedClockSkew',
				type: 'number',
				default: 0,
				description: 'Clock skew tolerance in seconds',
			},
			{
				displayName: 'Claims',
				name: 'claims',
				type: 'json',
				default: '{}',
				description: 'Custom claims for the JWT (JSON)',
			},
			{
				displayName: 'Custom Signing Key',
				name: 'customSigningKey',
				type: 'boolean',
				default: false,
				description: 'Whether to use a custom signing key',
			},
			{
				displayName: 'Lifetime',
				name: 'lifetime',
				type: 'number',
				default: 60,
				description: 'Token lifetime in seconds',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the JWT template',
			},
			{
				displayName: 'Signing Algorithm',
				name: 'signingAlgorithm',
				type: 'options',
				options: [
					{
						name: 'RS256',
						value: 'RS256',
					},
					{
						name: 'RS384',
						value: 'RS384',
					},
					{
						name: 'RS512',
						value: 'RS512',
					},
					{
						name: 'ES256',
						value: 'ES256',
					},
					{
						name: 'ES384',
						value: 'ES384',
					},
					{
						name: 'ES512',
						value: 'ES512',
					},
					{
						name: 'PS256',
						value: 'PS256',
					},
					{
						name: 'PS384',
						value: 'PS384',
					},
					{
						name: 'PS512',
						value: 'PS512',
					},
					{
						name: 'HS256',
						value: 'HS256',
					},
					{
						name: 'HS384',
						value: 'HS384',
					},
					{
						name: 'HS512',
						value: 'HS512',
					},
				],
				default: 'RS256',
				description: 'Algorithm used to sign the JWT',
			},
			{
				displayName: 'Signing Key',
				name: 'signingKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Custom signing key',
			},
		],
	},
];
