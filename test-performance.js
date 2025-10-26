// Performance test script to measure message sending speed
const https = require('https');

function testMessageTiming() {
    const phoneNumber = '0249651750';
    const message = `Performance test message sent at ${new Date().toLocaleTimeString()} 🚀`;
    
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
    
    console.log('🚀 Starting performance test...');
    const startTime = Date.now();
    
    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            const totalTime = Date.now() - startTime;
            
            try {
                const response = JSON.parse(data);
                if (res.statusCode === 200) {
                    console.log('✅ Message sent successfully!');
                    console.log(`📊 Total request time: ${totalTime}ms`);
                    console.log(`📊 Server processing time: ${response.duration || 'N/A'}`);
                    console.log(`📱 Sent to: ${response.to}`);
                } else {
                    console.log('❌ Failed to send message');
                    console.log(`⏱️  Failed after: ${totalTime}ms`);
                    console.log('Error:', response);
                }
            } catch (error) {
                console.log('❌ Error parsing response:', error.message);
                console.log(`⏱️  Total time: ${totalTime}ms`);
                console.log('Raw response:', data.substring(0, 200));
            }
        });
    });
    
    req.on('error', (error) => {
        const totalTime = Date.now() - startTime;
        console.error('❌ Request error:', error.message);
        console.log(`⏱️  Failed after: ${totalTime}ms`);
    });
    
    req.write(postData);
    req.end();
}

// Check if server is warm first
function checkServerStatus() {
    const options = {
        hostname: 'whatsapp-bot-p8tz.onrender.com',
        port: 443,
        path: '/status',
        method: 'GET'
    };
    
    console.log('🔍 Checking server status...');
    const startTime = Date.now();
    
    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            const responseTime = Date.now() - startTime;
            
            try {
                const response = JSON.parse(data);
                console.log(`📊 Status check took: ${responseTime}ms`);
                console.log(`🔥 Server uptime: ${Math.floor(response.uptime)}s`);
                
                if (response.ready) {
                    console.log('✅ WhatsApp client is ready!');
                    console.log('---');
                    testMessageTiming();
                } else {
                    console.log('⏳ WhatsApp client is not ready yet.');
                    console.log('Visit https://whatsapp-bot-p8tz.onrender.com/qr to authenticate');
                }
            } catch (error) {
                console.log('❌ Error parsing status:', error.message);
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Status check failed:', error.message);
    });
    
    req.end();
}

checkServerStatus();