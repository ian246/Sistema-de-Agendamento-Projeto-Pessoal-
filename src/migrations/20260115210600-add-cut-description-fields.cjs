/**
 * Migration: Add cut description and reference image fields to appointments
 * 
 * Adds columns:
 * - cut_description (TEXT): Client's description of desired cut
 * - reference_image_url (TEXT): URL to reference image uploaded by client
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function up() {
    console.log('Running migration: add-cut-description-fields');

    // Add cut_description column
    const { error: error1 } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cut_description TEXT;`
    });

    if (error1) {
        console.log('Note: cut_description column may already exist or RPC not available');
        console.log('Please run manually in Supabase SQL Editor:');
        console.log('ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cut_description TEXT;');
    } else {
        console.log('✅ Added cut_description column');
    }

    // Add reference_image_url column
    const { error: error2 } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reference_image_url TEXT;`
    });

    if (error2) {
        console.log('Note: reference_image_url column may already exist or RPC not available');
        console.log('Please run manually in Supabase SQL Editor:');
        console.log('ALTER TABLE appointments ADD COLUMN IF NOT EXISTS reference_image_url TEXT;');
    } else {
        console.log('✅ Added reference_image_url column');
    }

    console.log('\n📋 If columns were not added automatically, run this SQL in Supabase:');
    console.log(`
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS cut_description TEXT,
ADD COLUMN IF NOT EXISTS reference_image_url TEXT;
    `);
}

async function down() {
    console.log('Rollback: Removing cut_description and reference_image_url columns');
    console.log('Run manually in Supabase SQL Editor:');
    console.log(`
ALTER TABLE appointments 
DROP COLUMN IF EXISTS cut_description,
DROP COLUMN IF EXISTS reference_image_url;
    `);
}

// Run migration
up().then(() => {
    console.log('Migration completed');
    process.exit(0);
}).catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});

module.exports = { up, down };
