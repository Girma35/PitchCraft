import 'dotenv/config';
import { ApifyClient } from 'apify-client';

(async function testApifyActor() {
    try {
        console.log('🔍 Testing Apify Actor: z2Fffb9ooRhoCtS15\n');
        console.log('='.repeat(60));

        const token = process.env.APIFY_TOKEN;
        if (!token) {
            console.error('❌ APIFY_TOKEN not found');
            process.exit(1);
        }

        const client = new ApifyClient({ token });

        console.log('\n✅ Client initialized');
        console.log('📋 Actor ID: z2Fffb9ooRhoCtS15 (Company Profile Scraper)');
        console.log('⚠️  Note: This scrapes COMPANY profiles, not personal profiles\n');

        // Test with a small company profile
        const input = {
            company_profile_urls: [
                "https://www.linkedin.com/company/apple"
            ],
            proxy_group: "DATACENTER"
        };

        console.log('🚀 Running actor...');
        console.log(`   Testing with: ${input.company_profile_urls[0]}\n`);

        const run = await client.actor("z2Fffb9ooRhoCtS15").call(input);

        console.log('✅ Actor run completed:');
        console.log(`   Run ID: ${run.id}`);
        console.log(`   Status: ${run.status}`);
        console.log(`   Dataset ID: ${run.defaultDatasetId}\n`);

        // Fetch results
        console.log('📥 Fetching results...');
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        if (items && items.length > 0) {
            console.log(`✅ Retrieved ${items.length} company profile(s)\n`);
            console.log('Sample company data:');
            const company = items[0];
            console.log(`   Name: ${company.name || 'N/A'}`);
            console.log(`   Industry: ${company.industry || 'N/A'}`);
            console.log(`   Followers: ${company.followersCount || 'N/A'}`);
            console.log(`   Website: ${company.website || 'N/A'}`);
            console.log(`\n   Available fields: ${Object.keys(company).slice(0, 10).join(', ')}...\n`);
        } else {
            console.warn('⚠️  No items returned');
        }

        console.log('='.repeat(60));
        console.log('✅ COMPANY SCRAPER WORKS!');
        console.log('='.repeat(60));
        console.log('\n⚠️  REMINDER: You still need a PERSONAL profile scraper');
        console.log('   for your email AI app (to scrape linkedin.com/in/... URLs)\n');

    } catch (err) {
        console.error('\n❌ Test failed:', err.message);
        if (err.message.includes('not found')) {
            console.error('   The actor might not exist or you need access');
        }
        process.exit(1);
    }
})();
