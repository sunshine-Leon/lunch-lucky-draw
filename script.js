document.addEventListener('DOMContentLoaded', () => {
    const lunchInput = document.getElementById('lunchInput');
    const addBtn = document.getElementById('addBtn');
    const lunchList = document.getElementById('lunchList');
    const spinBtn = document.getElementById('spinBtn');
    const resultOverlay = document.getElementById('resultOverlay');
    const resultLabel = document.getElementById('resultLabel');
    const closeResultBtn = document.getElementById('closeResultBtn');
    const resultQuote = document.getElementById('resultQuote');
    const confettiCanvas = document.getElementById('confetti-canvas');

    // 資料結構：包含權重
    // 預設資料
    let lunches = [
        { name: '牛肉麵', weight: 1 },
        { name: '吉野家', weight: 1 },
        { name: '麥當勞', weight: 1 },
        { name: '八方雲集', weight: 1 },
        { name: '健康便當', weight: 1 },
        { name: '壽司郎', weight: 1 }
    ];

    const quotes = [
        "這家真的超讚，不吃會後悔！",
        "雖然普通，但填飽肚子還是可以的。",
        "恭喜抽中！今天的運氣都花在這裡了。",
        "這家最近好像在排隊，要有心理準備喔。",
        "這就是命運的安排，去吃吧！",
        "如果不喜歡，可以再抽一次 (喂)。",
        "熱量警告！但沒關係，明天再減肥。",
        "這家店的老闆最近心情不錯，快去！"
    ];

    // 渲染列表
    function renderList() {
        lunchList.innerHTML = '';
        lunches.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'lunch-item';
            div.innerHTML = `
                <div class="item-main">
                    <div class="weight-controls">
                        <button class="weight-btn" onclick="updateWeight(${index}, -1)">-</button>
                        <span class="weight-display">${item.weight}</span>
                        <button class="weight-btn" onclick="updateWeight(${index}, 1)">+</button>
                    </div>
                    <span>${item.name}</span>
                </div>
                <button class="delete-btn" onclick="removeLunch(${index})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            lunchList.appendChild(div);
        });
    }

    window.updateWeight = (index, delta) => {
        lunches[index].weight = Math.max(1, Math.min(10, lunches[index].weight + delta));
        renderList();
    };

    window.removeLunch = (index) => {
        lunches.splice(index, 1);
        renderList();
    };

    window.addLunch = () => {
        const value = lunchInput.value.trim();
        if (value) {
            lunches.push({ name: value, weight: 1 });
            lunchInput.value = '';
            renderList();
            lunchList.scrollTop = lunchList.scrollHeight;
        }
    };

    // 權重抽籤演算法
    function weightedRandom(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            if (random < item.weight) return item;
            random -= item.weight;
        }
        return items[0];
    }

    // 老虎機動畫
    function startSlotMachine(finalValue, callback) {
        const duration = 2000;
        const interval = 80;
        let elapsed = 0;

        const timer = setInterval(() => {
            const tempPick = lunches[Math.floor(Math.random() * lunches.length)].name;
            spinBtn.textContent = tempPick;
            elapsed += interval;

            if (elapsed >= duration) {
                clearInterval(timer);
                spinBtn.textContent = finalValue;
                callback();
            }
        }, interval);
    }

    // 紙屑特效
    function fireConfetti() {
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        let particles = [];
        const colors = ['#00f2ff', '#ff007a', '#ffcc00', '#ffffff'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * confettiCanvas.width,
                y: Math.random() * confettiCanvas.height - confettiCanvas.height,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 5 + 2,
                angle: Math.random() * 6.28
            });
        }

        function update() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            particles.forEach(p => {
                p.y += p.speed;
                p.x += Math.sin(p.angle) * 2;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            if (particles.some(p => p.y < confettiCanvas.height)) {
                requestAnimationFrame(update);
            }
        }
        update();
    }

    spinBtn.addEventListener('click', () => {
        if (lunches.length === 0) {
            alert("請先新增一些選項！");
            return;
        }

        spinBtn.disabled = true;
        spinBtn.classList.add('spinning');

        const winner = weightedRandom(lunches);

        startSlotMachine(winner.name, () => {
            setTimeout(() => {
                spinBtn.classList.remove('spinning');
                spinBtn.disabled = false;
                spinBtn.textContent = '點擊抽籤';

                resultLabel.textContent = winner.name;
                resultQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
                resultOverlay.style.display = 'flex';
                fireConfetti();
            }, 500);
        });
    });

    addBtn.addEventListener('click', addLunch);
    lunchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addLunch();
    });

    closeResultBtn.addEventListener('click', () => {
        resultOverlay.style.display = 'none';
    });

    resultOverlay.addEventListener('click', (e) => {
        if (e.target === resultOverlay) {
            resultOverlay.style.display = 'none';
        }
    });

    renderList();
});
