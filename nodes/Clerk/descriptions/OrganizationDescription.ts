/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organization'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new organization',
				action: 'Create an organization',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an organization',
				action: 'Delete an organization',
			},
			{
				name: 'Delete Logo',
				value: 'deleteLogo',
				description: 'Delete organization logo',
				action: 'Delete organization logo',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an organization by ID or slug',
				action: 'Get an organization',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many organizations',
				action: 'Get many organizations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an organization',
				action: 'Update an organization',
			},
			{
				name: 'Update Logo',
				value: 'updateLogo',
				description: 'Upload organization logo',
				action: 'Update organization logo',
			},
			{
				name: 'Update Metadata',
				value: 'updateMetadata',
				description: 'Update organization metadata',
				action: 'Update organization metadata',
			},
		],
		default: 'getAll',
	},
];

export const organizationFields: INodeProperties[] = [
	// ----------------------------------
	//         organization:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['create'],
			},
		},
		description: 'Name of the organization',
	},
	{
		displayName: 'Created By (User ID)',
		name: 'createdBy',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['create'],
			},
		},
		description: 'User ID of the organization creator',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Max Allowed Memberships',
				name: 'maxAllowedMemberships',
				type: 'number',
				default: 0,
				description: 'Maximum number of members allowed (0 for unlimited)',
			},
			{
				displayName: 'Private Metadata',
				name: 'privateMetadata',
				type: 'json',
				default: '{}',
				description: 'Private metadata (JSON)',
			},
			{
				displayName: 'Public Metadata',
				name: 'publicMetadata',
				type: 'json',
				default: '{}',
				description: 'Public metadata (JSON)',
			},
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				description: 'URL-friendly slug for the organization',
			},
		],
	},

	// ----------------------------------
	//         organization:get
	// ----------------------------------
	{
		displayName: 'Organization ID or Slug',
		name: 'organizationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['get', 'update', 'delete', 'updateLogo', 'deleteLogo', 'updateMetadata'],
			},
		},
		description: 'The ID (org_xxx) or slug of the organization',
	},

	// ----------------------------------
	//         organization:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['organization'],
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
				resource: ['organization'],
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
				resource: ['organization'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Include Members Count',
				name: 'includeMembersCount',
				type: 'boolean',
				default: false,
				description: 'Whether to include members count in response',
			},
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
						name: 'Members Count (Asc)',
						value: 'members_count',
					},
					{
						name: 'Members Count (Desc)',
						value: '-members_count',
					},
					{
						name: 'Name (Asc)',
						value: 'name',
					},
					{
						name: 'Name (Desc)',
						value: '-name',
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
				description: 'Search query to filter organizations by name',
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
	//         organization:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Admin Delete Enabled',
				name: 'adminDeleteEnabled',
				type: 'boolean',
				default: true,
				description: 'Whether admins can delete the organization',
			},
			{
				displayName: 'Max Allowed Memberships',
				name: 'maxAllowedMemberships',
				type: 'number',
				default: 0,
				description: 'Maximum number of members allowed (0 for unlimited)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the organization',
			},
			{
				displayName: 'Private Metadata',
				name: 'privateMetadata',
				type: 'json',
				default: '{}',
				description: 'Private metadata (JSON)',
			},
			{
				displayName: 'Public Metadata',
				name: 'publicMetadata',
				type: 'json',
				default: '{}',
				description: 'Public metadata (JSON)',
			},
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				description: 'URL-friendly slug for the organization',
			},
		],
	},

	// ----------------------------------
	//         organization:updateLogo
	// ----------------------------------
	{
		displayName: 'Input Data Field Name',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['updateLogo'],
			},
		},
		description: 'Name of the binary property containing the logo file',
	},

	// ----------------------------------
	//         organization:updateMetadata
	// ----------------------------------
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'collection',
		placeholder: 'Add Metadata',
		default: {},
		displayOptions: {
			show: {
				resource: ['organization'],
				operation: ['updateMetadata'],
			},
		},
		options: [
			{
				displayName: 'Private Metadata',
				name: 'privateMetadata',
				type: 'json',
				default: '{}',
				description: 'Private metadata (JSON)',
			},
			{
				displayName: 'Public Metadata',
				name: 'publicMetadata',
				type: 'json',
				default: '{}',
				description: 'Public metadata (JSON)',
			},
		],
	},
];
