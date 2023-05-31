	<template>
	<div>
		<h2>Search About Modules</h2>
		<button v-for="module in modules" :key="module.code" @click="fetchFAQs(module.code)">
		{{ module.code }}
		</button>
		<div v-if="selectedModule">
		<input type="text" v-model="searchTerm" placeholder="Search FAQs" />
		<ul style="background-color: white;">
			<li v-for="faq in filteredFAQs" :key="faq.priority">
			<h4>Question: {{ faq.question }}</h4>
			<p>Answer: {{ faq.answer }}</p>
			<button @click="editQuestion(faq)">Edit</button>
			<button @click="deleteQuestion(faq)">Delete</button>
			</li>
		</ul>
		<input type="text" v-model="newFaq.question" placeholder="Add a question" />
		<input type="text" v-model="newFaq.answer" placeholder="Add an answer" />
		<button @click="addQuestion">Submit</button>
		</div>
	</div>
	</template>

	<script>

	export default {
	name: 'apiCalls',
	data() {
		return {
		modules: [],
		selectedModule: null,
		faqs: [],
		searchTerm: '',
		newFaq: { "priority": 0, "tags": [], "question": "", "answer": ""},
		};
	},
	mounted() {
		this.fetchModules();
	},
	computed: {
		filteredFAQs() {
		if (this.searchTerm) {
			return this.faqs.filter((faq) =>{
				faq.question.toLowerCase().includes(this.searchTerm.toLowerCase())
			});
		} else {
			return this.faqs;
		}
		},
	},
	methods: {
		async fetchModules() {
		try {
			const response = await fetch('http://localhost:6969/api/faqs');
				if (!response.ok) {
				throw new Error('Failed to fetch modules');
			}
			const data = await response.json();
			this.modules = data;
		} catch (error) {
			console.error(error.message);
			console.log('Failed to fetch modules');
		}
		},
		async fetchFAQs(moduleCode) {
		try {
			const response = await fetch(`http://localhost:6969/api/faqs/${moduleCode}`);
			if (!response.ok) {
				throw new Error('Failed to fetch FAQs');
			}
			const data = await response.json();
			console.log(data, "++++++++++++++++++++++++++++++++++++++");
			this.faqs = data.faq;
			this.selectedModule = moduleCode;
		} catch (error) {
			console.error(error.message);
			console.log('Failed to fetch FAQs');
		}
		},
		addQuestion() {
		if (this.newFaq.question && this.newFaq.answer) {
			const module = this.retrieveModule(this.selectedModule);
			if (module) {
				if (this.newFaq.priority == 0){
					this.newFaq.priority = this.getLowestPriority(this.selectedModule) + 1;
				}
				fetch(`http://localhost:6969/api/faqs/${module.code}`, {
					method: 'POST',
					headers: {
					'Content-Type': 'application/json',
					},
					body: JSON.stringify(this.newFaq),
				})
				.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to add question');
				}
				return response.json();
				})
				.then((data) => {
					console.log(data.message);

					module.faq.push(this.newFaq);
					this.newFaq.question = '';
					this.newFaq.answer = '';
				})
				.catch((error) => {
					console.error(error.message);
					console.log('Failed to add question');
				});
			}
		}
		},
		editQuestion(faq) {
		const module = this.retrieveModule(this.selectedModule);
		if (module) {
			const updatedQuestion = prompt('Enter the updated question:', faq.question);
			if (updatedQuestion !== null) {
				faq.question = updatedQuestion;
				const updatedFaq = {
					question: faq.question,
					answer: faq.answer,
				};

				fetch(`http://localhost:6969/api/faqs/${module.code}/${faq.priority}`, {
					method: 'PUT',
					headers: {
					'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedFaq),
				})
					.then((response) => {
					if (!response.ok) {
						throw new Error('Failed to update question');
					}
					return response.json();
					})
					.then((data) => {
						console.log(data.message);
					})
					.catch((error) => {
						console.error(error.message);
						console.log('Failed to update question');
					});
			}
		}
		},
		deleteQuestion(faq) {
		const module = this.retrieveModule(this.selectedModule);
		if (module) {
			if (confirm('Are you sure you want to delete this question?')) {
				console.log(faq);
				const reqOptions = {
					method: 'DELETE'
				}
				fetch(`http://localhost:6969/api/faqs/` + module.code + `/` + faq.priority, reqOptions)
					.then((response) => {
					// console.log("_________________"+response.ok + "________________");

					if (!response.ok) {
						throw new Error('Failed to delete question');
					}
					return response.json();
					})
					.then((data) => {
					console.log(data.message);

					var ind = -1;
					for (let f = 0; f < module.faq.length; f++) {
						if (module[f].priority == faq.priority) {
						ind = f;
						}
					}
					if (ind > -1) {
						module.faq.splice(ind, 1);
					}
					})
					.catch((error) => {
						console.error(error.message);
						console.log('Failed to delete question');
					});
			}
		}
		},
		getLowestPriority(code){
		//PRIORITIES ARE IN REVERSE: THE HIGHER THE NUMBER THE LOWER THE PRIORITY
			var moduleFaqs = this.retrieveModule(code).faq;
			var priority = 0;
			for(let m = 0; m < moduleFaqs.length; m++){
				if (priority < moduleFaqs[m].priority){
					priority = moduleFaqs[m].priority;
				}
			}
			return parseInt(priority);
		},
		retrieveModule(code) {
		var module = null;
		for (let m = 0; m < this.modules.length; m++) {
			if (this.modules[m].code == code) {
				module = this.modules[m];
			}
		}
		return module;
		},
		findFAQIndex(moduleFaqs, faqPriority) {
			var ind = -1;
			for (let f = 0; f < moduleFaqs.length; f++) {
				console.log(moduleFaqs == faqPriority);
				if (moduleFaqs[f].priority == faqPriority) {
					ind = f;
				}
			}
			return ind;
		}
	},
	};
	</script>