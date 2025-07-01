// DOM元素加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 主题切换功能 - 修复版
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  // 初始化主题
  function initTheme() {
    // 检查本地存储的主题偏好
    const savedTheme = localStorage.getItem('theme');
    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 应用主题
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }
  
  // 切换主题
  function toggleThemeMode() {
    htmlElement.classList.toggle('dark');
    // 保存主题偏好到本地存储
    const isDark = htmlElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  
  // 移动端菜单功能
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  function openMobileMenu() {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
  }
  
  function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = ''; // 恢复滚动
  }
  
  // 平滑滚动功能
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // 平滑滚动到目标位置
          window.scrollTo({
            top: targetElement.offsetTop - 80, // 减去导航栏高度
            behavior: 'smooth'
          });
          
          // 关闭移动菜单（如果打开）
          if (!mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
          }
        }
      });
    });
  }
  
  // 滚动时导航栏效果
  function handleScrollEffects() {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
      header.classList.add('shadow-md');
    } else {
      header.classList.remove('shadow-md');
    }
  }
  
  // 检查图片加载错误并替换为默认图片
  function setupImageErrorHandling() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        // 如果图片加载失败，使用默认图片
        this.src = 'https://picsum.photos/seed/default/400/300';
        this.alt = '图片加载失败';
      });
    });
  }
  
  // 绑定事件监听器
  function bindEventListeners() {
    // 主题切换
    themeToggle.addEventListener('click', toggleThemeMode);
    
    // 移动端菜单
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
    
    // 滚动事件
    window.addEventListener('scroll', handleScrollEffects);
  }
  
  // 初始化所有功能
  function init() {
    initTheme();
    bindEventListeners();
    setupSmoothScroll();
    setupImageErrorHandling();
    handleScrollEffects(); // 初始检查滚动位置
  }
  
  // 启动应用
  init();
});