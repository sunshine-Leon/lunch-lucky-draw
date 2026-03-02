document.addEventListener('DOMContentLoaded', () => {
    const lunchInput = document.getElementById('lunchInput');
    const addBtn = document.getElementById('addBtn');
    const lunchList = document.getElementById('lunchList');
    const spinBtn = document.getElementById('spinBtn');
    const resultOverlay = document.getElementById('resultOverlay');
    const resultLabel = document.getElementById('resultLabel');
    const closeResultBtn = document.getElementById('closeResultBtn');

    // 初始預設選項
    let lunches = ['牛肉麵', '吉野家', '麥當勞', '八方雲集', '健康便當', '壽司郎'];

    // 渲染列表
    function renderList() {
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

    // 新增選項
    window.addLunch = () => {
        const value = lunchInput.value.trim();
        if (value) {
            lunches.push(value);
            lunchInput.value = '';
            renderList();
            // 滾動到底部
            lunchList.scrollTop = lunchList.scrollHeight;
        }
    };

    // 刪除選項
    window.removeLunch = (index) => {
        lunches.splice(index, 1);
        renderList();
    };

    // 抽籤邏輯
    spinBtn.addEventListener('click', () => {
        if (lunches.length === 0) {
            alert('請先新增一些午餐選項！');
            return;
        }

        // 開始動畫效果
        spinBtn.disabled = true;
        spinBtn.classList.add('spinning');
        spinBtn.textContent = '決定中...';

        // 模擬隨機變動
        let count = 0;
        const interval = setInterval(() => {
            const randomPick = lunches[Math.floor(Math.random() * lunches.length)];
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
    addBtn.addEventListener('click', () => addLunch());
    lunchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addLunch();
    });

    closeResultBtn.addEventListener('click', () => {
        resultOverlay.style.display = 'none';
    });

    // 點擊遮罩關閉
    resultOverlay.addEventListener('click', (e) => {
        if (e.target === resultOverlay) {
            resultOverlay.style.display = 'none';
        }
    });

    // 初始渲染
    renderList();
});
