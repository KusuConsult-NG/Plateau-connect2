# Admin Registration Guide

## Creating Admin Accounts

Admin accounts are secured with invite codes to prevent unauthorized access.

### Access the Admin Registration Page

Navigate to: **`/admin/register`**

### Valid Invite Codes (Development)

For development and testing, use any of these codes:

```
ADMIN-2024-PLATEAU
SUPER-ADMIN-KEY
PLATEAU-CONNECT-ADMIN
```

### Registration Process

1. **Visit** `/admin/register`
2. **Enter Invite Code** - One of the codes listed above
3. **Fill in Details**:
   - Full Name
   - Email Address
   - Phone Number (optional)
   - Password (minimum 8 characters)
4. **Submit** - Your admin account will be created
5. **Login** at `/login` with your new credentials

### After Login

Admin users are automatically redirected to `/admin` dashboard where you can:
- View all users, rides, and payments
- Manage ride requests
- Assign drivers
- View analytics and metrics

## Security Notes

> [!WARNING]
> **Production Deployment**
> 
> Before deploying to production:
> 1. Move invite codes to database with expiration dates
> 2. Add invite code generation API for existing admins
> 3. Implement email verification
> 4. Add audit logging for admin account creation

## Creating Invite Codes (Future)

In production, implement an API endpoint for existing admins to generate invite codes:

```typescript
// Example future implementation
POST /api/admin/invite-codes
{
  "email": "newadmin@example.com",
  "expiresIn": 7 // days
}
```

This will:
- Generate a unique code
- Email it to the invitee
- Set expiration date
- Track usage

## Revoking Admin Access

To revoke admin access, update the user's role in the database:

```sql
UPDATE "User" 
SET role = 'RIDER' 
WHERE email = 'admin@example.com';
```

Or use Prisma Studio:
```bash
npx prisma studio
```

Navigate to the User model and change the role field.
