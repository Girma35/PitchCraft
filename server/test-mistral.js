import 'dotenv/config';
import fetch from 'node-fetch';

const PORT = process.env.PORT || 4000;
const BASE_URL = `http://localhost:${PORT}`;

async function testMistralGeneration() {
    console.log('⏳ Waiting for server to start...');
    // Give the server a moment if we were running this in parallel, but here we assume server is running or we run this against a running server.
    // For this script, we assume the user will start the server or it's already running.

    const linkedinUrl = 'https://www.linkedin.com/company/apple';

    console.log(`\n🔍 Testing POST /generate-email with URL: ${linkedinUrl}`);

    try {
        const response = await fetch(`${BASE_URL}/generate-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkedinUrl })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('\n✅ Success! Received Response:');
            console.log('--------------------------------------------------');
            console.log('Email Content:', data.email);
            console.log('--------------------------------------------------');

            if (data.email && data.email.includes('MISTRAL_API_KEY is missing')) {
                console.log('⚠️  Note: Received mock response because MISTRAL_API_KEY is missing in .env');
            } else if (data.email && !data.email.includes('Error')) {
                console.log('🎉 Real Mistral AI response received!');
            }
        } else {
            console.error('\n❌ Error:', data);
        }

    } catch (error) {
        console.error('\n❌ Request Failed:', error.message);
        console.log('Make sure the server is running (npm start) before running this test.');
    }
}

testMistralGeneration();
