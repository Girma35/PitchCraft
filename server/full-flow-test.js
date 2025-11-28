import 'dotenv/config';
import { ApifyClient } from 'apify-client';
import { createClient } from '@supabase/supabase-js';

(async function testFullFlow() {
    try {
        console.log('🔄 Testing Complete Flow: Apify → Supabase\n');
        console.log('='.repeat(60));

        // 1. Initialize clients
        const apifyClient = new ApifyClient({ token: process.env.APIFY_TOKEN });
        const supabase = createClient(
            process.env.VITE_SUPABASE_URL,
            process.env.VITE_SUPABASE_ANON_KEY
        );

        console.log('\n✅ Clients initialized');

        // 2. Scrape LinkedIn company profile
        console.log('\n📥 Step 1: Scraping LinkedIn with Apify...');
        const linkedinUrl = 'https://www.linkedin.com/company/apple';
        console.log(`   URL: ${linkedinUrl}`);

        const run = await apifyClient.actor('z2Fffb9ooRhoCtS15').call({
            company_profile_urls: [linkedinUrl],
            proxy_group: "DATACENTER"
        });

        const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();
        const rawData = items[0];

        console.log('✅ Scraping complete');
        console.log(`   Fields received: ${Object.keys(rawData).length}`);
        console.log(`   Sample fields: ${Object.keys(rawData).slice(0, 5).join(', ')}...`);

        // 3. Save to Supabase (upsert - insert or update)
        console.log('\n💾 Step 2: Saving to Supabase...');
        console.log('   Schema: { linkedin_url, raw_data }');

        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                linkedin_url: linkedinUrl,
                raw_data: rawData
            }, {
                onConflict: 'linkedin_url'  // Specify which column to check for conflicts
            })
            .select();

        if (error) {
            console.error('❌ Supabase error:', error.message);
            process.exit(1);
        }

        const profile = data[0];
        console.log('✅ Saved to Supabase (upserted)');
        console.log(`   Profile ID: ${profile.id}`);
        console.log(`   Created/Updated at: ${profile.created_at}`);

        // 4. Retrieve and verify
        console.log('\n🔍 Step 3: Retrieving from Supabase...');
        const { data: retrieved, error: retrieveError } = await supabase
            .from('profiles')
            .select('*')
            .eq('linkedin_url', linkedinUrl)
            .single();

        if (retrieveError) {
            console.error('❌ Retrieve error:', retrieveError.message);
            process.exit(1);
        }

        console.log('✅ Retrieved successfully');
        console.log(`   Company: ${retrieved.raw_data.company_name || 'N/A'}`);
        console.log(`   Industry: ${retrieved.raw_data.industry || 'N/A'}`);
        console.log(`   Followers: ${retrieved.raw_data.followersCount || 'N/A'}`);

        console.log('\n' + '='.repeat(60));
        console.log('✅ COMPLETE FLOW WORKS PERFECTLY!');
        console.log('='.repeat(60));
        console.log('\n✨ Apify → JSON → Supabase (raw_data JSONB)');
        console.log('   Simple, clean, no field extraction needed!\n');

    } catch (err) {
        console.error('\n❌ Test failed:', err.message);
        console.error(err);
        process.exit(1);
    }
})();
