// Keep-alive script to prevent Render app from sleeping
// Run this periodically (every 10-14 minutes) to keep your app warm

const https = require('https');

function pingServer() {
    const options = {
        hostname: 'whatsapp-bot-p8tz.onrender.com',
        port: 443,
        path: '/ping',
        method: 'GET'
    };
    
    console.log(`[${new Date().toISOString()}] Pinging server...`);
    
    const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log(`✅ Server is alive. Uptime: ${Math.floor(response.uptime)}s`);
            } catch (error) {
                console.log('✅ Server responded (non-JSON)');
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Ping failed:', error.message);
    });
    
    req.end();
}

// Ping immediately
pingServer();

// Set up interval to ping every 10 minutes (600000ms)
// Free tier apps sleep after 15 minutes of inactivity
setInterval(pingServer, 10 * 60 * 1000);

console.log('Keep-alive script started. Pinging every 10 minutes...');
console.log('Press Ctrl+C to stop');