document.addEventListener('DOMContentLoaded', () => {
    const lunchInput = document.getElementById('lunchInput');
    const addBtn = document.getElementById('addBtn');
    const lunchList = document.getElementById('lunchList');
    const spinBtn = document.getElementById('spinBtn');
    const resultOverlay = document.getElementById('resultOverlay');
    const resultLabel = document.getElementById('resultLabel');
    const closeResultBtn = document.getElementById('closeResultBtn');
    const modeBtns = document.querySelectorAll('.mode-btn');

    // 初始預設選項
    let lunches = ['牛肉麵', '吉野家', '麥當勞', '八方雲集', '健康便當', '壽司郎'];

    // 渲染列表
    function renderList() {
        const lunches = data[currentMode];
        lunchList.innerHTML = '';
        lunches.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'lunch-item';
            div.innerHTML = `
                <span>${item}</span>
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

    // 切換模式
    function setMode(mode) {
        currentMode = mode;

        // 更新 UI 狀態
        modeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // 更新 Input 提示
        const modeText = mode === 'lunch' ? '午餐' : '晚餐';
        lunchInput.placeholder = `想吃什麼${modeText}？(例如：${mode === 'lunch' ? '牛肉麵' : '大呼過癮'})`;

        renderList();
    }

    // 新增選項
    window.addLunch = () => {
        const value = lunchInput.value.trim();
        if (value) {
            data[currentMode].push(value);
            lunchInput.value = '';
            renderList();
            lunchList.scrollTop = lunchList.scrollHeight;
        }
    };

    // 刪除選項
    window.removeLunch = (index) => {
        data[currentMode].splice(index, 1);
        renderList();
    };

    // 抽籤邏輯
    spinBtn.addEventListener('click', () => {
        const currentList = data[currentMode];
        if (currentList.length === 0) {
            alert(`請先新增一些${currentMode === 'lunch' ? '午餐' : '晚餐'}選項！`);
            return;
        }

        const userNameInput = document.getElementById('userNameInput');
        const enteredName = userNameInput.value.trim();
        const fallbackName = animalNames[Math.floor(Math.random() * animalNames.length)];
        const finalName = enteredName || fallbackName;

        spinBtn.disabled = true;
        spinBtn.classList.add('spinning');
        spinBtn.textContent = '決定中...';

        let count = 0;
        const interval = setInterval(() => {
            const randomPick = currentList[Math.floor(Math.random() * currentList.length)];
            spinBtn.textContent = randomPick;
            count++;

            if (count > 20) {
                clearInterval(interval);
                const finalPick = lunches[Math.floor(Math.random() * lunches.length)];

                setTimeout(() => {
                    spinBtn.classList.remove('spinning');
                    spinBtn.disabled = false;
                    spinBtn.textContent = '點擊抽籤';

                    // 顯示結果
                    resultLabel.textContent = finalPick;
                    resultOverlay.style.display = 'flex';
                }, 500);
            }
        }, 80);
    });

    // 綁定事件
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    addBtn.addEventListener('click', () => addLunch());
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
