<template>
    <div>
      <h2>Fetch FAQs</h2>
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
        <input type="text" v-model="newQuestion" placeholder="Add a question" />
        <input type="text" v-model="newAnswer" placeholder="Add an answer" />
        <button @click="addQuestion">Submit</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FeTch',
    data() {
      return {
        modules: [],
        selectedModule: null,
        faqs: [],
        searchTerm: '',
        newQuestion: '',
        newAnswer: '',
      };
    },
    mounted() {
      this.fetchModules();
    },
    computed: {
      filteredFAQs() {
        if (this.searchTerm) {
          return this.faqs.filter((faq) =>
            faq.question.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        } else {
          return this.faqs;
        }
      },
    },
    methods: {
      async fetchModules() {
        try {
          const response = await fetch('http://localhost:3000/api/faqs');
          if (!response.ok) {
            throw new Error('Failed to fetch modules');
          }
          const data = await response.json();
          this.modules = data;
        } catch (error) {
          console.error(error);
          alert('Failed to fetch modules');
        }
      },
      async fetchFAQs(moduleCode) {
        try {
          const response = await fetch(`http://localhost:3000/api/faqs/${moduleCode}`);
          if (!response.ok) {
            throw new Error('Failed to fetch FAQs');
          }
          const data = await response.json();
          this.faqs = data.faq;
          this.selectedModule = moduleCode;
        } catch (error) {
          console.error(error);
          alert('Failed to fetch FAQs');
        }
      },
      addQuestion() {
        if (this.newQuestion && this.newAnswer) {
          const module = this.modules.find((module) => module.code === this.selectedModule);
          if (module) {
            const newQuestion = {
              question: this.newQuestion,
              answer: this.newAnswer,
            };
  
            fetch(`http://localhost:3000/api/faqs/${module.code}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newQuestion),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Failed to add question');
                }
                return response.json();
              })
              .then((data) => {
                // Assuming the server returns a success message
                console.log(data.message);
  
                // Update the local data
                module.faq.push(newQuestion);
                this.newQuestion = '';
                this.newAnswer = '';
              })
              .catch((error) => {
                console.error(error);
                alert('Failed to add question');
              });
          }
        }
      },
      editQuestion(faq) {
        const module = this.modules.find((module) => module.code === this.selectedModule);
        if (module) {
          const updatedQuestion = prompt('Enter the updated question:', faq.question);
          if (updatedQuestion !== null) {
            faq.question = updatedQuestion;
            const updatedFaq = {
              question: faq.question,
              answer: faq.answer,
            };
  
            fetch(`http://localhost:3000/api/faqs/${module.code}/${faq.priority}`, {
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
                // Assuming the server returns a success message
                console.log(data.message);
              })
              .catch((error) => {
                console.error(error);
                alert('Failed to update question');
              });
          }
        }
      },
      deleteQuestion(faq) {
        const module = this.modules.find((module) => module.code === this.selectedModule);
        if (module) {
          if (confirm('Are you sure you want to delete this question?')) {
            fetch(`http://localhost:3000/api/faqs/${module.code}/${faq.priority}`, {
              method: 'DELETE',
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Failed to delete question');
                }
                return response.json();
              })
              .then((data) => {
                // Assuming the server returns a success message
                console.log(data.message);
  
                // Update the local data
                const index = module.faq.findIndex((item) => item.priority === faq.priority);
                if (index > -1) {
                  module.faq.splice(index, 1);
                }
              })
              .catch((error) => {
                console.error(error);
                alert('Failed to delete question');
              });
          }
        }
      },
    },
  };
  </script>