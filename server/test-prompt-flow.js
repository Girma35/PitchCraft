import './index.js'; // Start server

const linkedinUrl = 'https://www.linkedin.com/company/apple';
const senderName = 'Test User';
const senderCompany = 'Test Corp';

console.log(`\n⏳ Waiting for server to start...`);

setTimeout(async () => {
    try {
        console.log(`\n🔍 Testing POST /prepare-prompt with URL: ${linkedinUrl}`);

        const res = await fetch('http://localhost:4000/prepare-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkedinUrl, senderName, senderCompany })
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        console.log('\n✅ Success! Received Prompt:');
        console.log('--------------------------------------------------');
        console.log(data.prompt);
        console.log('--------------------------------------------------');

        if (data.prompt.includes('Apple')) {
            console.log('✅ Verification Passed: Prompt contains company name "Apple" (from DB/Apify)');
        } else {
            console.error('❌ Verification Failed: Prompt missing company name');
        }

    } catch (err) {
        console.error('\n❌ Test Failed:', err.message);
    } finally {
        console.log('\n🛑 Stopping server...');
        process.exit(0);
    }
}, 3000);
