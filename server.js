const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Variável global que guarda o estado atual do Buzzer solicitado pela Web
let statusBuzzer = "BUZZER_OFF";

app.use(express.static(path.join(__dirname, 'public')));

// 1. ROTA QUE O ARDUINO (CLIENTE) VAI ACESSAR PARA SABER O QUE FAZER
app.get('/arduino-status', (req, res) => {
    // Responde textualmente para o Arduino ler de forma simples
    res.send(statusBuzzer);
});

// 2. GERENCIADOR DO WEBSOCKET (INTERFACE WEB <-> SERVIDOR)
wss.on('connection', (ws) => {
    console.log('Navegador Web conectado ao WebSocket!');
    
    // Envia o estado atual assim que a página abre
    ws.send(`Estado atual do servidor: ${statusBuzzer}`);

    ws.on('message', (message) => {
        const comando = message.toString();
        console.log(`Comando recebido da Web: ${comando}`);

        if (comando === 'LIGAR') {
            statusBuzzer = "BUZZER_ON";
            ws.send('Servidor atualizado: Buzzer configurado para LIGAR.');
        } else if (comando === 'DESLIGAR') {
            statusBuzzer = "BUZZER_OFF";
            ws.send('Servidor atualizado: Buzzer configurado para DESLIGAR.');
        }
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
    console.log('Aguardando conexões do Arduino cliente...');
});
