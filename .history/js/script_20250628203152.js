function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkmode', document.body.classList.contains('dark'));
}

// 페이지 로드시 적용
if (localStorage.getItem('darkmode') === 'true') {
  document.body.classList.add('dark');
}

function notice() {
  window.location.href = "notice.html";
}

function toggleDetail(element) {
  const detail = element.querySelector('.detail');
  detail.classList.toggle('hidden');
}
