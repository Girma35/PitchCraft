import './index.js'; // This will start the server on port 4000

const linkedinUrl = 'https://www.linkedin.com/company/apple';
const encoded = encodeURIComponent(linkedinUrl);

console.log(`\n⏳ Waiting for server to start...`);

setTimeout(async () => {
    try {
        console.log(`\n🔍 Testing GET /profiles/${encoded}/raw ...`);

        const res = await fetch(`http://localhost:4000/profiles/${encoded}/raw`);

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        console.log('\n✅ Success! Received raw_data:');
        console.log(JSON.stringify(data, null, 2).substring(0, 500) + '...'); // Truncate for display

    } catch (err) {
        console.error('\n❌ Test Failed:', err.message);
    } finally {
        console.log('\n🛑 Stopping server...');
        process.exit(0);
    }
}, 3000); // Wait 3s to be safe
