/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationMembershipOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organizationMembership'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a user to an organization',
				action: 'Create an organization membership',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a user from an organization',
				action: 'Delete an organization membership',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a membership by ID',
				action: 'Get an organization membership',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many organization memberships',
				action: 'Get many organization memberships',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a membership role',
				action: 'Update an organization membership',
			},
		],
		default: 'getAll',
	},
];

export const organizationMembershipFields: INodeProperties[] = [
	// ----------------------------------
	//    organizationMembership:create
	// ----------------------------------
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationMembership'],
				operation: ['create', 'getAll'],
			},
		},
		description: 'The ID of the organization (org_xxx)',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationMembership'],
				operation: ['create'],
			},
		},
		description: 'The ID of the user to add (user_xxx)',
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'string',
		required: true,
		default: 'basic_member',
		displayOptions: {
			show: {
				resource: ['organizationMembership'],
				operation: ['create'],
			},
		},
		description: 'Role for the member (admin, basic_member, or custom role)',
	},

	// ----------------------------------
	//    organizationMembership:get/update/delete
	// ----------------------------------
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationMembership'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the organization (org_xxx)',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationMembership'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the user (user_xxx)',
	},

	// ----------------------------------
	//    organizationMembership:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['organizationMembership'],
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
				resource: ['organizationMembership'],
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
				resource: ['organizationMembership'],
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
					{
						name: 'Email Address (Asc)',
						value: 'email_address',
					},
					{
						name: 'Email Address (Desc)',
						value: '-email_address',
					},
					{
						name: 'First Name (Asc)',
						value: 'first_name',
					},
					{
						name: 'First Name (Desc)',
						value: '-first_name',
					},
					{
						name: 'Last Name (Asc)',
						value: 'last_name',
					},
					{
						name: 'Last Name (Desc)',
						value: '-last_name',
					},
					{
						name: 'Phone Number (Asc)',
						value: 'phone_number',
					},
					{
						name: 'Phone Number (Desc)',
						value: '-phone_number',
					},
					{
						name: 'Role (Asc)',
						value: 'role',
					},
					{
						name: 'Role (Desc)',
						value: '-role',
					},
					{
						name: 'Username (Asc)',
						value: 'username',
					},
					{
						name: 'Username (Desc)',
						value: '-username',
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
				description: 'Search query to filter members',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'string',
				default: '',
				description: 'Filter by role (comma-separated for multiple)',
			},
			{
				displayName: 'User IDs',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter by user IDs (comma-separated)',
			},
		],
	},

	// ----------------------------------
	//    organizationMembership:update
	// ----------------------------------
	{
		displayName: 'Role',
		name: 'role',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationMembership'],
				operation: ['update'],
			},
		},
		description: 'New role for the member (admin, basic_member, or custom role)',
	},
];
