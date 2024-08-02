let categories = [];
let places = [];

document.addEventListener('DOMContentLoaded', (event) => {
    loadCategories();
    loadPlaces();
    renderCategories();
    renderWheel();
});

function addCategory() {
    const categoryName = document.getElementById('categoryName').value;
    if (categoryName) {
        categories.push({ name: categoryName, queue: [] });
        document.getElementById('categoryName').value = '';
        saveCategories();
        renderCategories();
    }
}

function addQueueItem(categoryIndex) {
    const queueItemName = document.getElementById(`queueItemName-${categoryIndex}`).value;
    if (queueItemName) {
        categories[categoryIndex].queue.push(queueItemName);
        document.getElementById(`queueItemName-${categoryIndex}`).value = '';
        saveCategories();
        renderCategories();
    }
}

function moveQueueItemToBottom(categoryIndex, itemIndex) {
    const item = categories[categoryIndex].queue.splice(itemIndex, 1)[0];
    categories[categoryIndex].queue.push(item);
    saveCategories();
    renderCategories();
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function loadCategories() {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    }
}

function addPlace() {
    const placeName = document.getElementById('placeName').value;
    if (placeName) {
        places.push(placeName);
        document.getElementById('placeName').value = '';
        renderWheel();
    }
}


function loadPlaces() {
    const savedPlaces = localStorage.getItem('places');
    if (savedPlaces) {
        places = JSON.parse(savedPlaces);
    }
}

function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';

    categories.forEach((category, categoryIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';

        const categoryName = document.createElement('h3');
        categoryName.textContent = category.name;

        const queueForm = document.createElement('div');
        queueForm.className = 'form-group';

        const queueInput = document.createElement('input');
        queueInput.type = 'text';
        queueInput.id = `queueItemName-${categoryIndex}`;
        queueInput.className = 'form-control';
        queueInput.placeholder = `Add to ${category.name}`;

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-secondary mt-2';
        addButton.textContent = 'Add';
        addButton.onclick = () => addQueueItem(categoryIndex);

        queueForm.appendChild(queueInput);
        queueForm.appendChild(addButton);

        categoryHeader.appendChild(categoryName);
        categoryHeader.appendChild(queueForm);

        const queueList = document.createElement('ul');
        queueList.className = 'list-group';

        category.queue.forEach((queueItem, itemIndex) => {
            const queueListItem = document.createElement('li');
            queueListItem.className = 'list-group-item queue-item';
            queueListItem.textContent = queueItem;
            queueListItem.onclick = () => moveQueueItemToBottom(categoryIndex, itemIndex);
            queueList.appendChild(queueListItem);
        });

        categoryDiv.appendChild(categoryHeader);
        categoryDiv.appendChild(queueList);

        categoriesContainer.appendChild(categoryDiv);
    });
}


function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';

    categories.forEach((category, categoryIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';

        const categoryName = document.createElement('h3');
        categoryName.textContent = category.name;

        const queueForm = document.createElement('div');
        queueForm.className = 'form-group';

        const queueInput = document.createElement('input');
        queueInput.type = 'text';
        queueInput.id = `queueItemName-${categoryIndex}`;
        queueInput.className = 'form-control';
        queueInput.placeholder = `Add to ${category.name}`;

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-secondary mt-2';
        addButton.textContent = 'Add';
        addButton.onclick = () => addQueueItem(categoryIndex);

        queueForm.appendChild(queueInput);
        queueForm.appendChild(addButton);

        categoryHeader.appendChild(categoryName);
        categoryHeader.appendChild(queueForm);

        const queueList = document.createElement('ul');
        queueList.className = 'list-group';

        category.queue.forEach((queueItem, itemIndex) => {
            const queueListItem = document.createElement('li');
            queueListItem.className = 'list-group-item queue-item';
            queueListItem.textContent = queueItem;
            queueListItem.onclick = () => moveQueueItemToBottom(categoryIndex, itemIndex);
            queueList.appendChild(queueListItem);
        });

        categoryDiv.appendChild(categoryHeader);
        categoryDiv.appendChild(queueList);

        categoriesContainer.appendChild(categoryDiv);
    });
}

function renderWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const numberOfSegments = places.length;
    const segmentAngle = 2 * Math.PI / numberOfSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numberOfSegments; i++) {
        const angle = i * segmentAngle;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + segmentAngle);
        ctx.closePath();
        ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FF6347';
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px Arial";
        ctx.fillText(places[i], canvas.width / 2 - 10, 10);
        ctx.restore();
    }
}

function spinWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const numberOfSegments = places.length;
    const segmentAngle = 2 * Math.PI / numberOfSegments;
    const spinAngle = Math.floor(Math.random() * 360) + 360 * 5;
    const endAngle = spinAngle * (Math.PI / 180);
    let currentAngle = 0;
    const spinDuration = 5000; // 5 seconds
    const spinStart = new Date().getTime();

    const easeOutQuad = (t) => t * (2 - t); // Easing function for smooth slowing down

    const spin = () => {
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - spinStart;
        let progress;

        if (timeElapsed < spinDuration) {
            progress = timeElapsed / spinDuration;
            currentAngle = endAngle * easeOutQuad(progress);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < numberOfSegments; i++) {
                const angle = i * segmentAngle + currentAngle;
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, canvas.height / 2);
                ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + segmentAngle);
                ctx.closePath();
                ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FF6347';
                ctx.fill();
                ctx.stroke();

                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle + segmentAngle / 2);
                ctx.textAlign = "right";
                ctx.fillStyle = "#000000";
                ctx.font = "bold 16px Arial";
                ctx.fillText(places[i], canvas.width / 2 - 10, 10);
                ctx.restore();
            }

            requestAnimationFrame(spin);
        } else {
            const selectedPlaceIndex = Math.floor(((2 * Math.PI - currentAngle % (2 * Math.PI)) / segmentAngle)) % numberOfSegments;
            alert(`The selected place is: ${places[selectedPlaceIndex]}`);
        }
    };

    spin();
}