/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.clerk.com/v1';

/**
 * Make an authenticated request to the Clerk API
 */
export async function clerkApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('clerkApi');

	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			Authorization: `Bearer ${credentials.secretKey}`,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (credentials.apiVersion) {
		options.headers!['Clerk-API-Version'] = credentials.apiVersion;
	}

	if (Object.keys(body).length > 0 && method !== 'GET') {
		options.body = body;
	}

	if (Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response;
	} catch (error: unknown) {
		const errorObj = (error || {}) as JsonObject;
		throw new NodeApiError(this.getNode(), errorObj, {
			message: parseClerkError(error),
		});
	}
}

/**
 * Make an authenticated request to upload a file to the Clerk API
 */
export async function clerkApiRequestUpload(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	formData: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('clerkApi');

	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			Authorization: `Bearer ${credentials.secretKey}`,
		},
		formData,
		json: true,
	};

	if (credentials.apiVersion) {
		options.headers!['Clerk-API-Version'] = credentials.apiVersion;
	}

	try {
		const response = await this.helpers.request(options);
		return response;
	} catch (error: unknown) {
		const errorObj = (error || {}) as JsonObject;
		throw new NodeApiError(this.getNode(), errorObj, {
			message: parseClerkError(error),
		});
	}
}

/**
 * Make a paginated request to the Clerk API and return all items
 */
export async function clerkApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	let offset = 0;
	const pageSize = 100;
	const maxItems = limit || Infinity;

	do {
		const response = (await clerkApiRequest.call(this, method, endpoint, body, {
			...query,
			limit: Math.min(pageSize, maxItems - results.length),
			offset,
		})) as IDataObject;

		const items = (response.data as IDataObject[]) || response;

		if (!Array.isArray(items)) {
			results.push(items);
			break;
		}

		results.push(...items);

		if (items.length < pageSize || results.length >= maxItems) {
			break;
		}

		offset += pageSize;
	// eslint-disable-next-line no-constant-condition
	} while (true);

	return results.slice(0, maxItems);
}

/**
 * Parse Clerk API error response
 */
function parseClerkError(error: unknown): string {
	const err = error as {
		response?: {
			body?: {
				errors?: Array<{
					message: string;
					long_message?: string;
					code?: string;
				}>;
			};
		};
		message?: string;
	};

	if (err?.response?.body?.errors) {
		const errors = err.response.body.errors;
		if (errors.length > 0) {
			const firstError = errors[0];
			return firstError.long_message || firstError.message || 'Unknown Clerk API error';
		}
	}

	if (err?.message) {
		return err.message;
	}

	return 'Unknown Clerk API error';
}

/**
 * Convert metadata string to JSON object
 */
export function parseMetadata(metadataString: string | undefined): IDataObject | undefined {
	if (!metadataString) {
		return undefined;
	}

	try {
		return JSON.parse(metadataString) as IDataObject;
	} catch {
		return undefined;
	}
}

/**
 * Build query parameters for list operations
 */
export function buildListQuery(
	this: IExecuteFunctions,
	i: number,
	additionalFields: IDataObject,
): IDataObject {
	const query: IDataObject = {};

	if (additionalFields.emailAddress) {
		query.email_address = additionalFields.emailAddress;
	}

	if (additionalFields.phoneNumber) {
		query.phone_number = additionalFields.phoneNumber;
	}

	if (additionalFields.externalId) {
		query.external_id = additionalFields.externalId;
	}

	if (additionalFields.username) {
		query.username = additionalFields.username;
	}

	if (additionalFields.web3Wallet) {
		query.web3_wallet = additionalFields.web3Wallet;
	}

	if (additionalFields.userId) {
		query.user_id = additionalFields.userId;
	}

	if (additionalFields.query) {
		query.query = additionalFields.query;
	}

	if (additionalFields.orderBy) {
		query.order_by = additionalFields.orderBy;
	}

	if (additionalFields.lastActiveAtSince) {
		query.last_active_at_since = new Date(additionalFields.lastActiveAtSince as string).getTime();
	}

	if (additionalFields.createdAtBefore) {
		query.created_at_before = new Date(additionalFields.createdAtBefore as string).getTime();
	}

	if (additionalFields.createdAtAfter) {
		query.created_at_after = new Date(additionalFields.createdAtAfter as string).getTime();
	}

	return query;
}

/**
 * Clean object by removing undefined and null values
 */
export function cleanObject(obj: IDataObject): IDataObject {
	const result: IDataObject = {};

	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined && value !== null && value !== '') {
			result[key] = value;
		}
	}

	return result;
}

/**
 * Convert camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Convert object keys from camelCase to snake_case
 */
export function convertKeysToSnakeCase(obj: IDataObject): IDataObject {
	const result: IDataObject = {};

	for (const [key, value] of Object.entries(obj)) {
		const snakeKey = toSnakeCase(key);
		result[snakeKey] = value;
	}

	return result;
}
