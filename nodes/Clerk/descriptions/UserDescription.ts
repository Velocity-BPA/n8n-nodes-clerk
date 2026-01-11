/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Ban',
				value: 'ban',
				description: 'Ban a user from signing in',
				action: 'Ban a user',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new user',
				action: 'Create a user',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a user permanently',
				action: 'Delete a user',
			},
			{
				name: 'Delete Profile Image',
				value: 'deleteProfileImage',
				description: 'Delete user profile image',
				action: 'Delete user profile image',
			},
			{
				name: 'Disable MFA',
				value: 'disableMFA',
				description: 'Disable all MFA methods for a user',
				action: 'Disable MFA for a user',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user by ID',
				action: 'Get a user',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many users',
				action: 'Get many users',
			},
			{
				name: 'Get Count',
				value: 'getCount',
				description: 'Get total user count',
				action: 'Get user count',
			},
			{
				name: 'Get Organization Memberships',
				value: 'getOrganizationMemberships',
				description: 'Get user organization memberships',
				action: 'Get user organization memberships',
			},
			{
				name: 'Lock',
				value: 'lock',
				description: 'Lock a user account',
				action: 'Lock a user',
			},
			{
				name: 'Set Profile Image',
				value: 'setProfileImage',
				description: 'Set user profile image',
				action: 'Set user profile image',
			},
			{
				name: 'Unban',
				value: 'unban',
				description: 'Remove a ban from a user',
				action: 'Unban a user',
			},
			{
				name: 'Unlock',
				value: 'unlock',
				description: 'Unlock a user account',
				action: 'Unlock a user',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a user',
				action: 'Update a user',
			},
			{
				name: 'Update Metadata',
				value: 'updateMetadata',
				description: 'Update user metadata',
				action: 'Update user metadata',
			},
			{
				name: 'Verify Password',
				value: 'verifyPassword',
				description: 'Verify a user password',
				action: 'Verify user password',
			},
			{
				name: 'Verify TOTP',
				value: 'verifyTOTP',
				description: 'Verify a TOTP code for a user',
				action: 'Verify user TOTP',
			},
		],
		default: 'getAll',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------
	//         user:create
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Backup Codes',
				name: 'backupCodes',
				type: 'string',
				default: '',
				description: 'Comma-separated list of backup codes for MFA',
			},
			{
				displayName: 'Created At',
				name: 'createdAt',
				type: 'dateTime',
				default: '',
				description: 'Custom created_at timestamp',
			},
			{
				displayName: 'Email Addresses',
				name: 'emailAddress',
				type: 'string',
				default: '',
				description: 'Comma-separated list of email addresses',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External system ID for the user',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'User first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'User last name',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'User password',
			},
			{
				displayName: 'Phone Numbers',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				description: 'Comma-separated list of phone numbers (E.164 format)',
			},
			{
				displayName: 'Private Metadata',
				name: 'privateMetadata',
				type: 'json',
				default: '{}',
				description: 'Private metadata (JSON) - not visible to the user',
			},
			{
				displayName: 'Public Metadata',
				name: 'publicMetadata',
				type: 'json',
				default: '{}',
				description: 'Public metadata (JSON) - visible to the user',
			},
			{
				displayName: 'Skip Password Checks',
				name: 'skipPasswordChecks',
				type: 'boolean',
				default: false,
				description: 'Whether to skip password validation rules',
			},
			{
				displayName: 'Skip Password Requirement',
				name: 'skipPasswordRequirement',
				type: 'boolean',
				default: false,
				description: 'Whether to allow creating a user without a password',
			},
			{
				displayName: 'TOTP Secret',
				name: 'totpSecret',
				type: 'string',
				default: '',
				description: 'TOTP secret for MFA',
			},
			{
				displayName: 'Unsafe Metadata',
				name: 'unsafeMetadata',
				type: 'json',
				default: '{}',
				description: 'Unsafe metadata (JSON) - client-writable',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Username for the user',
			},
		],
	},

	// ----------------------------------
	//         user:get
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get', 'update', 'delete', 'ban', 'unban', 'lock', 'unlock', 'verifyPassword', 'verifyTOTP', 'disableMFA', 'getOrganizationMemberships', 'setProfileImage', 'deleteProfileImage', 'updateMetadata'],
			},
		},
		description: 'The ID of the user (user_xxx)',
	},

	// ----------------------------------
	//         user:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['user'],
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
				resource: ['user'],
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
				resource: ['user'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Created At After',
				name: 'createdAtAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter users created after this date',
			},
			{
				displayName: 'Created At Before',
				name: 'createdAtBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter users created before this date',
			},
			{
				displayName: 'Email Address',
				name: 'emailAddress',
				type: 'string',
				default: '',
				description: 'Filter by email address (comma-separated for multiple)',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'Filter by external ID (comma-separated for multiple)',
			},
			{
				displayName: 'Last Active At Since',
				name: 'lastActiveAtSince',
				type: 'dateTime',
				default: '',
				description: 'Filter users active since this date',
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
						name: 'Updated At (Asc)',
						value: 'updated_at',
					},
					{
						name: 'Updated At (Desc)',
						value: '-updated_at',
					},
					{
						name: 'Last Active At (Asc)',
						value: 'last_active_at',
					},
					{
						name: 'Last Active At (Desc)',
						value: '-last_active_at',
					},
					{
						name: 'Last Sign In At (Asc)',
						value: 'last_sign_in_at',
					},
					{
						name: 'Last Sign In At (Desc)',
						value: '-last_sign_in_at',
					},
				],
				default: '-created_at',
				description: 'Order results by field',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				description: 'Filter by phone number (comma-separated for multiple)',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				description: 'Search query to filter users',
			},
			{
				displayName: 'User IDs',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter by user IDs (comma-separated for multiple)',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Filter by username (comma-separated for multiple)',
			},
			{
				displayName: 'Web3 Wallet',
				name: 'web3Wallet',
				type: 'string',
				default: '',
				description: 'Filter by web3 wallet address (comma-separated for multiple)',
			},
		],
	},

	// ----------------------------------
	//         user:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Backup Codes',
				name: 'backupCodes',
				type: 'string',
				default: '',
				description: 'Comma-separated list of backup codes for MFA',
			},
			{
				displayName: 'Create Organization Enabled',
				name: 'createOrganizationEnabled',
				type: 'boolean',
				default: true,
				description: 'Whether the user can create organizations',
			},
			{
				displayName: 'Create Organizations Limit',
				name: 'createOrganizationsLimit',
				type: 'number',
				default: 0,
				description: 'Maximum number of organizations the user can create',
			},
			{
				displayName: 'Delete Self Enabled',
				name: 'deleteSelfEnabled',
				type: 'boolean',
				default: true,
				description: 'Whether the user can delete their own account',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External system ID for the user',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'User first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'User last name',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'New password for the user',
			},
			{
				displayName: 'Primary Email Address ID',
				name: 'primaryEmailAddressId',
				type: 'string',
				default: '',
				description: 'ID of the email address to set as primary',
			},
			{
				displayName: 'Primary Phone Number ID',
				name: 'primaryPhoneNumberId',
				type: 'string',
				default: '',
				description: 'ID of the phone number to set as primary',
			},
			{
				displayName: 'Primary Web3 Wallet ID',
				name: 'primaryWeb3WalletId',
				type: 'string',
				default: '',
				description: 'ID of the web3 wallet to set as primary',
			},
			{
				displayName: 'Private Metadata',
				name: 'privateMetadata',
				type: 'json',
				default: '{}',
				description: 'Private metadata (JSON) - not visible to the user',
			},
			{
				displayName: 'Profile Image ID',
				name: 'profileImageId',
				type: 'string',
				default: '',
				description: 'ID of the image to set as profile image',
			},
			{
				displayName: 'Public Metadata',
				name: 'publicMetadata',
				type: 'json',
				default: '{}',
				description: 'Public metadata (JSON) - visible to the user',
			},
			{
				displayName: 'Sign Out of All Sessions',
				name: 'signOutOfOtherSessions',
				type: 'boolean',
				default: false,
				description: 'Whether to sign out of all other sessions after update',
			},
			{
				displayName: 'Skip Password Checks',
				name: 'skipPasswordChecks',
				type: 'boolean',
				default: false,
				description: 'Whether to skip password validation rules',
			},
			{
				displayName: 'TOTP Secret',
				name: 'totpSecret',
				type: 'string',
				default: '',
				description: 'TOTP secret for MFA',
			},
			{
				displayName: 'Unsafe Metadata',
				name: 'unsafeMetadata',
				type: 'json',
				default: '{}',
				description: 'Unsafe metadata (JSON) - client-writable',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Username for the user',
			},
		],
	},

	// ----------------------------------
	//         user:verifyPassword
	// ----------------------------------
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['verifyPassword'],
			},
		},
		description: 'The password to verify',
	},

	// ----------------------------------
	//         user:verifyTOTP
	// ----------------------------------
	{
		displayName: 'TOTP Code',
		name: 'code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['verifyTOTP'],
			},
		},
		description: 'The TOTP code to verify',
	},

	// ----------------------------------
	//         user:setProfileImage
	// ----------------------------------
	{
		displayName: 'Input Data Field Name',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['setProfileImage'],
			},
		},
		description: 'Name of the binary property containing the image file',
	},

	// ----------------------------------
	//         user:updateMetadata
	// ----------------------------------
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'collection',
		placeholder: 'Add Metadata',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['updateMetadata'],
			},
		},
		options: [
			{
				displayName: 'Private Metadata',
				name: 'privateMetadata',
				type: 'json',
				default: '{}',
				description: 'Private metadata (JSON) - not visible to the user',
			},
			{
				displayName: 'Public Metadata',
				name: 'publicMetadata',
				type: 'json',
				default: '{}',
				description: 'Public metadata (JSON) - visible to the user',
			},
			{
				displayName: 'Unsafe Metadata',
				name: 'unsafeMetadata',
				type: 'json',
				default: '{}',
				description: 'Unsafe metadata (JSON) - client-writable',
			},
		],
	},
];
