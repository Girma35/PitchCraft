import 'dotenv/config';

const BASE_URL = 'http://localhost:4000';

(async function testFetchEndpoints() {
    try {
        console.log('🧪 Testing Profile Fetch Endpoints\n');
        console.log('='.repeat(60));

        // Test 1: Fetch all profiles
        console.log('\n📋 Test 1: GET /profiles (fetch all)');
        const response1 = await fetch(`${BASE_URL}/profiles?limit=5`);
        const data1 = await response1.json();

        if (response1.ok) {
            console.log('✅ Success');
            console.log(`   Total profiles: ${data1.total}`);
            console.log(`   Returned: ${data1.profiles.length}`);
            if (data1.profiles.length > 0) {
                console.log(`   First profile: ${data1.profiles[0].raw_data?.company_name || 'N/A'}`);
            }
        } else {
            console.error('❌ Failed:', data1.error);
        }

        // Test 2: Fetch by LinkedIn URL
        if (data1.profiles && data1.profiles.length > 0) {
            const testUrl = data1.profiles[0].linkedin_url;
            console.log('\n🔍 Test 2: GET /profiles/:url (fetch by LinkedIn URL)');
            console.log(`   URL: ${testUrl}`);

            const encodedUrl = encodeURIComponent(testUrl);
            const response2 = await fetch(`${BASE_URL}/profiles/${encodedUrl}`);
            const data2 = await response2.json();

            if (response2.ok) {
                console.log('✅ Success');
                console.log(`   Company: ${data2.raw_data?.company_name || 'N/A'}`);
                console.log(`   ID: ${data2.id}`);
                console.log(`   Created: ${data2.created_at}`);
            } else {
                console.error('❌ Failed:', data2.error);
            }

            // Test 3: Fetch by UUID
            const testId = data1.profiles[0].id;
            console.log('\n🆔 Test 3: GET /profiles/:id (fetch by UUID)');
            console.log(`   ID: ${testId}`);

            const response3 = await fetch(`${BASE_URL}/profiles/${testId}`);
            const data3 = await response3.json();

            if (response3.ok) {
                console.log('✅ Success');
                console.log(`   Company: ${data3.raw_data?.company_name || 'N/A'}`);
                console.log(`   URL: ${data3.linkedin_url}`);
            } else {
                console.error('❌ Failed:', data3.error);
            }
        }

        // Test 4: Pagination
        console.log('\n📄 Test 4: GET /profiles?limit=2&offset=0 (pagination)');
        const response4 = await fetch(`${BASE_URL}/profiles?limit=2&offset=0`);
        const data4 = await response4.json();

        if (response4.ok) {
            console.log('✅ Success');
            console.log(`   Page size: ${data4.limit}`);
            console.log(`   Offset: ${data4.offset}`);
            console.log(`   Returned: ${data4.profiles.length}`);
        } else {
            console.error('❌ Failed:', data4.error);
        }

        // Test 5: Not found
        console.log('\n❓ Test 5: GET /profiles/nonexistent (404 test)');
        const response5 = await fetch(`${BASE_URL}/profiles/https://linkedin.com/company/nonexistent-12345`);
        const data5 = await response5.json();

        if (response5.status === 404) {
            console.log('✅ Correctly returns 404');
            console.log(`   Error: ${data5.error}`);
        } else {
            console.error('❌ Expected 404, got:', response5.status);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ ALL FETCH ENDPOINT TESTS COMPLETE!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('\n⚠️  Make sure the server is running:');
        console.error('   npm run server\n');
    }
})();
