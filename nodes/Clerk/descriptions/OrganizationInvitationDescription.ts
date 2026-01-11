/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const organizationInvitationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new organization invitation',
				action: 'Create an organization invitation',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an invitation by ID',
				action: 'Get an organization invitation',
			},
			{
				name: 'Get Bulk',
				value: 'getBulk',
				description: 'Get invitations in bulk by IDs',
				action: 'Get organization invitations in bulk',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many organization invitations',
				action: 'Get many organization invitations',
			},
			{
				name: 'Revoke',
				value: 'revoke',
				description: 'Revoke a pending invitation',
				action: 'Revoke an organization invitation',
			},
		],
		default: 'getAll',
	},
];

export const organizationInvitationFields: INodeProperties[] = [
	// ----------------------------------
	//    organizationInvitation:create
	// ----------------------------------
	{
		displayName: 'Organization ID',
		name: 'organizationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
				operation: ['create', 'get', 'getAll', 'revoke'],
			},
		},
		description: 'The ID of the organization (org_xxx)',
	},
	{
		displayName: 'Email Address',
		name: 'emailAddress',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
				operation: ['create'],
			},
		},
		description: 'Email address to invite',
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'string',
		required: true,
		default: 'basic_member',
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
				operation: ['create'],
			},
		},
		description: 'Role for the invited member (admin, basic_member, or custom role)',
	},
	{
		displayName: 'Inviter User ID',
		name: 'inviterUserId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
				operation: ['create'],
			},
		},
		description: 'User ID of the person sending the invitation',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
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
				displayName: 'Redirect URL',
				name: 'redirectUrl',
				type: 'string',
				default: '',
				description: 'URL to redirect to after accepting the invitation',
			},
		],
	},

	// ----------------------------------
	//    organizationInvitation:get/revoke
	// ----------------------------------
	{
		displayName: 'Invitation ID',
		name: 'invitationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
				operation: ['get', 'revoke'],
			},
		},
		description: 'The ID of the invitation',
	},
	{
		displayName: 'Requesting User ID',
		name: 'requestingUserId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
				operation: ['revoke'],
			},
		},
		description: 'User ID of the person revoking the invitation',
	},

	// ----------------------------------
	//    organizationInvitation:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
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
				resource: ['organizationInvitation'],
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
				resource: ['organizationInvitation'],
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

	// ----------------------------------
	//    organizationInvitation:getBulk
	// ----------------------------------
	{
		displayName: 'Invitation IDs',
		name: 'invitationIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['organizationInvitation'],
				operation: ['getBulk'],
			},
		},
		description: 'Comma-separated list of invitation IDs to retrieve',
	},
];
