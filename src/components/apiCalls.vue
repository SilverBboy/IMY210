<template>
	<div class="container">
		<h1 class="module-title">Modules FAQs</h1>
		<div class="module-selection">
			<div class="flex-filler"></div>
			<h2 v-if="selectedModule" class="heading">{{ this.selectedModule }}</h2>
			<h2 v-else class="heading">Please Select a Module</h2>
			<select v-model="selectedModule" @click="fetchFAQs(selectedModule)">
				<option v-for="module in modules" :key="module.code" class="module-option">
					{{ module.code }}
				</option>
			</select>
			<div class="flex-filler"></div>
		</div>
		<div v-if="selectedModule" class="faq-container">
			<input type="text" v-model="searchTerm" placeholder="Search FAQs" class="search-input" />
			<ul class="faq-list">
				<li v-for="faq in filteredFAQs" :key="faq.priority" class="faq-card">
					<div class="faq-actions">
						<button @click="editQuestion(faq)" class="edit-button">
							<img src="../assets/edit.svg">
						</button>
						<button @click="deleteQuestion(faq)" class="delete-button">
							<img src="../assets/remove.svg">
						</button>
					</div>
					<h3 class="faq-question">{{ faq.question }}</h3>
					<p class="faq-answer">{{ faq.answer }}</p>
					<span class="faq-priority">Question Priority: {{ faq.priority }}</span>
				</li>
			</ul>
			<div class="add-faq">
				<input type="text" v-model="newFaq.question" placeholder="Add a question" class="add-question" />
				<input type="text" v-model="newFaq.answer" placeholder="Add an answer" class="add-answer" />
				<button @click="addQuestion" class="submit-button">Submit</button>
			</div>
		</div>
	</div>
</template>
<style>
.container {
	margin: 60px;
}

.module-title {
	text-align: center;
}

.module-selection {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 20px;
}

.heading{
	height: 100%;
	flex: 1;
}

.module-options{
	height: 100%;
	flex: 1;
}

.module-options select{
	width: 70px;
	height: 30px;
}

.module-button {
	margin: 5px;
	padding: 8px 16px;
	background-color: #faeacc;
	border: none;
	border-radius: 7px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.faq-container {
	margin-top: 30px;
}

.search-input {
	width: 100%;
	padding: 8px;
	margin-bottom: 20px;
}

.faq-list {
	list-style: none;
	padding: 0;
	/* max-height: 250px; */
	overflow-y: auto;
}

.faq-card {
	background-color: #dbf3e5;
	border-radius: 7px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	padding: 10px;
	margin-bottom: 10px;
}

.faq-question {
	font-size: 1.5em;
	margin-bottom: 5px;
}

.faq-answer {
	font-size: 1.1em;
}

.faq-actions {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 5px;
}

.edit-button,
.delete-button {
	width: 30px;
	height: 30px;
	border-radius: 7px;
	background-color: #f9dbbd;
	margin-left: 5px;
	font-size: 0.9em;
}

.faq-priority {
	font-size: 0.9em;
	margin-top: 5px;
	color: #888;
}

.add-faq {
	position: absolute;
	top: 20px;
	right: 20px;
}

.add-question,
.add-answer,
.submit-button {
	margin-bottom: 10px;
	display: block;
	width: 200px;
	padding: 8px;
}

.submit-button {
	background-color: #f9dbbd;
	border: none;
	border-radius: 7px;
	cursor: pointer;
}

@media (max-width: 600px) {
	.container {
		margin: 20px;
	}
}

.delete-button, .edit-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  width: 100%;
  height: 100%;
}

.flex-filler{
	flex: 1;
}
</style>
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