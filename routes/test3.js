const express = require('express');
const app = express();

app.get('/routes/test3.js', (req, res) => {
    res.send('こんにちは、えくすぷれす。');
});