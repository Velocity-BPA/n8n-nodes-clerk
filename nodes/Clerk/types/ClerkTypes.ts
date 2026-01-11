/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface IClerkUser {
	id: string;
	object: 'user';
	external_id: string | null;
	primary_email_address_id: string | null;
	primary_phone_number_id: string | null;
	primary_web3_wallet_id: string | null;
	username: string | null;
	first_name: string | null;
	last_name: string | null;
	profile_image_url: string;
	image_url: string;
	has_image: boolean;
	public_metadata: IDataObject;
	private_metadata: IDataObject;
	unsafe_metadata: IDataObject;
	email_addresses: IClerkEmailAddress[];
	phone_numbers: IClerkPhoneNumber[];
	web3_wallets: IClerkWeb3Wallet[];
	passkeys: IClerkPasskey[];
	password_enabled: boolean;
	two_factor_enabled: boolean;
	totp_enabled: boolean;
	backup_code_enabled: boolean;
	banned: boolean;
	locked: boolean;
	lockout_expires_in_seconds: number | null;
	verification_attempts_remaining: number | null;
	created_at: number;
	updated_at: number;
	delete_self_enabled: boolean;
	create_organization_enabled: boolean;
	last_sign_in_at: number | null;
	last_active_at: number | null;
}

export interface IClerkEmailAddress {
	id: string;
	object: 'email_address';
	email_address: string;
	reserved: boolean;
	verification: IClerkVerification | null;
	linked_to: IClerkLinkedIdentification[];
	created_at: number;
	updated_at: number;
}

export interface IClerkPhoneNumber {
	id: string;
	object: 'phone_number';
	phone_number: string;
	reserved_for_second_factor: boolean;
	default_second_factor: boolean;
	reserved: boolean;
	verification: IClerkVerification | null;
	linked_to: IClerkLinkedIdentification[];
	backup_codes: string[] | null;
	created_at: number;
	updated_at: number;
}

export interface IClerkWeb3Wallet {
	id: string;
	object: 'web3_wallet';
	web3_wallet: string;
	verification: IClerkVerification | null;
	created_at: number;
	updated_at: number;
}

export interface IClerkPasskey {
	id: string;
	object: 'passkey';
	name: string;
	verification: IClerkVerification | null;
	created_at: number;
	updated_at: number;
}

export interface IClerkVerification {
	status: string;
	strategy: string;
	attempts: number | null;
	expire_at: number | null;
	verified_at_client: string | null;
}

export interface IClerkLinkedIdentification {
	type: string;
	id: string;
}

export interface IClerkOrganization {
	id: string;
	object: 'organization';
	name: string;
	slug: string;
	image_url: string;
	has_image: boolean;
	members_count: number;
	pending_invitations_count: number;
	max_allowed_memberships: number;
	admin_delete_enabled: boolean;
	public_metadata: IDataObject;
	private_metadata: IDataObject;
	created_by: string;
	created_at: number;
	updated_at: number;
}

export interface IClerkOrganizationMembership {
	id: string;
	object: 'organization_membership';
	organization: IClerkOrganization;
	public_metadata: IDataObject;
	private_metadata: IDataObject;
	role: string;
	role_name: string;
	permissions: string[];
	created_at: number;
	updated_at: number;
	public_user_data: IClerkPublicUserData;
}

export interface IClerkPublicUserData {
	first_name: string | null;
	last_name: string | null;
	profile_image_url: string;
	image_url: string;
	has_image: boolean;
	identifier: string;
	user_id: string;
}

export interface IClerkOrganizationInvitation {
	id: string;
	object: 'organization_invitation';
	email_address: string;
	role: string;
	role_name: string;
	organization_id: string;
	status: string;
	public_metadata: IDataObject;
	private_metadata: IDataObject;
	created_at: number;
	updated_at: number;
}

export interface IClerkSession {
	id: string;
	object: 'session';
	client_id: string;
	user_id: string;
	status: string;
	last_active_organization_id: string | null;
	last_active_at: number;
	expire_at: number;
	abandon_at: number;
	created_at: number;
	updated_at: number;
}

export interface IClerkInvitation {
	id: string;
	object: 'invitation';
	email_address: string;
	public_metadata: IDataObject;
	status: string;
	url: string | null;
	expires_at: number | null;
	created_at: number;
	updated_at: number;
}

export interface IClerkAllowlistIdentifier {
	id: string;
	object: 'allowlist_identifier';
	identifier: string;
	identifier_type: string;
	created_at: number;
	updated_at: number;
	invitation_id: string | null;
}

export interface IClerkBlocklistIdentifier {
	id: string;
	object: 'blocklist_identifier';
	identifier: string;
	identifier_type: string;
	created_at: number;
	updated_at: number;
}

export interface IClerkJwtTemplate {
	id: string;
	object: 'jwt_template';
	name: string;
	claims: IDataObject;
	lifetime: number;
	allowed_clock_skew: number;
	custom_signing_key: boolean;
	signing_algorithm: string;
	created_at: number;
	updated_at: number;
}

export interface IClerkWebhook {
	id: string;
	object: 'svix_url';
	url: string;
}

export interface IClerkPaginatedResponse<T> {
	data: T[];
	total_count: number;
}

export interface IClerkError {
	errors: Array<{
		code: string;
		message: string;
		long_message: string;
		meta?: {
			param_name?: string;
		};
	}>;
}

export type ClerkResource =
	| 'user'
	| 'organization'
	| 'organizationMembership'
	| 'organizationInvitation'
	| 'session'
	| 'emailAddress'
	| 'phoneNumber'
	| 'invitation'
	| 'allowlistIdentifier'
	| 'blocklistIdentifier'
	| 'jwtTemplate'
	| 'webhook';

export type UserOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'ban'
	| 'unban'
	| 'lock'
	| 'unlock'
	| 'getCount'
	| 'verifyPassword'
	| 'verifyTOTP'
	| 'disableMFA'
	| 'getOrganizationMemberships'
	| 'setProfileImage'
	| 'deleteProfileImage'
	| 'updateMetadata';

export type OrganizationOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete'
	| 'updateLogo'
	| 'deleteLogo'
	| 'updateMetadata';

export type OrganizationMembershipOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete';

export type OrganizationInvitationOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'revoke'
	| 'getBulk';

export type SessionOperation =
	| 'get'
	| 'getAll'
	| 'revoke'
	| 'verify';

export type EmailAddressOperation =
	| 'create'
	| 'get'
	| 'delete'
	| 'update';

export type PhoneNumberOperation =
	| 'create'
	| 'get'
	| 'delete'
	| 'update';

export type InvitationOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'revoke';

export type AllowlistOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'delete';

export type BlocklistOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'delete';

export type JwtTemplateOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete';

export type WebhookOperation =
	| 'create'
	| 'get'
	| 'getAll'
	| 'update'
	| 'delete';
