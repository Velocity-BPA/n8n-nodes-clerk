/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const blocklistOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['blocklistIdentifier'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add an identifier to the blocklist',
				action: 'Create a blocklist identifier',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove an identifier from the blocklist',
				action: 'Delete a blocklist identifier',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a blocklist identifier by ID',
				action: 'Get a blocklist identifier',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many blocklist identifiers',
				action: 'Get many blocklist identifiers',
			},
		],
		default: 'getAll',
	},
];

export const blocklistFields: INodeProperties[] = [
	// ----------------------------------
	//         blocklist:create
	// ----------------------------------
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['blocklistIdentifier'],
				operation: ['create'],
			},
		},
		description: 'Email address, phone number, or web3 wallet to add to the blocklist',
	},

	// ----------------------------------
	//         blocklist:get/delete
	// ----------------------------------
	{
		displayName: 'Identifier ID',
		name: 'identifierId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['blocklistIdentifier'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The ID of the blocklist identifier',
	},

	// ----------------------------------
	//         blocklist:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['blocklistIdentifier'],
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
				resource: ['blocklistIdentifier'],
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
