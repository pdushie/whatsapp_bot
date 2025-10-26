// Test script to send a message to 0249651750
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testSendMessage() {
    try {
        const phoneNumber = '0249651750';
        const message = 'Hello! This is a test message from your WhatsApp bot. 🤖';
        
        console.log(`Sending test message to ${phoneNumber}...`);
        
        const response = await fetch('https://whatsapp-bot-p8tz.onrender.com/send-message', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                number: phoneNumber, 
                message: message 
            })
        });
        
        const responseText = await response.text();
        console.log('Status Code:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers));
        console.log('Raw Response:', responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
        
        if (response.ok) {
            try {
                const data = JSON.parse(responseText);
                console.log('✅ Message sent successfully!');
                console.log('Response:', data);
            } catch (parseError) {
                console.log('✅ Request successful but response is not JSON');
                console.log('Response:', responseText);
            }
        } else {
            console.log('❌ Failed to send message');
            try {
                const errorData = JSON.parse(responseText);
                console.log('Error:', errorData);
            } catch (parseError) {
                console.log('Server returned HTML error page. Check your Render logs.');
                console.log('Response preview:', responseText.substring(0, 200));
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Check if the WhatsApp client is ready first
async function checkStatus() {
    try {
        console.log('Checking WhatsApp bot status...');
        const response = await fetch('https://whatsapp-bot-p8tz.onrender.com/status');
        const responseText = await response.text();
        
        console.log('Status endpoint response:', responseText);
        
        if (response.ok) {
            try {
                const data = JSON.parse(responseText);
                if (data.ready) {
                    console.log('✅ WhatsApp client is ready!');
                    await testSendMessage();
                } else {
                    console.log('⏳ WhatsApp client is not ready yet. Please scan the QR code first.');
                    console.log('Visit https://whatsapp-bot-p8tz.onrender.com/qr to see the QR code');
                }
            } catch (parseError) {
                console.log('Status endpoint returned non-JSON response:', responseText.substring(0, 200));
            }
        } else {
            console.log('Status endpoint failed with status:', response.status);
            console.log('Response:', responseText.substring(0, 200));
        }
    } catch (error) {
        console.error('❌ Could not connect to the WhatsApp bot. Make sure it\'s running on https://whatsapp-bot-p8tz.onrender.com');
        console.error('Error:', error.message);
    }
}

checkStatus();