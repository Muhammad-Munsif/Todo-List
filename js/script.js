<script>
        let fruits = JSON.parse(localStorage.getItem('fruits')) || [];
        let fruitEmojis = {
            'apple': '🍎', 'banana': '🍌', 'orange': '🍊', 'grapes': '🍇', 
            'strawberry': '🍓', 'watermelon': '🍉', 'pineapple': '🍍', 
            'cherry': '🍒', 'peach': '🍑', 'pear': '🍐', 'kiwi': '🥝',
            'mango': '🥭', 'avocado': '🥑', 'lemon': '🍋', 'blueberry': '🫐',
            'coconut': '🥥', 'tomato': '🍅', 'eggplant': '🍆', 'corn': '🌽',
            'hot pepper': '🌶️', 'bell pepper': '🫑'
        };

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            renderFruits();
            updateStats();
        });

        // Add fruit function
        function addFruit() {
            const input = document.getElementById('fruitInput');
            const fruitName = input.value.trim();
            
            if (!fruitName) {
                showToast('Please enter a fruit name!', 'error');
                return;
            }
            
            const fruit = {
                id: Date.now(),
                name: fruitName,
                completed: false,
                favorite: false,
                date: new Date().toISOString(),
                category: getFruitCategory(fruitName.toLowerCase())
            };
            
            fruits.push(fruit);
            saveFruits();
            renderFruits();
            updateStats();
            
            input.value = '';
            input.focus();
            
            showToast(`Added "${fruitName}" to your list!`, 'success');
        }

        // Add quick fruit
        function addQuickFruit(fruitName) {
            document.getElementById('fruitInput').value = fruitName;
            addFruit();
        }

        // Handle Enter key press
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                addFruit();
            }
        }

        // Toggle completion
        function toggleComplete(id) {
            const fruitIndex = fruits.findIndex(fruit => fruit.id === id);
            if (fruitIndex !== -1) {
                fruits[fruitIndex].completed = !fruits[fruitIndex].completed;
                saveFruits();
                renderFruits();
                updateStats();
                
                const status = fruits[fruitIndex].completed ? 'completed' : 'unchecked';
                showToast(`Marked as ${status}!`, 'success');
            }
        }

        // Delete fruit
        function deleteFruit(id) {
            const fruitIndex = fruits.findIndex(fruit => fruit.id === id);
            if (fruitIndex !== -1) {
                const fruitName = fruits[fruitIndex].name;
                fruits.splice(fruitIndex, 1);
                saveFruits();
                renderFruits();
                updateStats();
                showToast(`Removed "${fruitName}" from your list`, 'success');
            }
        }

        // Toggle favorite
        function toggleFavorite(id) {
            const fruitIndex = fruits.findIndex(fruit => fruit.id === id);
            if (fruitIndex !== -1) {
                fruits[fruitIndex].favorite = !fruits[fruitIndex].favorite;
                saveFruits();
                renderFruits();
                
                const status = fruits[fruitIndex].favorite ? 'favorited' : 'unfavorited';
                showToast(`Fruit ${status}!`, 'success');
            }
        }

        // Save to localStorage
        function saveFruits() {
            localStorage.setItem('fruits', JSON.stringify(fruits));
        }

        // Render fruits list
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
            
            // Sort: favorites first, then incomplete, then completed
            const sortedFruits = [...fruits].sort((a, b) => {
                if (a.favorite && !b.favorite) return -1;
                if (!a.favorite && b.favorite) return 1;
                if (!a.completed && b.completed) return -1;
                if (a.completed && !b.completed) return 1;
                return 0;
            });
            
            fruitList.innerHTML = sortedFruits.map(fruit => `
                <li class="fruit-item new-item" data-id="${fruit.id}">
                    <div class="fruit-checkbox ${fruit.completed ? 'checked' : ''}" 
                         onclick="toggleComplete(${fruit.id})">
                    </div>
                    <span class="fruit-emoji">${getFruitEmoji(fruit.name)}</span>
                    <span class="fruit-text ${fruit.completed ? 'completed' : ''}" 
                          onclick="toggleComplete(${fruit.id})">
                        ${fruit.name}
                        <div class="fruit-category">${fruit.category}</div>
                    </span>
                    <div class="fruit-actions">
                        <button class="action-btn favorite-btn" onclick="toggleFavorite(${fruit.id})">
                            <i class="fas fa-star ${fruit.favorite ? 'fas' : 'far'}"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteFruit(${fruit.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </li>
            `).join('');
            
            // Remove new-item class after animation
            setTimeout(() => {
                document.querySelectorAll('.new-item').forEach(item => {
                    item.classList.remove('new-item');
                });
            }, 300);
        }

        // Update statistics
        function updateStats() {
            const total = fruits.length;
            const completed = fruits.filter(fruit => fruit.completed).length;
            const pending = total - completed;
            
            document.getElementById('total-fruits').textContent = total;
            document.getElementById('completed-fruits').textContent = completed;
            document.getElementById('pending-fruits').textContent = pending;
        }

        // Get fruit emoji
        function getFruitEmoji(fruitName) {
            const lowerName = fruitName.toLowerCase();
            
            // Check for exact matches
            for (const [key, emoji] of Object.entries(fruitEmojis)) {
                if (lowerName.includes(key)) {
                    return emoji;
                }
            }
            
            // Check for partial matches
            if (lowerName.includes('berry')) return '🫐';
            if (lowerName.includes('melon')) return '🍈';
            if (lowerName.includes('fruit')) return '🍎';
            if (lowerName.includes('citrus')) return '🍋';
            
            // Default fruit emoji
            return '🍎';
        }

        // Get fruit category
        function getFruitCategory(fruitName) {
            const categories = {
                'tropical': ['pineapple', 'mango', 'banana', 'coconut', 'papaya'],
                'berry': ['strawberry', 'blueberry', 'raspberry', 'blackberry', 'cranberry'],
                'citrus': ['orange', 'lemon', 'lime', 'grapefruit', 'tangerine'],
                'stone': ['peach', 'plum', 'cherry', 'apricot', 'nectarine'],
                'vine': ['grapes', 'watermelon', 'cantaloupe', 'honeydew'],
                'core': ['apple', 'pear'],
                'exotic': ['kiwi', 'passionfruit', 'dragonfruit', 'lychee']
            };
            
            for (const [category, fruits] of Object.entries(categories)) {
                if (fruits.some(fruit => fruitName.includes(fruit))) {
                    return category.charAt(0).toUpperCase() + category.slice(1);
                }
            }
            
            return 'Other';
        }

        // Show toast notification
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
            
            toast.innerHTML = `
                <i class="${icon}" style="color: ${type === 'success' ? '#2ecc71' : '#e74c3c'}"></i>
                <span>${message}</span>
            `;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Add some sample fruits on first load
        if (fruits.length === 0) {
            const sampleFruits = [
                { name: 'Apple', completed: false, favorite: true },
                { name: 'Banana', completed: true, favorite: false },
                { name: 'Orange', completed: false, favorite: false }
            ];
            
            sampleFruits.forEach((fruit, index) => {
                setTimeout(() => {
                    const fruitObj = {
                        id: Date.now() + index,
                        name: fruit.name,
                        completed: fruit.completed,
                        favorite: fruit.favorite,
                        date: new Date().toISOString(),
                        category: getFruitCategory(fruit.name.toLowerCase())
                    };
                    fruits.push(fruitObj);
                    saveFruits();
                    renderFruits();
                    updateStats();
                }, index * 200);
            });
        }
    </script>