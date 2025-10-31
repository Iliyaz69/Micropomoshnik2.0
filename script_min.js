// Массив задач
const tasks = [
    "Выпить стакан воды",
    "Сделать зарядку",
    "Прочитать 10 страниц",
    "Позвонить близким",
    "Пройти 10000 шагов",
    "Помедитировать 10 минут"
];

// Состояние приложения
let state = {
    currentTask: 0,
    completedToday: 0,
    streak: 0,
    lastDate: null
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateUI();
    checkAndResetDaily();
});

// Загрузка состояния из localStorage
function loadState() {
    const savedState = localStorage.getItem('habitState');
    if (savedState) {
        state = JSON.parse(savedState);
    }
}

// Сохранение состояния в localStorage
function saveState() {
    localStorage.setItem('habitState', JSON.stringify(state));
}

// Проверка и сброс ежедневного прогресса
function checkAndResetDaily() {
    const today = new Date().toDateString();
    
    if (state.lastDate !== today) {
        if (state.lastDate && state.completedToday > 0) {
            state.streak++;
        } else if (state.lastDate && state.completedToday === 0) {
            state.streak = 0;
        }
        
        state.lastDate = today;
        state.completedToday = 0;
        state.currentTask = 0;
        saveState();
        updateUI();
    }
}

// Обновление интерфейса
function updateUI() {
    // Обновление текста задачи
    const taskText = document.getElementById('task-text');
    if (taskText) {
        taskText.textContent = state.currentTask < tasks.length 
            ? tasks[state.currentTask]
            : 'Все задачи на сегодня выполнены!';
    }
    
    // Обновление прогресса
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const progress = (state.completedToday / tasks.length) * 100;
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    if (progressPercent) {
        progressPercent.textContent = `${Math.round(progress)}%`;
    }
    
    // Обновление счетчиков
    const completedCount = document.getElementById('completed-count');
    const streakCount = document.getElementById('streak-count');
    
    if (completedCount) {
        completedCount.textContent = state.completedToday;
    }
    if (streakCount) {
        streakCount.textContent = state.streak;
    }

    // Управление видимостью кнопок
    const buttons = document.querySelector('#task-area .d-grid');
    if (buttons) {
        buttons.style.display = state.currentTask < tasks.length ? '' : 'none';
    }
}

// Обработка выполнения задачи
function completeTask() {
    if (state.currentTask < tasks.length) {
        state.completedToday++;
        state.currentTask++;
        
        // Анимация прогресс-бара
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.transition = 'width 0.4s ease';
        }
        
        saveState();
        updateUI();

        // Показ уведомления
        showNotification('Отлично!', 'Задача выполнена');
    }
}

// Пропуск задачи
function skipTask() {
    if (state.currentTask < tasks.length) {
        state.currentTask++;
        saveState();
        updateUI();
    }
}

// Показ уведомления
function showNotification(title, message) {
    // Проверка поддержки уведомлений
    if (!("Notification" in window)) {
        return;
    }

    // Запрос разрешения на показ уведомлений
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification(title, {
                body: message,
                icon: '/icon.png'
            });
        }
    });
}

// Обработка формы добавления друга
const addFriendForm = document.getElementById('addFriendForm');
if (addFriendForm) {
    addFriendForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('friendName').value;
        const email = document.getElementById('friendEmail').value;
        
        // TODO: Добавление друга в систему
        console.log(`Добавлен друг: ${name} (${email})`);
        
        // Закрытие модального окна
        const modal = bootstrap.Modal.getInstance(document.getElementById('addFriendModal'));
        modal.hide();
        
        // Очистка формы
        addFriendForm.reset();
    });
}

// Обработка формы обратной связи
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // TODO: Отправка сообщения
        console.log(`Сообщение от ${name} (${email}): ${message}`);
        
        // Очистка формы
        contactForm.reset();
        
        // Показ уведомления
        showNotification('Спасибо!', 'Ваше сообщение отправлено');
    });
}