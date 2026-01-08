    
        // Fruit data structure
        let fruits = JSON.parse(localStorage.getItem('fruits')) || [];
        let fruitIcons = {
            'apple': 'fas fa-apple-alt',
            'banana': 'fas fa-lemon',
            'orange': 'fas fa-lemon',
            'grapes': 'fas fa-grapes',
            'strawberry': 'fas fa-strawberry',
            'watermelon': 'fas fa-watermelon',
            'pineapple': 'fas fa-pineapple',
            'cherry': 'fas fa-cherry',
            'peach': 'fas fa-peach',
            'pear': 'fas fa-pear',
            'kiwi': 'fas fa-kiwi',
            'mango': 'fas fa-mango',
            'avocado': 'fas fa-avocado',
            'lemon': 'fas fa-lemon',
            'blueberry': 'fas fa-blueberry',
            'coconut': 'fas fa-coconut',
            'default': 'fas fa-fruit'
        };

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            initializeApp();
            setupEventListeners();
        });

        // Initialize app
        function initializeApp() {
            if (fruits.length === 0) {
                // Add sample fruits
                addSampleFruits();
            }
            renderFruits();
            updateStats();
        }

        // Setup event listeners
        function setupEventListeners() {
            document.getElementById('addBtn').addEventListener('click', addFruit);
        }

        // Add fruit function
        function addFruit() {
            const input = document.getElementById('fruitInput');
            const fruitName = input.value.trim();
            
            if (!fruitName) {
                alert('Please enter a fruit name!');
                return;
            }
            
            const newFruit = {
                id: Date.now(),
                name: fruitName,
                completed: false,
                date: new Date().toISOString(),
                icon: getFruitIcon(fruitName.toLowerCase())
            };
            
            fruits.push(newFruit);
            saveToLocalStorage();
            renderFruits();
            updateStats();
            
            input.value = '';
            input.focus();
        }

        // Add quick fruit
        function addQuickFruit(fruitName) {
            document.getElementById('fruitInput').value = fruitName;
            addFruit();
        }

        // Handle Enter key
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                addFruit();
            }
        }

        // Toggle completion
        function toggleComplete(fruitId) {
            const fruit = fruits.find(f => f.id === fruitId);
            if (fruit) {
                fruit.completed = !fruit.completed;
                saveToLocalStorage();
                renderFruits();
                updateStats();
            }
        }

        // Delete fruit
        function deleteFruit(fruitId) {
            if (confirm('Are you sure you want to delete this fruit?')) {
                fruits = fruits.filter(f => f.id !== fruitId);
                saveToLocalStorage();
                renderFruits();
                updateStats();
            }
        }

        // Edit fruit
        function editFruit(fruitId) {
            const fruit = fruits.find(f => f.id === fruitId);
            if (fruit) {
                const newName = prompt('Edit fruit name:', fruit.name);
                if (newName && newName.trim() !== '') {
                    fruit.name = newName.trim();
                    fruit.icon = getFruitIcon(newName.toLowerCase());
                    saveToLocalStorage();
                    renderFruits();
                }
            }
        }

        // Get fruit icon
        function getFruitIcon(fruitName) {
            for (const [key, icon] of Object.entries(fruitIcons)) {
                if (fruitName.includes(key)) {
                    return icon;
                }
            }
            return fruitIcons.default;
        }

        // Format date
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Save to localStorage
        function saveToLocalStorage() {
            localStorage.setItem('fruits', JSON.stringify(fruits));
        }

        // Render fruits
        function renderFruits() {
            const fruitList = document.getElementById('fruitList');
            const emptyState = document.getElementById('emptyState');
            
            if (fruits.length === 0) {
                fruitList.innerHTML = '';
                fruitList.appendChild(emptyState);
                emptyState.style.display = 'block';
                return;
            }
            
            emptyState.style.display = 'none';
            
            fruitList.innerHTML = fruits.map(fruit => `
                <li class="fruit-item" data-id="${fruit.id}">
                    <div class="checkbox-wrapper">
                        <input type="checkbox" 
                               class="fruit-checkbox" 
                               ${fruit.completed ? 'checked' : ''}
                               onchange="toggleComplete(${fruit.id})">
                    </div>
                    
                    <div class="fruit-icon">
                        <i class="${fruit.icon}"></i>
                    </div>
                    
                    <div class="fruit-content">
                        <div class="fruit-name ${fruit.completed ? 'completed' : ''}">
                            ${fruit.name}
                        </div>
                        <div class="fruit-date">
                            <i class="far fa-calendar"></i>
                            ${formatDate(fruit.date)}
                        </div>
                    </div>
                    
                    <div class="fruit-actions">
                        <button class="action-btn edit-btn" onclick="editFruit(${fruit.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteFruit(${fruit.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </li>
            `).join('');
        }

        // Update statistics
        function updateStats() {
            const total = fruits.length;
            const completed = fruits.filter(f => f.completed).length;
            const pending = total - completed;
            
            document.getElementById('totalCount').textContent = total;
            document.getElementById('completedCount').textContent = completed;
            document.getElementById('pendingCount').textContent = pending;
        }

        // Add sample fruits
        function addSampleFruits() {
            const sampleFruits = [
                { name: 'Apple', completed: false },
                { name: 'Banana', completed: true },
                { name: 'Orange', completed: false },
                { name: 'Grapes', completed: false },
                { name: 'Strawberry', completed: true }
            ];
            
            sampleFruits.forEach((fruit, index) => {
                setTimeout(() => {
                    const newFruit = {
                        id: Date.now() + index,
                        name: fruit.name,
                        completed: fruit.completed,
                        date: new Date().toISOString(),
                        icon: getFruitIcon(fruit.name.toLowerCase())
                    };
                    fruits.push(newFruit);
                    saveToLocalStorage();
                    renderFruits();
                    updateStats();
                }, index * 100);
            });
        }
    