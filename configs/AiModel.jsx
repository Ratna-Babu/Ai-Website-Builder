const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-flash-lite-latest",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

const EnhancePromptConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1000,
    responseMimeType: "application/json",
};

export const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
});

export const GenAiCode = model.startChat({
    generationConfig: CodeGenerationConfig,
    history: [
        {
            role: "user",
            parts: [
              {text: "create a to do app: Generate a Project in React. Create multiple components, organizing them in a folder structure.\n\n    Return the response in JSON format with the following schema:\n    {\n      \"projectTitle\": \"\",\n      \"explanation\": \"\",\n      \"files\": {\n        \"/App.js\": {\n          \"code\": \"\"\n        },\n        ...\n      },\n      \"generatedFiles\": []\n    }\n\n    Here's the reformatted and improved version of your prompt:\n\n    Generate a programming code structure for a React project using Vite.\n    Do not create a App.jsx file. There is a App.js file in the project structure, rewrite it.\n    Use Tailwind css for styling.\n\n    Return the response in JSON format with the following schema:\n\n    {\n      \"projectTitle\": \"\",\n      \"explanation\": \"\",\n      \"files\": {\n        \"/App.js\": {\n          \"code\": \"\"\n        },\n        ...\n      },\n      \"generatedFiles\": []\n    }\n\n    Ensure the files field contains all the created files, and the generatedFiles field contains the list of generated files:{\n    \"/App.js\": {\n      \"code\": \"import React from 'react';\\n\\nfunction App() {\\n  return (\\n    <div>\\n      <h1>Hello World</h1>\\n    </div>\\n  );\\n}\\n\\nexport default App;\\n\"\n    }\n    }\n    \n\n    Additionally, include an explanation of the project's structure, purpose, and additional instructions:\n    - For placeholder images, please use https://archive.org/download/\n    - Add Emoji icons whenever needed to give a good user experience\n    - The lucide-react library is also available to be imported IF NECESSARY."},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "```json\n{\n  \"projectTitle\": \"React To-Do App\",\n  \"explanation\": \"This project creates a simple to-do application using React and Tailwind CSS. The application is structured with components organized into a dedicated 'components' folder. This structure promotes code reusability and maintainability. The application will allow users to add tasks to a list, mark them as complete, and remove them. Emoji icons are included to enhance the user experience, but lucide-react icons are not needed for this implementation. The placeholder images will be used for user profile for example (not this case).\",\n  \"files\": {\n    \"/App.js\": {\n      \"code\": \"import React from 'react';\\nimport TodoList from './components/TodoList';\\nimport AddTodo from './components/AddTodo';\\n\\nfunction App() {\\n  return (\\n    <div className=\\\"bg-gray-100 min-h-screen flex flex-col items-center\\\">\\n      <h1 className=\\\"text-3xl font-bold text-center mt-8 mb-4\\\">To-Do List 📝</h1>\\n      <div className=\\\"bg-white p-6 rounded-md shadow-md w-full max-w-md\\\">\\n          <AddTodo />\\n          <TodoList />\\n      </div>\\n    </div>\\n  );\\n}\\n\\nexport default App;\"\n    },\n    \"/components/TodoList.js\": {\n      \"code\": \"import React, { useState, useEffect } from 'react';\\n\\nfunction TodoList() {\\n  const [todos, setTodos] = useState(() => {\\n    const savedTodos = localStorage.getItem('todos');\\n    return savedTodos ? JSON.parse(savedTodos) : [];\\n  });\\n\\n  useEffect(() => {\\n    localStorage.setItem('todos', JSON.stringify(todos));\\n  }, [todos]);\\n\\n  const toggleComplete = (id) => {\\n    setTodos(todos.map(todo =>\\n      todo.id === id ? { ...todo, completed: !todo.completed } : todo\\n    ));\\n  };\\n\\n  const removeTodo = (id) => {\\n    setTodos(todos.filter(todo => todo.id !== id));\\n  };\\n\\n  return (\\n    <ul className=\\\"mt-4\\\">\\n      {todos.map(todo => (\\n        <li key={todo.id} className={`flex justify-between items-center py-2 border-b border-gray-200 ${todo.completed ? 'line-through text-gray-500' : ''}`}>\\n          <span onClick={() => toggleComplete(todo.id)} className=\\\"cursor-pointer flex-1\\\">{todo.text}</span>\\n          <div>\\n            <button onClick={() => removeTodo(todo.id)} className=\\\"ml-2 text-red-500 hover:text-red-700 focus:outline-none\\\">❌</button>\\n          </div>\\n        </li>\\n      ))}\\n    </ul>\\n  );\\n}\\n\\nexport default TodoList;\"\n    },\n    \"/components/AddTodo.js\": {\n      \"code\": \"import React, { useState } from 'react';\\n\\nfunction AddTodo() {\\n  const [text, setText] = useState('');\\n  const [todos, setTodos] = useState(() => {\\n    const savedTodos = localStorage.getItem('todos');\\n    return savedTodos ? JSON.parse(savedTodos) : [];\\n  });\\n\\n  const handleSubmit = (e) => {\\n    e.preventDefault();\\n    if(text.trim() === '') return;\\n    const newTodo = { id: Date.now(), text: text, completed: false };\\n    setTodos([...todos, newTodo]);\\n    setText('');\\n  };\\n\\n  return (\\n    <form onSubmit={handleSubmit} className=\\\"flex\\\">\\n      <input\\n        type=\\\"text\\\"\\n        placeholder=\\\"Add a todo...\\\"        value={text}\\n        onChange={(e) => setText(e.target.value)}\\n        className=\\\"border p-2 rounded-l-md flex-1 focus:outline-none focus:ring focus:border-blue-300\\\"\\n      />\\n      <button type=\\\"submit\\\" className=\\\"bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none\\\">➕</button>\\n    </form>\\n  );\\n}\\n\\nexport default AddTodo;\"\n    }\n  },\n    \"generatedFiles\": [\n        \"/App.js\",\n        \"/components/TodoList.js\",\n        \"/components/AddTodo.js\"\n    ]\n}\n```\n"},
            ],
          },
    ],
})

export const enhancePromptSession = model.startChat({
    generationConfig: EnhancePromptConfig,
    history: [],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
