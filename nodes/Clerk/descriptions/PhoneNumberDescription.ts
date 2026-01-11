/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const phoneNumberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new phone number for a user',
				action: 'Create a phone number',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a phone number',
				action: 'Delete a phone number',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a phone number by ID',
				action: 'Get a phone number',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a phone number',
				action: 'Update a phone number',
			},
		],
		default: 'get',
	},
];

export const phoneNumberFields: INodeProperties[] = [
	// ----------------------------------
	//         phoneNumber:create
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['create'],
			},
		},
		description: 'The ID of the user (user_xxx)',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['create'],
			},
		},
		description: 'The phone number to add (E.164 format, e.g., +14155551234)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Primary',
				name: 'primary',
				type: 'boolean',
				default: false,
				description: 'Whether to set as primary phone number',
			},
			{
				displayName: 'Reserved for Second Factor',
				name: 'reservedForSecondFactor',
				type: 'boolean',
				default: false,
				description: 'Whether this phone is reserved for MFA',
			},
			{
				displayName: 'Verified',
				name: 'verified',
				type: 'boolean',
				default: false,
				description: 'Whether the phone number is verified',
			},
		],
	},

	// ----------------------------------
	//         phoneNumber:get/delete/update
	// ----------------------------------
	{
		displayName: 'Phone Number ID',
		name: 'phoneNumberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['get', 'delete', 'update'],
			},
		},
		description: 'The ID of the phone number',
	},

	// ----------------------------------
	//         phoneNumber:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Default Second Factor',
				name: 'defaultSecondFactor',
				type: 'boolean',
				default: false,
				description: 'Whether this is the default second factor',
			},
			{
				displayName: 'Primary',
				name: 'primary',
				type: 'boolean',
				default: false,
				description: 'Whether to set as primary phone number',
			},
			{
				displayName: 'Reserved for Second Factor',
				name: 'reservedForSecondFactor',
				type: 'boolean',
				default: false,
				description: 'Whether this phone is reserved for MFA',
			},
			{
				displayName: 'Verified',
				name: 'verified',
				type: 'boolean',
				default: false,
				description: 'Whether the phone number is verified',
			},
		],
	},
];
