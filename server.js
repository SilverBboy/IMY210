const express = require('express');
const api = require('./api');

const port = 6969;
const app = express();

//START SERVER
app.listen(port, () => {
	console.log(`Server is on port ${port}`);
});

//PROVIDE API CALLS
app.use('/api', api);