// Simple test using built-in modules to send a message to 0249651750
const https = require('https');

function testSendMessage() {
    const phoneNumber = '0249651750';
    const message = 'Hello! This is a test message from your WhatsApp bot. 🤖';
    
    const postData = JSON.stringify({
        number: phoneNumber,
        message: message
    });
    
    const options = {
        hostname: 'whatsapp-bot-xwnv.onrender.com',
        port: 443,
        path: '/send-message',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    console.log(`Sending test message to ${phoneNumber}...`);
    
    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (res.statusCode === 200) {
                    console.log('✅ Message sent successfully!');
                    console.log('Response:', response);
                } else {
                    console.log('❌ Failed to send message');
                    console.log('Error:', response);
                }
            } catch (error) {
                console.log('❌ Error parsing response:', error.message);
                console.log('Raw response:', data);
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Request error:', error.message);
        console.log('Make sure your WhatsApp bot is running on https://whatsapp-bot-p8tz.onrender.com');
    });
    
    req.write(postData);
    req.end();
}

// Check status first
function checkStatus() {
    const options = {
        hostname: 'whatsapp-bot-p8tz.onrender.com',
        port: 443,
        path: '/status',
        method: 'GET'
    };
    
    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.ready) {
                    console.log('✅ WhatsApp client is ready!');
                    testSendMessage();
                } else {
                    console.log('⏳ WhatsApp client is not ready yet. Please scan the QR code first.');
                    console.log('Visit https://whatsapp-bot-p8tz.onrender.com/qr to see the QR code');
                }
            } catch (error) {
                console.log('❌ Error parsing status response:', error.message);
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Could not connect to the WhatsApp bot. Make sure it\'s running on https://whatsapp-bot-p8tz.onrender.com');
        console.error('Error:', error.message);
    });
    
    req.end();
}

checkStatus();