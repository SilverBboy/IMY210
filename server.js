const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const cors = require('cors');
const fs = require('fs');
const port = 6969;

const app = express();
const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
const xmlbuilder = new xml2js.Builder();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/api/faqs', async (request, result) => {
	try {
		const data = await accessXDB();
		const faqs = data.faqs.module;

		result.json(faqs);
	} catch (error) {
		result.status(500).json({ error: 'Failed to complete request' });
	}
});

//CREATE SPECIFIC MODULES OPERATION
app.post('/api/faqs/:code', async (request, result) => {
	try {
		const data = await accessXDB();
		const faqs = data.faqs.module;
		// const module = faqs.find((item) => item.code === request.params.code);
		const module = retrieveModule(faqs, request.params.code);
		if (module) {
			module.faq.push(request.body);
			updateXDB(data);
			result.status(201).json({ message: 'FAQ created successfully' });
		} else {
			result.status(404).json({ error: 'Module not found' });
		}
	} catch (error) {
		result.status(500).json({ error: 'Failed to create FAQ' });
	}
});

//READ ALL MODULES OPERATION
app.get('/api/faqs/:code', async (request, result) => {
	try {
		const data = await accessXDB();
		const faqs = data.faqs.module;
		// const module = faqs.find((item) => item.code === request.params.code);
		const module = retrieveModule(faqs, request.params.code);
		if (module) {
		result.json(module);
	} else {
		result.status(404).json({ error: 'Module not found' });
	}
	} catch (error) {
		result.status(500).json({ error: 'Failed to complete request' });
	}
});

// UPDATE MODULE OPERATION
app.put('/api/faqs/:code/:priority', async (request, result) => {
	try {
		const data = await accessXDB();
		const faqs = data.faqs.module;
		// const module = faqs.find((item) => item.code === request.params.code);
		const module = retrieveModule(faqs, request.params.code);
		if (module) {
		const faq = module.faq.find((item) => item.priority === request.params.priority);
		if (faq) {
			faq.tags = request.body.tags;
			faq.question = request.body.question;
			faq.answer = request.body.answer;
			updateXDB(data);
			result.json({ message: 'FAQ updated successfully' });
		} else {
			result.status(404).json({ error: 'FAQ not found' });
		}
		} else {
			result.status(404).json({ error: 'Module not found' });
		}
	} catch (error) {
		result.status(500).json({ error: 'Failed to update FAQ' });
	}
});

// DELETE EXISTING MODULE OPERATION
app.delete('/api/faqs/:code/:priority', async (request, result) => {
	try {
		const data = await accessXDB();
		const faqs = data.faqs.module;
		const module = retrieveModule(faqs, request.params.code);
		if (module) {
			const faqInd = findFAQIndex(module.faq, request.params.priority);
			if (faqInd !== -1) {
				module.faq.splice(faqInd, 1);
				updateXDB(data);
				result.json({ message: 'FAQ deleted successfully' });
			} else {
				result.status(404).json({ error: 'FAQ not found' });
				console.log('FAQ not found');
			}
		} else {
			result.status(404).json({ error: 'Module not found' });
			console.log('Module not found');
		}
	} catch (error) {
		result.status(500).json({ error: 'Failed to delete FAQ' });
		console.log(error.message);
	}
});

function accessXDB() {
	const xmlData = fs.readFileSync('data.xml', 'utf-8');
	return new Promise((resolve, reject) => {
		parser.parseString(xmlData, (error, result) => {
		error ? reject(error) : resolve(result);
		});
	});
}

function updateXDB(data) {
	const xmlData = xmlbuilder.buildObject(data);
	fs.writeFileSync('data.xml', xmlData);
}

function retrieveModule(modules, code){
	var module = null;
	for (let m = 0; m < modules.length; m++){
		if (modules[m].code == code){
			module = modules[m];
		}
	}
	return module;
}

function findFAQIndex(moduleFaqs, faqPriority){
	var ind = -1;
	for (let f = 0; f < moduleFaqs.length; f++){
		console.log(moduleFaqs == faqPriority);
		if (moduleFaqs[f].priority == faqPriority, true){
			ind = f;
		}
	}
	return ind;
}

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});