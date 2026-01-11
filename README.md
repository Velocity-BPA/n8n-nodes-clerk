# n8n-nodes-clerk

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Clerk authentication platform providing 12 resources and 80+ operations for user management, organizations, sessions, and authentication workflows.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **User Management**: Create, update, delete, ban, lock users with full metadata support
- **Organizations**: Manage organizations, memberships, invitations, and logos
- **Sessions**: List, verify, and revoke user sessions
- **Authentication**: Email addresses, phone numbers, and MFA operations
- **Access Control**: Allowlist and blocklist management
- **JWT Templates**: Create and manage custom JWT templates
- **Webhooks**: Configure webhook endpoints for real-time events
- **Trigger Node**: Respond to Clerk events with SVIX signature verification

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-clerk`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-clerk
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-clerk.git
cd n8n-nodes-clerk

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-clerk

# Restart n8n
```

## Credentials Setup

| Property | Type | Description |
|----------|------|-------------|
| Secret Key | Password | Your Clerk secret key (sk_live_xxx or sk_test_xxx) |
| API Version | String | Optional API version date (e.g., 2024-10-01) |

### Getting Your Clerk Secret Key

1. Log into your [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** in the sidebar
4. Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)

## Resources & Operations

### User (17 operations)

| Operation | Description |
|-----------|-------------|
| Create | Create a new user account |
| Get | Get user by ID |
| Get All | List all users with filters |
| Update | Update user properties |
| Delete | Permanently delete user |
| Ban | Ban user from signing in |
| Unban | Remove user ban |
| Lock | Lock user account |
| Unlock | Unlock user account |
| Get Count | Get total user count |
| Verify Password | Verify user password |
| Verify TOTP | Verify TOTP code |
| Disable MFA | Disable all MFA methods |
| Get Organization Memberships | List user's organizations |
| Set Profile Image | Upload profile image |
| Delete Profile Image | Remove profile image |
| Update Metadata | Update user metadata |

### Organization (8 operations)

| Operation | Description |
|-----------|-------------|
| Create | Create new organization |
| Get | Get organization by ID or slug |
| Get All | List all organizations |
| Update | Update organization settings |
| Delete | Remove organization |
| Update Logo | Upload organization logo |
| Delete Logo | Remove organization logo |
| Update Metadata | Update organization metadata |

### Organization Membership (5 operations)

| Operation | Description |
|-----------|-------------|
| Create | Add user to organization |
| Get | Get membership by ID |
| Get All | List all memberships |
| Update | Update membership role |
| Delete | Remove membership |

### Organization Invitation (5 operations)

| Operation | Description |
|-----------|-------------|
| Create | Create invitation |
| Get | Get invitation by ID |
| Get All | List invitations for organization |
| Revoke | Revoke pending invitation |
| Get Bulk | Get invitations in bulk |

### Session (4 operations)

| Operation | Description |
|-----------|-------------|
| Get | Get session by ID |
| Get All | List all sessions |
| Revoke | Revoke specific session |
| Verify | Verify session token |

### Email Address (4 operations)

| Operation | Description |
|-----------|-------------|
| Create | Add email to user |
| Get | Get email address by ID |
| Delete | Remove email address |
| Update | Update email properties |

### Phone Number (4 operations)

| Operation | Description |
|-----------|-------------|
| Create | Add phone to user |
| Get | Get phone number by ID |
| Delete | Remove phone number |
| Update | Update phone properties |

### Invitation (4 operations)

| Operation | Description |
|-----------|-------------|
| Create | Create user invitation |
| Get | Get invitation by ID |
| Get All | List all invitations |
| Revoke | Revoke invitation |

### Allowlist Identifier (4 operations)

| Operation | Description |
|-----------|-------------|
| Create | Add to allowlist |
| Get | Get allowlist entry |
| Get All | List allowlist entries |
| Delete | Remove from allowlist |

### Blocklist Identifier (4 operations)

| Operation | Description |
|-----------|-------------|
| Create | Add to blocklist |
| Get | Get blocklist entry |
| Get All | List blocklist entries |
| Delete | Remove from blocklist |

### JWT Template (5 operations)

| Operation | Description |
|-----------|-------------|
| Create | Create JWT template |
| Get | Get template by ID |
| Get All | List all templates |
| Update | Update template |
| Delete | Remove template |

### Webhook (5 operations)

| Operation | Description |
|-----------|-------------|
| Create | Create webhook endpoint |
| Get | Get webhook by ID |
| Get All | List all webhooks |
| Update | Update webhook settings |
| Delete | Remove webhook |

## Trigger Node

The Clerk Trigger node listens for webhook events from Clerk with SVIX signature verification.

### Supported Events

- User events: `user.created`, `user.updated`, `user.deleted`
- Session events: `session.created`, `session.ended`, `session.removed`, `session.revoked`
- Organization events: `organization.created`, `organization.updated`, `organization.deleted`
- Membership events: `organizationMembership.created`, `organizationMembership.updated`, `organizationMembership.deleted`
- Invitation events: `organizationInvitation.created`, `organizationInvitation.accepted`, `organizationInvitation.revoked`
- Email/SMS events: `email.created`, `sms.created`

### Setting Up Webhooks

1. In your Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Enter your n8n webhook URL (shown in the Clerk Trigger node)
4. Select the events you want to receive
5. Copy the **Signing Secret** and paste it in the node configuration

## Usage Examples

### Create a User

```javascript
// Using the Clerk node with 'Create' operation
{
  "resource": "user",
  "operation": "create",
  "emailAddress": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securePassword123"
}
```

### List Organization Members

```javascript
// Using the Clerk node with 'Get All' operation
{
  "resource": "organizationMembership",
  "operation": "getAll",
  "organizationId": "org_xxxxx",
  "returnAll": true
}
```

### Handle User Created Event

```javascript
// Clerk Trigger output
{
  "type": "user.created",
  "data": {
    "id": "user_xxxxx",
    "email_addresses": [
      { "email_address": "user@example.com" }
    ],
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

## Clerk Concepts

### User Identifiers

Users in Clerk are identified by various means:
- **User ID**: Unique identifier (user_xxx)
- **Email Address**: Primary or additional email addresses
- **Phone Number**: E.164 format phone numbers
- **External ID**: ID from external systems
- **Username**: Optional username

### Organizations

Organizations allow grouping users with roles and permissions:
- **Organization ID**: Unique identifier (org_xxx)
- **Slug**: URL-friendly identifier
- **Roles**: admin, basic_member, or custom roles
- **Memberships**: User-organization relationships

### Metadata Types

Clerk supports three types of metadata:
- **Public Metadata**: Visible to users, set by server
- **Private Metadata**: Server-side only, hidden from users
- **Unsafe Metadata**: Client-writable, use with caution

## Error Handling

The node handles Clerk API errors gracefully:

| Error Code | Description |
|------------|-------------|
| `form_identifier_exists` | Duplicate email/phone |
| `resource_not_found` | Resource doesn't exist |
| `authentication_invalid` | Invalid API key |
| `authorization_invalid` | Insufficient permissions |
| `rate_limit_exceeded` | Too many requests |
| `request_body_invalid` | Invalid request body |

Enable **Continue On Fail** to handle errors within workflows without stopping execution.

## Security Best Practices

1. **Use Production Keys**: Use `sk_live_` keys for production, `sk_test_` for testing
2. **Verify Webhooks**: Always enable SVIX signature verification
3. **Protect Metadata**: Don't store sensitive data in unsafe metadata
4. **Limit Permissions**: Use least-privilege access patterns
5. **Monitor Sessions**: Regularly audit and revoke inactive sessions

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all tests pass and code follows the existing style.

## Support

- **Documentation**: [Clerk API Docs](https://clerk.com/docs/reference/backend-api)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-clerk/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [Clerk](https://clerk.com) for providing the authentication platform
- [n8n](https://n8n.io) for the workflow automation platform
- [SVIX](https://svix.com) for webhook infrastructure
