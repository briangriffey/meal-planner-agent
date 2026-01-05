-- Auto-verify all existing users to prevent lockout when email verification is enforced
-- This ensures that users who registered before email verification was implemented
-- don't get locked out of their accounts

UPDATE users
SET "emailVerified" = NOW()
WHERE "emailVerified" IS NULL;
