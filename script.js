function addFruit() {
    let input = document.getElementById("fruitInput");
    let fruitName = input.value.trim();

    if (fruitName === "") {
        alert("Please enter a fruit name!");
        return;
    }

    let ul = document.getElementById("fruitList");
    let li = document.createElement("li");

    li.innerHTML = `
        <span onclick="toggleComplete(this)">${fruitName}</span>
        <button class="delete" onclick="deleteFruit(this)">X</button>
    `;

    ul.appendChild(li);
    input.value = "";
}

function toggleComplete(element) {
    element.classList.toggle("completed");
}

function deleteFruit(button) {
    button.parentElement.remove();
}