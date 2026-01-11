/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	clerkApiRequest,
	clerkApiRequestAllItems,
	clerkApiRequestUpload,
	cleanObject,
	parseMetadata,
	buildListQuery,
} from './GenericFunctions';

import { userOperations, userFields } from './descriptions/UserDescription';
import { organizationOperations, organizationFields } from './descriptions/OrganizationDescription';
import { organizationMembershipOperations, organizationMembershipFields } from './descriptions/OrganizationMembershipDescription';
import { organizationInvitationOperations, organizationInvitationFields } from './descriptions/OrganizationInvitationDescription';
import { sessionOperations, sessionFields } from './descriptions/SessionDescription';
import { emailAddressOperations, emailAddressFields } from './descriptions/EmailAddressDescription';
import { phoneNumberOperations, phoneNumberFields } from './descriptions/PhoneNumberDescription';
import { invitationOperations, invitationFields } from './descriptions/InvitationDescription';
import { allowlistOperations, allowlistFields } from './descriptions/AllowlistDescription';
import { blocklistOperations, blocklistFields } from './descriptions/BlocklistDescription';
import { jwtTemplateOperations, jwtTemplateFields } from './descriptions/JwtTemplateDescription';
import { webhookOperations, webhookFields } from './descriptions/WebhookDescription';

// Licensing notice - logged once per node load
const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]
This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licensingNoticeLogged = false;

export class Clerk implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Clerk',
		name: 'clerk',
		icon: 'file:clerk.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Clerk authentication API',
		defaults: {
			name: 'Clerk',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'clerkApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Allowlist Identifier',
						value: 'allowlistIdentifier',
					},
					{
						name: 'Blocklist Identifier',
						value: 'blocklistIdentifier',
					},
					{
						name: 'Email Address',
						value: 'emailAddress',
					},
					{
						name: 'Invitation',
						value: 'invitation',
					},
					{
						name: 'JWT Template',
						value: 'jwtTemplate',
					},
					{
						name: 'Organization',
						value: 'organization',
					},
					{
						name: 'Organization Invitation',
						value: 'organizationInvitation',
					},
					{
						name: 'Organization Membership',
						value: 'organizationMembership',
					},
					{
						name: 'Phone Number',
						value: 'phoneNumber',
					},
					{
						name: 'Session',
						value: 'session',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'user',
			},
			...userOperations,
			...userFields,
			...organizationOperations,
			...organizationFields,
			...organizationMembershipOperations,
			...organizationMembershipFields,
			...organizationInvitationOperations,
			...organizationInvitationFields,
			...sessionOperations,
			...sessionFields,
			...emailAddressOperations,
			...emailAddressFields,
			...phoneNumberOperations,
			...phoneNumberFields,
			...invitationOperations,
			...invitationFields,
			...allowlistOperations,
			...allowlistFields,
			...blocklistOperations,
			...blocklistFields,
			...jwtTemplateOperations,
			...jwtTemplateFields,
			...webhookOperations,
			...webhookFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		if (!licensingNoticeLogged) {
			console.warn(LICENSING_NOTICE);
			licensingNoticeLogged = true;
		}

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// ----------------------------------------
				//              User
				// ----------------------------------------
				if (resource === 'user') {
					if (operation === 'create') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = {};

						if (additionalFields.emailAddress) {
							body.email_address = (additionalFields.emailAddress as string).split(',').map(e => e.trim());
						}
						if (additionalFields.phoneNumber) {
							body.phone_number = (additionalFields.phoneNumber as string).split(',').map(p => p.trim());
						}
						if (additionalFields.username) body.username = additionalFields.username;
						if (additionalFields.password) body.password = additionalFields.password;
						if (additionalFields.firstName) body.first_name = additionalFields.firstName;
						if (additionalFields.lastName) body.last_name = additionalFields.lastName;
						if (additionalFields.externalId) body.external_id = additionalFields.externalId;
						if (additionalFields.skipPasswordChecks) body.skip_password_checks = additionalFields.skipPasswordChecks;
						if (additionalFields.skipPasswordRequirement) body.skip_password_requirement = additionalFields.skipPasswordRequirement;
						if (additionalFields.totpSecret) body.totp_secret = additionalFields.totpSecret;
						if (additionalFields.backupCodes) {
							body.backup_codes = (additionalFields.backupCodes as string).split(',').map(c => c.trim());
						}
						if (additionalFields.createdAt) {
							body.created_at = new Date(additionalFields.createdAt as string).toISOString();
						}
						if (additionalFields.publicMetadata) {
							body.public_metadata = parseMetadata(additionalFields.publicMetadata as string);
						}
						if (additionalFields.privateMetadata) {
							body.private_metadata = parseMetadata(additionalFields.privateMetadata as string);
						}
						if (additionalFields.unsafeMetadata) {
							body.unsafe_metadata = parseMetadata(additionalFields.unsafeMetadata as string);
						}

						responseData = await clerkApiRequest.call(this, 'POST', '/users', cleanObject(body));
					}

					if (operation === 'get') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/users/${userId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query = buildListQuery.call(this, i, filters);

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/users', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/users', {}, query, limit);
						}
					}

					if (operation === 'update') {
						const userId = this.getNodeParameter('userId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};

						if (updateFields.username) body.username = updateFields.username;
						if (updateFields.password) body.password = updateFields.password;
						if (updateFields.firstName) body.first_name = updateFields.firstName;
						if (updateFields.lastName) body.last_name = updateFields.lastName;
						if (updateFields.externalId) body.external_id = updateFields.externalId;
						if (updateFields.primaryEmailAddressId) body.primary_email_address_id = updateFields.primaryEmailAddressId;
						if (updateFields.primaryPhoneNumberId) body.primary_phone_number_id = updateFields.primaryPhoneNumberId;
						if (updateFields.primaryWeb3WalletId) body.primary_web3_wallet_id = updateFields.primaryWeb3WalletId;
						if (updateFields.profileImageId) body.profile_image_id = updateFields.profileImageId;
						if (updateFields.skipPasswordChecks) body.skip_password_checks = updateFields.skipPasswordChecks;
						if (updateFields.signOutOfOtherSessions) body.sign_out_of_other_sessions = updateFields.signOutOfOtherSessions;
						if (updateFields.totpSecret) body.totp_secret = updateFields.totpSecret;
						if (updateFields.deleteSelfEnabled !== undefined) body.delete_self_enabled = updateFields.deleteSelfEnabled;
						if (updateFields.createOrganizationEnabled !== undefined) body.create_organization_enabled = updateFields.createOrganizationEnabled;
						if (updateFields.createOrganizationsLimit !== undefined) body.create_organizations_limit = updateFields.createOrganizationsLimit;
						if (updateFields.backupCodes) {
							body.backup_codes = (updateFields.backupCodes as string).split(',').map(c => c.trim());
						}
						if (updateFields.publicMetadata) {
							body.public_metadata = parseMetadata(updateFields.publicMetadata as string);
						}
						if (updateFields.privateMetadata) {
							body.private_metadata = parseMetadata(updateFields.privateMetadata as string);
						}
						if (updateFields.unsafeMetadata) {
							body.unsafe_metadata = parseMetadata(updateFields.unsafeMetadata as string);
						}

						responseData = await clerkApiRequest.call(this, 'PATCH', `/users/${userId}`, cleanObject(body));
					}

					if (operation === 'delete') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/users/${userId}`);
					}

					if (operation === 'ban') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/users/${userId}/ban`);
					}

					if (operation === 'unban') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/users/${userId}/unban`);
					}

					if (operation === 'lock') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/users/${userId}/lock`);
					}

					if (operation === 'unlock') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/users/${userId}/unlock`);
					}

					if (operation === 'getCount') {
						responseData = await clerkApiRequest.call(this, 'GET', '/users/count');
					}

					if (operation === 'verifyPassword') {
						const userId = this.getNodeParameter('userId', i) as string;
						const password = this.getNodeParameter('password', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/users/${userId}/verify_password`, { password });
					}

					if (operation === 'verifyTOTP') {
						const userId = this.getNodeParameter('userId', i) as string;
						const code = this.getNodeParameter('code', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/users/${userId}/verify_totp`, { code });
					}

					if (operation === 'disableMFA') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/users/${userId}/mfa`);
					}

					if (operation === 'getOrganizationMemberships') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequestAllItems.call(this, 'GET', `/users/${userId}/organization_memberships`);
					}

					if (operation === 'setProfileImage') {
						const userId = this.getNodeParameter('userId', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

						const formData = {
							file: {
								value: dataBuffer,
								options: {
									filename: binaryData.fileName || 'profile.png',
									contentType: binaryData.mimeType,
								},
							},
						};

						responseData = await clerkApiRequestUpload.call(this, 'POST', `/users/${userId}/profile_image`, formData);
					}

					if (operation === 'deleteProfileImage') {
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/users/${userId}/profile_image`);
					}

					if (operation === 'updateMetadata') {
						const userId = this.getNodeParameter('userId', i) as string;
						const metadata = this.getNodeParameter('metadata', i) as IDataObject;
						const body: IDataObject = {};

						if (metadata.publicMetadata) {
							body.public_metadata = parseMetadata(metadata.publicMetadata as string);
						}
						if (metadata.privateMetadata) {
							body.private_metadata = parseMetadata(metadata.privateMetadata as string);
						}
						if (metadata.unsafeMetadata) {
							body.unsafe_metadata = parseMetadata(metadata.unsafeMetadata as string);
						}

						responseData = await clerkApiRequest.call(this, 'PATCH', `/users/${userId}/metadata`, cleanObject(body));
					}
				}

				// ----------------------------------------
				//              Organization
				// ----------------------------------------
				if (resource === 'organization') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const createdBy = this.getNodeParameter('createdBy', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							created_by: createdBy,
						};

						if (additionalFields.slug) body.slug = additionalFields.slug;
						if (additionalFields.maxAllowedMemberships) body.max_allowed_memberships = additionalFields.maxAllowedMemberships;
						if (additionalFields.publicMetadata) {
							body.public_metadata = parseMetadata(additionalFields.publicMetadata as string);
						}
						if (additionalFields.privateMetadata) {
							body.private_metadata = parseMetadata(additionalFields.privateMetadata as string);
						}

						responseData = await clerkApiRequest.call(this, 'POST', '/organizations', cleanObject(body));
					}

					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/organizations/${organizationId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.query) query.query = filters.query;
						if (filters.userId) query.user_id = (filters.userId as string).split(',').map(id => id.trim());
						if (filters.orderBy) query.order_by = filters.orderBy;
						if (filters.includeMembersCount) query.include_members_count = filters.includeMembersCount;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/organizations', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/organizations', {}, query, limit);
						}
					}

					if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.slug) body.slug = updateFields.slug;
						if (updateFields.maxAllowedMemberships !== undefined) body.max_allowed_memberships = updateFields.maxAllowedMemberships;
						if (updateFields.adminDeleteEnabled !== undefined) body.admin_delete_enabled = updateFields.adminDeleteEnabled;
						if (updateFields.publicMetadata) {
							body.public_metadata = parseMetadata(updateFields.publicMetadata as string);
						}
						if (updateFields.privateMetadata) {
							body.private_metadata = parseMetadata(updateFields.privateMetadata as string);
						}

						responseData = await clerkApiRequest.call(this, 'PATCH', `/organizations/${organizationId}`, cleanObject(body));
					}

					if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/organizations/${organizationId}`);
					}

					if (operation === 'updateLogo') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

						const formData = {
							file: {
								value: dataBuffer,
								options: {
									filename: binaryData.fileName || 'logo.png',
									contentType: binaryData.mimeType,
								},
							},
						};

						responseData = await clerkApiRequestUpload.call(this, 'PUT', `/organizations/${organizationId}/logo`, formData);
					}

					if (operation === 'deleteLogo') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/organizations/${organizationId}/logo`);
					}

					if (operation === 'updateMetadata') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const metadata = this.getNodeParameter('metadata', i) as IDataObject;
						const body: IDataObject = {};

						if (metadata.publicMetadata) {
							body.public_metadata = parseMetadata(metadata.publicMetadata as string);
						}
						if (metadata.privateMetadata) {
							body.private_metadata = parseMetadata(metadata.privateMetadata as string);
						}

						responseData = await clerkApiRequest.call(this, 'PATCH', `/organizations/${organizationId}/metadata`, cleanObject(body));
					}
				}

				// ----------------------------------------
				//        Organization Membership
				// ----------------------------------------
				if (resource === 'organizationMembership') {
					if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						const role = this.getNodeParameter('role', i) as string;

						responseData = await clerkApiRequest.call(this, 'POST', `/organizations/${organizationId}/memberships`, {
							user_id: userId,
							role,
						});
					}

					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/organizations/${organizationId}/memberships/${userId}`);
					}

					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.query) query.query = filters.query;
						if (filters.userId) query.user_id = (filters.userId as string).split(',').map(id => id.trim());
						if (filters.role) query.role = (filters.role as string).split(',').map(r => r.trim());
						if (filters.orderBy) query.order_by = filters.orderBy;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', `/organizations/${organizationId}/memberships`, {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', `/organizations/${organizationId}/memberships`, {}, query, limit);
						}
					}

					if (operation === 'update') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						const role = this.getNodeParameter('role', i) as string;

						responseData = await clerkApiRequest.call(this, 'PATCH', `/organizations/${organizationId}/memberships/${userId}`, { role });
					}

					if (operation === 'delete') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/organizations/${organizationId}/memberships/${userId}`);
					}
				}

				// ----------------------------------------
				//        Organization Invitation
				// ----------------------------------------
				if (resource === 'organizationInvitation') {
					if (operation === 'create') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const emailAddress = this.getNodeParameter('emailAddress', i) as string;
						const role = this.getNodeParameter('role', i) as string;
						const inviterUserId = this.getNodeParameter('inviterUserId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							email_address: emailAddress,
							role,
							inviter_user_id: inviterUserId,
						};

						if (additionalFields.redirectUrl) body.redirect_url = additionalFields.redirectUrl;
						if (additionalFields.expiresInDays) body.expires_in_days = additionalFields.expiresInDays;
						if (additionalFields.publicMetadata) {
							body.public_metadata = parseMetadata(additionalFields.publicMetadata as string);
						}
						if (additionalFields.privateMetadata) {
							body.private_metadata = parseMetadata(additionalFields.privateMetadata as string);
						}

						responseData = await clerkApiRequest.call(this, 'POST', `/organizations/${organizationId}/invitations`, cleanObject(body));
					}

					if (operation === 'get') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const invitationId = this.getNodeParameter('invitationId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/organizations/${organizationId}/invitations/${invitationId}`);
					}

					if (operation === 'getAll') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.status) query.status = filters.status;
						if (filters.orderBy) query.order_by = filters.orderBy;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', `/organizations/${organizationId}/invitations`, {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', `/organizations/${organizationId}/invitations`, {}, query, limit);
						}
					}

					if (operation === 'revoke') {
						const organizationId = this.getNodeParameter('organizationId', i) as string;
						const invitationId = this.getNodeParameter('invitationId', i) as string;
						const requestingUserId = this.getNodeParameter('requestingUserId', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/organizations/${organizationId}/invitations/${invitationId}/revoke`, {
							requesting_user_id: requestingUserId,
						});
					}

					if (operation === 'getBulk') {
						const invitationIds = this.getNodeParameter('invitationIds', i) as string;
						const ids = invitationIds.split(',').map(id => id.trim());
						responseData = await clerkApiRequest.call(this, 'GET', '/organization_invitations', {}, {
							organization_invitation_id: ids,
						});
					}
				}

				// ----------------------------------------
				//              Session
				// ----------------------------------------
				if (resource === 'session') {
					if (operation === 'get') {
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/sessions/${sessionId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.clientId) query.client_id = filters.clientId;
						if (filters.userId) query.user_id = filters.userId;
						if (filters.status) query.status = filters.status;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/sessions', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/sessions', {}, query, limit);
						}
					}

					if (operation === 'revoke') {
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/sessions/${sessionId}/revoke`);
					}

					if (operation === 'verify') {
						const sessionId = this.getNodeParameter('sessionId', i) as string;
						const token = this.getNodeParameter('token', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/sessions/${sessionId}/verify`, { token });
					}
				}

				// ----------------------------------------
				//            Email Address
				// ----------------------------------------
				if (resource === 'emailAddress') {
					if (operation === 'create') {
						const userId = this.getNodeParameter('userId', i) as string;
						const emailAddress = this.getNodeParameter('emailAddress', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							user_id: userId,
							email_address: emailAddress,
						};

						if (additionalFields.verified !== undefined) body.verified = additionalFields.verified;
						if (additionalFields.primary !== undefined) body.primary = additionalFields.primary;

						responseData = await clerkApiRequest.call(this, 'POST', '/email_addresses', cleanObject(body));
					}

					if (operation === 'get') {
						const emailAddressId = this.getNodeParameter('emailAddressId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/email_addresses/${emailAddressId}`);
					}

					if (operation === 'delete') {
						const emailAddressId = this.getNodeParameter('emailAddressId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/email_addresses/${emailAddressId}`);
					}

					if (operation === 'update') {
						const emailAddressId = this.getNodeParameter('emailAddressId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};

						if (updateFields.verified !== undefined) body.verified = updateFields.verified;
						if (updateFields.primary !== undefined) body.primary = updateFields.primary;

						responseData = await clerkApiRequest.call(this, 'PATCH', `/email_addresses/${emailAddressId}`, cleanObject(body));
					}
				}

				// ----------------------------------------
				//            Phone Number
				// ----------------------------------------
				if (resource === 'phoneNumber') {
					if (operation === 'create') {
						const userId = this.getNodeParameter('userId', i) as string;
						const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							user_id: userId,
							phone_number: phoneNumber,
						};

						if (additionalFields.verified !== undefined) body.verified = additionalFields.verified;
						if (additionalFields.primary !== undefined) body.primary = additionalFields.primary;
						if (additionalFields.reservedForSecondFactor !== undefined) body.reserved_for_second_factor = additionalFields.reservedForSecondFactor;

						responseData = await clerkApiRequest.call(this, 'POST', '/phone_numbers', cleanObject(body));
					}

					if (operation === 'get') {
						const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/phone_numbers/${phoneNumberId}`);
					}

					if (operation === 'delete') {
						const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/phone_numbers/${phoneNumberId}`);
					}

					if (operation === 'update') {
						const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};

						if (updateFields.verified !== undefined) body.verified = updateFields.verified;
						if (updateFields.primary !== undefined) body.primary = updateFields.primary;
						if (updateFields.reservedForSecondFactor !== undefined) body.reserved_for_second_factor = updateFields.reservedForSecondFactor;
						if (updateFields.defaultSecondFactor !== undefined) body.default_second_factor = updateFields.defaultSecondFactor;

						responseData = await clerkApiRequest.call(this, 'PATCH', `/phone_numbers/${phoneNumberId}`, cleanObject(body));
					}
				}

				// ----------------------------------------
				//              Invitation
				// ----------------------------------------
				if (resource === 'invitation') {
					if (operation === 'create') {
						const emailAddress = this.getNodeParameter('emailAddress', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							email_address: emailAddress,
						};

						if (additionalFields.redirectUrl) body.redirect_url = additionalFields.redirectUrl;
						if (additionalFields.expiresInDays) body.expires_in_days = additionalFields.expiresInDays;
						if (additionalFields.notify !== undefined) body.notify = additionalFields.notify;
						if (additionalFields.ignoreExisting !== undefined) body.ignore_existing = additionalFields.ignoreExisting;
						if (additionalFields.publicMetadata) {
							body.public_metadata = parseMetadata(additionalFields.publicMetadata as string);
						}

						responseData = await clerkApiRequest.call(this, 'POST', '/invitations', cleanObject(body));
					}

					if (operation === 'get') {
						const invitationId = this.getNodeParameter('invitationId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/invitations/${invitationId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.status) query.status = filters.status;
						if (filters.query) query.query = filters.query;
						if (filters.orderBy) query.order_by = filters.orderBy;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/invitations', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/invitations', {}, query, limit);
						}
					}

					if (operation === 'revoke') {
						const invitationId = this.getNodeParameter('invitationId', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', `/invitations/${invitationId}/revoke`);
					}
				}

				// ----------------------------------------
				//         Allowlist Identifier
				// ----------------------------------------
				if (resource === 'allowlistIdentifier') {
					if (operation === 'create') {
						const identifier = this.getNodeParameter('identifier', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							identifier,
						};

						if (additionalFields.notify !== undefined) body.notify = additionalFields.notify;

						responseData = await clerkApiRequest.call(this, 'POST', '/allowlist_identifiers', cleanObject(body));
					}

					if (operation === 'get') {
						const identifierId = this.getNodeParameter('identifierId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/allowlist_identifiers/${identifierId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/allowlist_identifiers');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/allowlist_identifiers', {}, {}, limit);
						}
					}

					if (operation === 'delete') {
						const identifierId = this.getNodeParameter('identifierId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/allowlist_identifiers/${identifierId}`);
					}
				}

				// ----------------------------------------
				//         Blocklist Identifier
				// ----------------------------------------
				if (resource === 'blocklistIdentifier') {
					if (operation === 'create') {
						const identifier = this.getNodeParameter('identifier', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', '/blocklist_identifiers', { identifier });
					}

					if (operation === 'get') {
						const identifierId = this.getNodeParameter('identifierId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/blocklist_identifiers/${identifierId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/blocklist_identifiers');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/blocklist_identifiers', {}, {}, limit);
						}
					}

					if (operation === 'delete') {
						const identifierId = this.getNodeParameter('identifierId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/blocklist_identifiers/${identifierId}`);
					}
				}

				// ----------------------------------------
				//            JWT Template
				// ----------------------------------------
				if (resource === 'jwtTemplate') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const claims = this.getNodeParameter('claims', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							claims: parseMetadata(claims),
						};

						if (additionalFields.lifetime) body.lifetime = additionalFields.lifetime;
						if (additionalFields.allowedClockSkew) body.allowed_clock_skew = additionalFields.allowedClockSkew;
						if (additionalFields.customSigningKey !== undefined) body.custom_signing_key = additionalFields.customSigningKey;
						if (additionalFields.signingAlgorithm) body.signing_algorithm = additionalFields.signingAlgorithm;
						if (additionalFields.signingKey) body.signing_key = additionalFields.signingKey;

						responseData = await clerkApiRequest.call(this, 'POST', '/jwt_templates', cleanObject(body));
					}

					if (operation === 'get') {
						const templateId = this.getNodeParameter('templateId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/jwt_templates/${templateId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/jwt_templates');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/jwt_templates', {}, {}, limit);
						}
					}

					if (operation === 'update') {
						const templateId = this.getNodeParameter('templateId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.claims) body.claims = parseMetadata(updateFields.claims as string);
						if (updateFields.lifetime) body.lifetime = updateFields.lifetime;
						if (updateFields.allowedClockSkew) body.allowed_clock_skew = updateFields.allowedClockSkew;
						if (updateFields.customSigningKey !== undefined) body.custom_signing_key = updateFields.customSigningKey;
						if (updateFields.signingAlgorithm) body.signing_algorithm = updateFields.signingAlgorithm;
						if (updateFields.signingKey) body.signing_key = updateFields.signingKey;

						responseData = await clerkApiRequest.call(this, 'PATCH', `/jwt_templates/${templateId}`, cleanObject(body));
					}

					if (operation === 'delete') {
						const templateId = this.getNodeParameter('templateId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/jwt_templates/${templateId}`);
					}
				}

				// ----------------------------------------
				//              Webhook
				// ----------------------------------------
				if (resource === 'webhook') {
					if (operation === 'create') {
						const endpointUrl = this.getNodeParameter('endpointUrl', i) as string;
						responseData = await clerkApiRequest.call(this, 'POST', '/webhooks/svix', { endpoint_url: endpointUrl });
					}

					if (operation === 'get') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						responseData = await clerkApiRequest.call(this, 'GET', `/webhooks/svix/${webhookId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/webhooks/svix');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await clerkApiRequestAllItems.call(this, 'GET', '/webhooks/svix', {}, {}, limit);
						}
					}

					if (operation === 'update') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						const body: IDataObject = {};

						if (updateFields.endpointUrl) body.endpoint_url = updateFields.endpointUrl;

						responseData = await clerkApiRequest.call(this, 'PATCH', `/webhooks/svix/${webhookId}`, cleanObject(body));
					}

					if (operation === 'delete') {
						const webhookId = this.getNodeParameter('webhookId', i) as string;
						responseData = await clerkApiRequest.call(this, 'DELETE', `/webhooks/svix/${webhookId}`);
					}
				}

				// Handle array or single response
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData! as IDataObject | IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
