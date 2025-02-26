function handleRouteChange() {
  const path = window.location.pathname;
  if (path === '/') {
      showPage('main');
  } else if (path.startsWith('/characters/')) {
      const characterId = path.split('/')[2];
      if (characters[characterId]) {
          showPage('detail', characterId);
      } else {
          show404Page();
      }
  } else {
      show404Page();
  }
}

// 초기 로드 시 라우팅 처리
handleRouteChange();

window.addEventListener('popstate', handleRouteChange);