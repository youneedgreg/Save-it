# Supabase Email Templates

This directory contains HTML email templates for Supabase authentication flows.

## Templates Included

1. **confirm-signup.html** - Email sent when a user signs up and needs to confirm their email address
2. **invite-user.html** - Email sent when inviting a new user to join Save It
3. **magic-link.html** - Email sent when a user requests a passwordless sign-in link
4. **change-email.html** - Email sent when a user changes their email address and needs to verify the new one
5. **reset-password.html** - Email sent when a user requests a password reset
6. **reauthentication.html** - Email sent when a user needs to re-authenticate for sensitive actions

## How to Use

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. For each template type, click **Edit** and paste the corresponding HTML content
4. Save your changes

### Option 2: Supabase CLI

If you're using Supabase CLI, you can configure these templates in your project configuration.

## Template Variables

Supabase automatically replaces these variables in the templates:

- `{{ .ConfirmationURL }}` - The confirmation/verification link URL
- `{{ .Email }}` - The user's email address
- `{{ .Token }}` - The verification token (if needed)
- `{{ .TokenHash }}` - The hashed token (if needed)
- `{{ .SiteURL }}` - Your site's base URL

## Customization

All templates use:
- **Brand Colors**: Purple gradient (`#667eea` to `#764ba2`)
- **Responsive Design**: Works on desktop and mobile devices
- **Accessible HTML**: Proper semantic structure and alt text
- **Professional Styling**: Clean, modern design

### To Customize Colors:

Replace the gradient colors in the header and button styles:
- Current: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Change to your brand colors as needed

### To Customize Branding:

Update the footer section in each template with your company information.

## Testing

After updating templates in Supabase:

1. Test each email flow in your application
2. Check that links work correctly
3. Verify emails render properly in different email clients (Gmail, Outlook, etc.)
4. Ensure mobile responsiveness works

## Notes

- All templates are HTML-only (no external CSS dependencies)
- Inline styles are used for maximum email client compatibility
- Links use the `{{ .ConfirmationURL }}` variable which Supabase generates automatically
- Security notices are included where appropriate
- Expiration times mentioned in emails should match your Supabase configuration

