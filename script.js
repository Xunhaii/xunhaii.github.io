// 主题切换
const themeToggle = document.getElementById('theme-toggle');

function toggleTheme() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// 移动端菜单
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function toggleMobileMenu() {
  mobileMenu.classList.toggle('hidden');
}

// 平滑滚动
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 关闭移动菜单（如果打开）
      if (!mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu();
      }
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// 处理滚动事件
function handleScroll() {
  const header = document.querySelector('header');
  if (window.scrollY > 10) {
    header.classList.add('shadow-md');
  } else {
    header.classList.remove('shadow-md');
  }
}

// 添加事件监听器
function setupEventListeners() {
  themeToggle.addEventListener('click', toggleTheme);
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
  window.addEventListener('scroll', handleScroll);
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  setupEventListeners();
  setupSmoothScroll();
  handleScroll(); // 初始调用一次以设置正确的样式
});