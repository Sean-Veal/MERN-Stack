const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.status(200).send({ hi: 'there-ts' });
});

const PORT: number = process.env.PORT || 5000;

app.listen(PORT);
console.log(`App started on port ${PORT}`);