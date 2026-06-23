import fs from 'fs';
import path from 'path';

async function testUpload() {
    try {
        const formData = new FormData();
        const fileContent = fs.readFileSync('package.json');
        formData.append('images', new Blob([fileContent], { type: 'application/json' }), 'package.json');

        const userInfo = { token: 'dummy_token' }; // It should fail at token verify or file filter

        const response = await fetch('http://localhost:5001/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer dummy_token`,
            },
            body: formData
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testUpload();
