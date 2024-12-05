// Анимация флага
const flag = document.getElementById("flag");
let scale = 1;
let growing = true;

setInterval(() => {
    if (growing) {
        scale += 0.01;
        if (scale >= 1.3) growing = false;
    } else {
        scale -= 0.01;
        if (scale <= 1) growing = true;
    }
    flag.style.transform = `scale(${scale})`;
}, 50);

// Canvas: Футболист и мяч
const canvas = document.getElementById("football-canvas");
const ctx = canvas.getContext("2d");

let ballX = 100;
let ballY = 250;
let ballRadius = 15;
let playerX = 80;
let playerY = 220;

let ballSpeedX = 3;
let ballSpeedY = 2;

function drawGoal() {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.strokeRect(canvas.width - 120, canvas.height / 2 - 50, 100, 100);
}

function drawPlayer() {
    // Рисуем голову
    ctx.beginPath();
    ctx.arc(playerX, playerY - 10, 12, 0, Math.PI * 2); // Голова
    ctx.fillStyle = "#f4c542"; // Цвет кожи
    ctx.fill();
    ctx.closePath();

    // Рисуем тело
    ctx.fillStyle = "#1e90ff"; // Цвет футболки
    ctx.fillRect(playerX - 15, playerY, 30, 30); // Тело

    // Рисуем ноги
    ctx.fillStyle = "#000"; // Цвет штанов
    ctx.fillRect(playerX - 10, playerY + 30, 10, 30); // Левая нога
    ctx.fillRect(playerX, playerY + 30, 10, 30); // Правая нога

    // Рисуем руки
    ctx.fillStyle = "#f4c542"; // Цвет кожи
    ctx.fillRect(playerX - 18, playerY + 5, 8, 20); // Левая рука
    ctx.fillRect(playerX + 10, playerY + 5, 8, 20); // Правая рука
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.closePath();
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGoal();
    drawPlayer(); // Рисуем игрока
    drawBall();
    moveBall();
    requestAnimationFrame(animate);
}

animate();

// Vue.js для управления новостями
new Vue({
    el: "#news-app",
    data: {
        newsList: ["«Астана» победила «Кайрат» со счётом 2:1.", "Тренер сборной Казахстана анонсировал тактические изменения."],
        newNews: ""
    },
    methods: {
        addNews() {
            if (this.newNews.trim()) {
                this.newsList.push(this.newNews.trim());
                this.newNews = "";
            } else {
                alert("Введите текст новости!");
            }
        },
        removeNews(index) {
            this.newsList.splice(index, 1);
        }
    }
});

new Vue({
    el: "#results",
    data: {
        teams: [
            { club: "Астана", points: 30, wins: 10, draws: 0, losses: 0 },
            { club: "Кайрат", points: 25, wins: 8, draws: 1, losses: 1 },
            { club: "Шахтёр", points: 20, wins: 6, draws: 2, losses: 2 },
            { club: "Тобол", points: 18, wins: 5, draws: 3, losses: 2 },
            { club: "Ордабасы", points: 16, wins: 5, draws: 1, losses: 4 }
        ],
        originalTeams: [
            { club: "Астана", points: 30, wins: 10, draws: 0, losses: 0 },
            { club: "Кайрат", points: 25, wins: 8, draws: 1, losses: 1 },
            { club: "Шахтёр", points: 20, wins: 6, draws: 2, losses: 2 },
            { club: "Тобол", points: 18, wins: 5, draws: 3, losses: 2 },
            { club: "Ордабасы", points: 16, wins: 5, draws: 1, losses: 4 }
        ],
        filter: "",
        sortKey: null,
        sortDesc: false
    },
    computed: {
        filteredTeams() {
            return this.teams.filter(team =>
                team.club.toLowerCase().includes(this.filter.toLowerCase())
            );
        }
    },
    methods: {
        sortTable(property) {
            if (this.sortKey === property) {
                this.sortDesc = !this.sortDesc;
            } else {
                this.sortKey = property;
                this.sortDesc = false;
            }
            this.teams.sort((a, b) => {
                const modifier = this.sortDesc ? -1 : 1;
                if (a[property] > b[property]) return modifier;
                if (a[property] < b[property]) return -modifier;
                return 0;
            });
        },
        generateTable() {
            this.teams = JSON.parse(JSON.stringify(this.originalTeams));
            this.sortKey = null;
            this.sortDesc = false;
        }
    }
});

// jQuery UI: Календарь
$("#news-date").datepicker({
    dateFormat: "dd.mm.yy"
});

function updateData() {
    fetch('data.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            // Обновляем список новостей
            const newsItems = xmlDoc.getElementsByTagName("item");
            const newsContainer = document.getElementById("news-app").querySelector("ul");
            newsContainer.innerHTML = ""; // Очищаем список
            for (let i = 0; i < newsItems.length; i++) {
                const li = document.createElement("li");
                li.textContent = newsItems[i].textContent;
                newsContainer.appendChild(li);
            }

            // Обновляем таблицу с клубами
            const clubs = xmlDoc.getElementsByTagName("club");
            const tbody = document.querySelector("#results table tbody");
            tbody.innerHTML = ""; // Очищаем таблицу
            for (let i = 0; i < clubs.length; i++) {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${clubs[i].getElementsByTagName("name")[0].textContent}</td>
                    <td>${clubs[i].getElementsByTagName("points")[0].textContent}</td>
                    <td>${clubs[i].getElementsByTagName("wins")[0].textContent}</td>
                    <td>${clubs[i].getElementsByTagName("draws")[0].textContent}</td>
                    <td>${clubs[i].getElementsByTagName("losses")[0].textContent}</td>
                `;
                tbody.appendChild(row);
            }
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
}

// Привязываем функцию к кнопке
document.getElementById("update-data-btn").addEventListener("click", updateData);
