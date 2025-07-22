// DOM 元素
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettings = document.getElementById('closeSettings');
const settingsOverlay = document.getElementById('settingsOverlay');
const themeMode = document.getElementById('themeMode');
const glassEffect = document.getElementById('glassEffect');
const blurIntensity = document.getElementById('blurIntensity');
const backgroundUrl = document.getElementById('backgroundUrl');
const setBackgroundUrl = document.getElementById('setBackgroundUrl');
const backgroundUpload = document.getElementById('backgroundUpload');
const resetSettings = document.getElementById('resetSettings');
const background = document.getElementById('background');
const currentBackgroundPreview = document.getElementById('currentBackgroundPreview').querySelector('img');
const profileCard = document.getElementById('profileCard');

// 初始化 IndexedDB
let db;
const request = indexedDB.open('backgroundDB', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('backgrounds', { keyPath: 'id' });
    objectStore.add({ id: 'customBackground', data: null });
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadSettings();
};

request.onerror = function(event) {
    console.error('IndexedDB 错误:', event.target.error);
};

// 加载设置
function loadSettings() {
    // 主题模式
    const savedTheme = localStorage.getItem('themeMode') || 'system';
    themeMode.value = savedTheme;
    applyTheme(savedTheme);
    
    // 毛玻璃效果
    const glassEnabled = localStorage.getItem('glassEffect') !== 'false';
    glassEffect.checked = glassEnabled;
    applyGlassEffect(glassEnabled);
    
    // 模糊强度
    const blurValue = localStorage.getItem('blurIntensity') || '8';
    blurIntensity.value = blurValue;
    applyBlurIntensity(blurValue);
    
    // 背景图片
    const savedBackgroundUrl = localStorage.getItem('backgroundUrl');
    if (savedBackgroundUrl) {
        setBackground(savedBackgroundUrl);
        backgroundUrl.value = savedBackgroundUrl;
    } else {
        // 尝试从 IndexedDB 获取自定义图片
        const transaction = db.transaction(['backgrounds'], 'readonly');
        const objectStore = transaction.objectStore('backgrounds');
        const getRequest = objectStore.get('customBackground');
        
        getRequest.onsuccess = function(event) {
            const backgroundData = event.target.result?.data;
            if (backgroundData) {
                setBackground(backgroundData);
            }
        };
    }
}

// 应用主题
function applyTheme(mode) {
    if (mode === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
            setMetaThemeColor('#1F2937');
        } else {
            document.documentElement.classList.remove('dark');
            setMetaThemeColor('#F3F4F6');
        }
    } else if (mode === 'dark') {
        document.documentElement.classList.add('dark');
        setMetaThemeColor('#1F2937');
    } else {
        document.documentElement.classList.remove('dark');
        setMetaThemeColor('#F3F4F6');
    }
}

// 设置 meta 主题色
function setMetaThemeColor(color) {
    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
        themeMeta = document.createElement('meta');
        themeMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', color);
}

// 应用毛玻璃效果
function applyGlassEffect(enabled) {
    const glassElements = document.querySelectorAll('.glass-effect');
    glassElements.forEach(element => {
        if (enabled) {
            element.classList.remove('no-glass');
        } else {
            element.classList.add('no-glass');
        }
    });
}

// 应用模糊强度
function applyBlurIntensity(value) {
    background.querySelector('img').style.filter = `blur(${value}px)`;
}

// 设置背景
function setBackground(url) {
    const img = background.querySelector('img');
    img.src = ''; // 重置 src 以触发加载
    img.src = url;
    img.onload = function() {
        currentBackgroundPreview.src = url;
    };
    img.onerror = function() {
        alert('图片加载失败，请检查URL或图片格式');
        // 恢复默认背景
        const defaultBg = 'https://www.xunhaii.com/bing-wallpaper/bing-wallpaper.jpg';
        img.src = defaultBg;
        currentBackgroundPreview.src = defaultBg;
        localStorage.removeItem('backgroundUrl');
        // 清除 IndexedDB 中的自定义背景
        const transaction = db.transaction(['backgrounds'], 'readwrite');
        const objectStore = transaction.objectStore('backgrounds');
        objectStore.put({ id: 'customBackground', data: null });
    };
}

// 保存自定义背景到 IndexedDB
function saveCustomBackground(file) {
    const reader = new FileReader();
    reader.onloadend = function() {
        const transaction = db.transaction(['backgrounds'], 'readwrite');
        const objectStore = transaction.objectStore('backgrounds');
        objectStore.put({ id: 'customBackground', data: reader.result });
        
        transaction.oncomplete = function() {
            setBackground(reader.result);
            // 移除 localStorage 中的 URL
            localStorage.removeItem('backgroundUrl');
        };
    };
    reader.readAsDataURL(file);
}

// 事件监听器
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.add('active'); // 添加动画类
});

function closeSettingsPanel() {
    settingsPanel.classList.remove('active'); // 移除动画类
}

closeSettings.addEventListener('click', closeSettingsPanel);
settingsOverlay.addEventListener('click', closeSettingsPanel);

// 添加面板关闭动画完成后的隐藏
settingsPanel.addEventListener('transitionend', function(e) {
    if (e.propertyName === 'opacity' && !settingsPanel.classList.contains('active')) {
        settingsPanel.classList.add('hidden');
    }
});

// 打开面板时显示
settingsBtn.addEventListener('click', function() {
    settingsPanel.classList.remove('hidden');
    // 在下一帧添加active类，确保动画触发
    setTimeout(() => {
        settingsPanel.classList.add('active');
    }, 10);
});

themeMode.addEventListener('change', () => {
    const mode = themeMode.value;
    localStorage.setItem('themeMode', mode);
    applyTheme(mode);
});

glassEffect.addEventListener('change', () => {
    const enabled = glassEffect.checked;
    localStorage.setItem('glassEffect', enabled);
    applyGlassEffect(enabled);
});

blurIntensity.addEventListener('input', () => {
    const value = blurIntensity.value;
    localStorage.setItem('blurIntensity', value);
    applyBlurIntensity(value);
});

setBackgroundUrl.addEventListener('click', () => {
    const url = backgroundUrl.value.trim();
    if (url) {
        localStorage.setItem('backgroundUrl', url);
        // 清除 IndexedDB 中的自定义背景
        const transaction = db.transaction(['backgrounds'], 'readwrite');
        const objectStore = transaction.objectStore('backgrounds');
        objectStore.put({ id: 'customBackground', data: null });
        setBackground(url);
    }
});

backgroundUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        saveCustomBackground(file);
    }
});

resetSettings.addEventListener('click', () => {
    if (confirm('确定要恢复默认设置吗？')) {
        // 清除 localStorage
        localStorage.removeItem('themeMode');
        localStorage.removeItem('glassEffect');
        localStorage.removeItem('blurIntensity');
        localStorage.removeItem('backgroundUrl');
        
        // 清除 IndexedDB
        const transaction = db.transaction(['backgrounds'], 'readwrite');
        const objectStore = transaction.objectStore('backgrounds');
        objectStore.put({ id: 'customBackground', data: null });
        
        // 重新加载设置
        loadSettings();
    }
});

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (themeMode.value === 'system') {
        applyTheme('system');
    }
});
    