const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const fs = require('fs');
const cors = require('cors');

const app = express();
const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
const builder = new xml2js.Builder();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Read XML Data
function readXMLData() {
  const xmlData = fs.readFileSync('data.xml', 'utf-8');
  return new Promise((resolve, reject) => {
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Update XML Data
function updateXMLData(data) {
  const xmlData = builder.buildObject(data);
  fs.writeFileSync('data.xml', xmlData);
}

// Retrieve all FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    const data = await readXMLData();
    const faqs = data.faqs.module;
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Retrieve a specific FAQ
app.get('/api/faqs/:code', async (req, res) => {
  try {
    const data = await readXMLData();
    const faqs = data.faqs.module;
    const module = faqs.find((item) => item.code === req.params.code);
    if (module) {
      res.json(module);
    } else {
      res.status(404).json({ error: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Create a new FAQ
app.post('/api/faqs/:code', async (req, res) => {
  try {
    const data = await readXMLData();
    const faqs = data.faqs.module;
    const module = faqs.find((item) => item.code === req.params.code);
    if (module) {
      module.faq.push(req.body);
      updateXMLData(data);
      res.status(201).json({ message: 'FAQ created successfully' });
    } else {
      res.status(404).json({ error: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

// Update an existing FAQ
app.put('/api/faqs/:code/:priority', async (req, res) => {
  try {
    const data = await readXMLData();
    const faqs = data.faqs.module;
    const module = faqs.find((item) => item.code === req.params.code);
    if (module) {
      const faq = module.faq.find((item) => item.priority === req.params.priority);
      if (faq) {
        faq.tags = req.body.tags;
        faq.question = req.body.question;
        faq.answer = req.body.answer;
        updateXMLData(data);
        res.json({ message: 'FAQ updated successfully' });
      } else {
        res.status(404).json({ error: 'FAQ not found' });
      }
    } else {
      res.status(404).json({ error: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// Delete an existing FAQ
app.delete('/api/faqs/:code/:priority', async (req, res) => {
  try {
    const data = await readXMLData();
    const faqs = data.faqs.module;
    const module = faqs.find((item) => item.code === req.params.code);
    if (module) {
      const faqIndex = module.faq.findIndex((item) => item.priority === req.params.priority);
      if (faqIndex !== -1) {
        module.faq.splice(faqIndex, 1);
        updateXMLData(data);
        res.json({ message: 'FAQ deleted successfully' });
      } else {
        res.status(404).json({ error: 'FAQ not found' });
      }
    } else {
      res.status(404).json({ error: 'Module not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});