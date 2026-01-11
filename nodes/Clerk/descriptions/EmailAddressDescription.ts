/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const emailAddressOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['emailAddress'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new email address for a user',
				action: 'Create an email address',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an email address',
				action: 'Delete an email address',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an email address by ID',
				action: 'Get an email address',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an email address',
				action: 'Update an email address',
			},
		],
		default: 'get',
	},
];

export const emailAddressFields: INodeProperties[] = [
	// ----------------------------------
	//         emailAddress:create
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['emailAddress'],
				operation: ['create'],
			},
		},
		description: 'The ID of the user (user_xxx)',
	},
	{
		displayName: 'Email Address',
		name: 'emailAddress',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['emailAddress'],
				operation: ['create'],
			},
		},
		description: 'The email address to add',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['emailAddress'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Primary',
				name: 'primary',
				type: 'boolean',
				default: false,
				description: 'Whether to set as primary email',
			},
			{
				displayName: 'Verified',
				name: 'verified',
				type: 'boolean',
				default: false,
				description: 'Whether the email is verified',
			},
		],
	},

	// ----------------------------------
	//         emailAddress:get/delete/update
	// ----------------------------------
	{
		displayName: 'Email Address ID',
		name: 'emailAddressId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['emailAddress'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The ID of the email address',
	},

	// ----------------------------------
	//         emailAddress:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['emailAddress'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Primary',
				name: 'primary',
				type: 'boolean',
				default: false,
				description: 'Whether to set as primary email',
			},
			{
				displayName: 'Verified',
				name: 'verified',
				type: 'boolean',
				default: false,
				description: 'Whether the email is verified',
			},
		],
	},
];
