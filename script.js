document.addEventListener('DOMContentLoaded', () => {
    const lunchInput = document.getElementById('lunchInput');
    const userNameInput = document.getElementById('userNameInput');
    const addBtn = document.getElementById('addBtn');
    const lunchList = document.getElementById('lunchList');
    const spinBtn = document.getElementById('spinBtn');
    const resultOverlay = document.getElementById('resultOverlay');
    const resultLabel = document.getElementById('resultLabel');
    const closeResultBtn = document.getElementById('closeResultBtn');
    const resultQuote = document.getElementById('resultQuote');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const slotReel = document.getElementById('slotReel');

    // 從 LocalStorage 載入資料
    let lunches = JSON.parse(localStorage.getItem('lunches')) || [
        { name: '牛肉麵', weight: 1 },
        { name: '吉野家', weight: 1 },
        { name: '麥當勞', weight: 1 },
        { name: '八方雲集', weight: 1 },
        { name: '健康便當', weight: 1 },
        { name: '壽司郎', weight: 1 }
    ];

    userNameInput.value = localStorage.getItem('userName') || '';

    const quotes = [
        "這家真的超讚，不吃會後悔！",
        "雖然普通，但填飽肚子還是可以的。",
        "恭喜抽中！今天的運氣都花在這裡了。",
        "這家最近好像在排隊，要有心理準備喔。",
        "這就是命運的安排，去吃吧！",
        "如果不喜歡，可以再抽一次 (喂)。",
        "熱量警告！但沒關係，明天再減肥。",
        "這家店的老闆最近心情不錯，快去！",
        "這家店的 CP 值爆表，絕對划算。",
        "聽說這家店有隱藏菜單，你可以問問看。"
    ];

    function saveData() {
        localStorage.setItem('lunches', JSON.stringify(lunches));
        localStorage.setItem('userName', userNameInput.value.trim());
    }

    // 渲染列表
    function renderList() {
        lunchList.innerHTML = '';
        lunches.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'lunch-item';
            div.style.animationDelay = `${index * 0.05}s`;
            div.innerHTML = `
                <div class="item-main">
                    <div class="weight-controls">
                        <button class="weight-btn dec-btn" data-index="${index}">−</button>
                        <span class="weight-display">${item.weight}</span>
                        <button class="weight-btn inc-btn" data-index="${index}">+</button>
                    </div>
                    <span class="item-name">${item.name}</span>
                </div>
                <button class="delete-btn" data-index="${index}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
            lunchList.appendChild(div);
        });
    }

    // 事件委派
    lunchList.addEventListener('click', (e) => {
        const target = e.target;
        const index = parseInt(target.dataset.index);
        
        if (target.classList.contains('dec-btn')) {
            updateWeight(index, -1);
        } else if (target.classList.contains('inc-btn')) {
            updateWeight(index, 1);
        } else if (target.classList.contains('delete-btn')) {
            removeLunch(index);
        }
    });

    function updateWeight(index, delta) {
        lunches[index].weight = Math.max(1, Math.min(10, lunches[index].weight + delta));
        renderList();
        saveData();
    }

    function removeLunch(index) {
        const item = lunchList.children[index];
        item.style.transform = 'scale(0.8) translateX(50px)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            lunches.splice(index, 1);
            renderList();
            saveData();
        }, 300);
    }

    function addLunch() {
        const value = lunchInput.value.trim();
        if (value) {
            lunches.push({ name: value, weight: 1 });
            lunchInput.value = '';
            renderList();
            saveData();
            
            // 滾動到最新項目
            const lastItem = lunchList.lastElementChild;
            if (lastItem) {
                lastItem.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    userNameInput.addEventListener('input', saveData);

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

    // 平滑的老虎機滾輪動畫
    function startSlotMachine(winnerName, callback) {
        // 準備滾輪內容：隨機項目 + 最後的中獎者
        const reelItems = [];
        const cycles = 5; // 轉多少圈
        const totalItems = lunches.length;
        
        // 隨機填充前段
        for(let i = 0; i < cycles * 10; i++) {
            reelItems.push(lunches[Math.floor(Math.random() * totalItems)].name);
        }
        
        // 加入中獎者
        reelItems.push(winnerName);
        
        // 渲染到滾輪
        slotReel.style.transition = 'none';
        slotReel.style.transform = 'translateY(0)';
        slotReel.innerHTML = reelItems.map(name => `<div class="slot-item">${name}</div>`).join('');
        
        // 強制重繪
        slotReel.offsetHeight;
        
        // 開始滾動
        const itemHeight = 120; // 須與 CSS 120px 一致
        const targetOffset = (reelItems.length - 1) * itemHeight;
        
        slotReel.style.transition = 'transform 3s cubic-bezier(0.15, 0, 0.15, 1)';
        slotReel.style.transform = `translateY(-${targetOffset}px)`;
        
        setTimeout(() => {
            const winnerElement = slotReel.lastElementChild;
            winnerElement.classList.add('winning');
            callback();
        }, 3200);
    }

    // 高級紙屑特效
    function fireConfetti() {
        const ctx = confettiCanvas.getContext('2d');
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        let particles = [];
        const colors = ['#00f2ff', '#7000ff', '#ff007a', '#ffcc00', '#ffffff'];

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * confettiCanvas.width,
                y: -20,
                r: Math.random() * 6 + 4,
                d: Math.random() * 25 + 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
                tiltAngle: 0
            });
        }

        function draw() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            particles.forEach((p, i) => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.d);
                p.tilt = (Math.sin(p.tiltAngle) * 15);

                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
                ctx.stroke();

                if (p.y > confettiCanvas.height) {
                    particles[i] = {
                        x: Math.random() * confettiCanvas.width,
                        y: -20,
                        r: p.r,
                        d: p.d,
                        color: p.color,
                        tilt: p.tilt,
                        tiltAngleIncremental: p.tiltAngleIncremental,
                        tiltAngle: p.tiltAngle
                    };
                }
            });
            
            if (resultOverlay.style.display === 'flex') {
                requestAnimationFrame(draw);
            }
        }
        draw();
    }

    spinBtn.addEventListener('click', () => {
        if (lunches.length === 0) {
            alert("請先新增一些選項！");
            return;
        }

        spinBtn.disabled = true;
        spinBtn.classList.add('spinning-card');
        const btnText = spinBtn.querySelector('.btn-text');
        btnText.textContent = '決定命運中...';

        const winner = weightedRandom(lunches);

        startSlotMachine(winner.name, () => {
            setTimeout(() => {
                spinBtn.classList.remove('spinning-card');
                spinBtn.disabled = false;
                btnText.textContent = '再次抽籤';

                const userName = userNameInput.value.trim();
                const greeting = userName ? `${userName}，` : "";
                
                resultOverlay.querySelector('h2').textContent = `${greeting}今日運勢首選`;
                resultLabel.textContent = winner.name;
                resultQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
                resultOverlay.style.display = 'flex';
                fireConfetti();
            }, 600);
        });
    });

    addBtn.addEventListener('click', addLunch);
    lunchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addLunch();
    });

    closeResultBtn.addEventListener('click', () => {
        resultOverlay.style.display = 'none';
        slotReel.style.transition = 'none';
        slotReel.style.transform = 'translateY(0)';
        slotReel.innerHTML = `<div class="slot-item">準備好了嗎？</div>`;
    });

    resultOverlay.addEventListener('click', (e) => {
        if (e.target === resultOverlay) {
            resultOverlay.style.display = 'none';
            slotReel.style.transition = 'none';
            slotReel.style.transform = 'translateY(0)';
            slotReel.innerHTML = `<div class="slot-item">準備好了嗎？</div>`;
        }
    });

    const clearAllBtn = document.getElementById('clearAllBtn');
    clearAllBtn.addEventListener('click', () => {
        if (confirm('確定要清除所有午餐選項嗎？')) {
            lunches = [];
            renderList();
            saveData();
        }
    });

    renderList();
});
