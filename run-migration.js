const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Read migration SQL file
const sqlPath = path.join(__dirname, 'migration-manual.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

async function runMigration() {
  console.log('Running migration...');

  try {
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If exec_sql function doesn't exist, try alternative method
      console.log('Trying alternative method with individual queries...');

      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        const { error: stmtError } = await supabase.rpc('exec', {
          query: statement
        });

        if (stmtError) {
          console.error('Error executing statement:', stmtError);
          console.log('Statement:', statement.substring(0, 100) + '...');
        }
      }
    }

    console.log('Migration completed!');
    console.log('\nPlease refresh your app to see the changes.');
  } catch (err) {
    console.error('Error running migration:', err);
    console.log('\n==================================');
    console.log('Alternative: Copy the SQL manually');
    console.log('==================================');
    console.log('\n1. Open Supabase Dashboard: https://supabase.com/dashboard/project/xhczueopyopbthkqaqvv/editor');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the SQL from: migration-manual.sql');
    console.log('4. Click "Run"');
  }
}

runMigration();
