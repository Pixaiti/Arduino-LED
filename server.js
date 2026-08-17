const express = require('express');
const path = require('path');
const app = express();

let statusBuzzer = "BUZZER_OFF";

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/buzzer', (req, res) => {
    const { acao } = req.body; 
    
    if (acao === 'LIGAR') {
        statusBuzzer = "BUZZER_ON";
    } else if (acao === 'DESLIGAR') {
        statusBuzzer = "BUZZER_OFF";
    }
    
    console.log(`Estado alterado para: ${statusBuzzer}`);
    res.json({ status: "sucesso", atual: statusBuzzer });
});

app.get('/arduino-status', (req, res) => {
    res.send(statusBuzzer);
});

serverPort = process.env.PORT || 80;
app.listen(serverPort, () => {
    console.log(`Servidor HTTP rodando em http://localhost:${serverPort}`);
});
