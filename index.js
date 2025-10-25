const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

console.log('Starting WhatsApp Bot...');

const app = express();
const PORT = process.env.PORT || 3000;

// Add global error handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

console.log('Express app initialized');

let qrCodeData = '';
let clientReady = false;

// Initialize WhatsApp client with LocalAuth for session persistence
console.log('Initializing WhatsApp client...');
const client = new Client({
    authStrategy: new LocalAuth()
});
console.log('WhatsApp client created');

client.on('qr', async (qr) => {
    console.log('QR Code received');
    qrCodeData = await qrcode.toDataURL(qr);
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
    clientReady = true;
});

client.on('message', msg => {
    if (msg.body === '!ping') {
        msg.reply('pong');
    }
});

client.on('auth_failure', msg => {
    console.error('Authentication failed:', msg);
});

client.on('disconnected', (reason) => {
    console.log('WhatsApp client disconnected:', reason);
});

console.log('Setting up WhatsApp client event listeners...');
console.log('Initializing WhatsApp client...');
client.initialize();

// API routes
app.get('/', (req, res) => {
    res.send('WhatsApp Bot is running!');
});

app.get('/qr', (req, res) => {
    if (clientReady) {
        res.send('Client is already authenticated and ready!');
    } else if (qrCodeData) {
        res.send(`<img src="${qrCodeData}" alt="QR Code"/>`);
    } else {
        res.send('QR Code not generated yet. Please wait...');
    }
});

app.get('/status', (req, res) => {
    res.json({ ready: clientReady });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
