const characters = {
  character1: { name: "캐릭터 1", description: "캐릭터 1 설명" },
  character2: { name: "캐릭터 2", description: "캐릭터 2 설명" },
  // ...
};
const mainPage = document.getElementById("main-page");
const detailPage = document.getElementById("detail-page");
const characterName = document.getElementById("character-name");
const characterDescription = document.getElementById("character-description");

function showPage(pageId, characterId) {
  if (pageId === "main") {
    mainPage.style.display = "block";
    detailPage.style.display = "none";
  } else if (pageId === "detail") {
    const character = characters[characterId];
    characterName.textContent = character.name;
    characterDescription.textContent = character.description;
    mainPage.style.display = "none";
    detailPage.style.display = "block";
  }
}

function show404Page() {
  // 404 페이지 표시 로직
  fetch("404.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("app").innerHTML = html;
    });
}

function handleRouteChange() {
  const path = window.location.pathname;
  if (path === "/") {
    showPage("main");
  } else if (path.startsWith("/characters/")) {
    const characterId = path.split("/")[2];
    if (characters[characterId]) {
      showPage("detail", characterId);
    } else {
      show404Page();
    }
  } else {
    show404Page();
  }
}

// 초기 로드 및 popstate 이벤트 처리
handleRouteChange();
window.addEventListener("popstate", handleRouteChange);

// history.pushState() 호출 시 라우팅 처리
function navigateTo(path) {
  history.pushState(null, "", path);
  handleRouteChange();
}

// 캐릭터 버튼 클릭 이벤트 처리 (navigateTo() 사용)
mainPage.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const characterId = event.target.dataset.character;
    navigateTo(`/characters/${characterId}`);
  }
});

detailPage.addEventListener("click", (event) => {
  if (event.target.id === "back-button") {
    detailPage.style.display = "none";
    mainPage.style.display = "block";
    navigateTo("/");
  }
});
