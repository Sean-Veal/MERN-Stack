import * as express from 'express';
import app from './app';

declare var process; 

const PORT: number = process.env.PORT || 5000;

app.listen(PORT);
console.log(`App started on port ${PORT}`);