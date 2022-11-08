import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/music', (req, res) => {
	res.json({ status: 'Success' });
});

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
