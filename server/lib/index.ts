import * as express from 'express';

const app = express();

declare var process; 

const PORT: number = process.env.PORT || 5000;

app.listen(PORT);
console.log(`App started on port ${PORT}`);