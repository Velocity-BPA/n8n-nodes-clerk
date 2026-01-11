/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const allowlistOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['allowlistIdentifier'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add an identifier to the allowlist',
				action: 'Create an allowlist identifier',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove an identifier from the allowlist',
				action: 'Delete an allowlist identifier',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an allowlist identifier by ID',
				action: 'Get an allowlist identifier',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many allowlist identifiers',
				action: 'Get many allowlist identifiers',
			},
		],
		default: 'getAll',
	},
];

export const allowlistFields: INodeProperties[] = [
	// ----------------------------------
	//         allowlist:create
	// ----------------------------------
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['allowlistIdentifier'],
				operation: ['create'],
			},
		},
		description: 'Email address or phone number to add to the allowlist',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['allowlistIdentifier'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Notify',
				name: 'notify',
				type: 'boolean',
				default: false,
				description: 'Whether to send a notification when added',
			},
		],
	},

	// ----------------------------------
	//         allowlist:get/delete
	// ----------------------------------
	{
		displayName: 'Identifier ID',
		name: 'identifierId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['allowlistIdentifier'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The ID of the allowlist identifier',
	},

	// ----------------------------------
	//         allowlist:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['allowlistIdentifier'],
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
				resource: ['allowlistIdentifier'],
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
];
