import { createClient } from '@supabase/supabase-js';

export const handler = async (event: any) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      statusCode: 501,
      headers,
      body: JSON.stringify({
        error: 'SUPABASE_SERVICE_ROLE_KEY is not configured on Netlify environment.',
      }),
    };
  }

  // Security Verification: Require valid Bearer token from an active SUPER_ADMIN
  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized: Missing or invalid Bearer authorization token.' }),
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Validate the caller's JWT token
    const { data: { user: callerUser }, error: tokenErr } = await supabaseAdmin.auth.getUser(token);
    if (tokenErr || !callerUser) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized: Invalid or expired administrator session.' }),
      };
    }

    // Verify caller role is SUPER_ADMIN and active
    const { data: callerProfile, error: callerProfileErr } = await supabaseAdmin
      .from('admin_profiles')
      .select('role, is_active')
      .eq('id', callerUser.id)
      .maybeSingle();

    if (callerProfileErr || !callerProfile || !callerProfile.is_active || callerProfile.role !== 'SUPER_ADMIN') {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Forbidden: Only active Super Administrators can perform administrative user provisioning.' }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { action, fullName, username, email, password, role } = body;

    if (action === 'create-user') {
      if (!email || !password || !username || !fullName) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Missing required administrator user fields.' }),
        };
      }

      if (password.length < 8) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Password must be at least 8 characters long.' }),
        };
      }

      // Create identity using Supabase Admin Auth (auto-confirms email)
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName.trim(),
          username: username.trim().toLowerCase(),
          role: role || 'ADMIN',
        },
      });

      if (createError || !userData.user) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: createError?.message || 'Failed to create user in Auth.' }),
        };
      }

      const profile = {
        id: userData.user.id,
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        role: role || 'ADMIN',
        is_active: true,
        created_by: callerUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabaseAdmin
        .from('admin_profiles')
        .upsert(profile);

      if (profileError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: `User created, but profile update failed: ${profileError.message}` }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, profile }),
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Unknown action: ${action}` }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Internal server error' }),
    };
  }
};
