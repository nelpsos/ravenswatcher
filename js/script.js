const characters = [
  { id: "scarlet", name: "스칼렛", description: "캐릭터 1 설명" },
  {
    id: "the_piped_piper",
    name: "피리 부는 사나이",
    description: "캐릭터 2 설명",
  },
  { id: "beowulf", name: "베오울프", description: "캐릭터 3 설명" },
  { id: "snow_queen", name: "눈의 여왕", description: "캐릭터 4 설명" },
  { id: "aladdin", name: "알라딘", description: "캐릭터 5 설명" },
  { id: "melusine", name: "멜루신", description: "캐릭터 6 설명" },
  { id: "geppetto", name: "제페토", description: "캐릭터 7 설명" },
  { id: "wukong", name: "오공", description: "캐릭터 8 설명" },
  { id: "carmilla", name: "카르밀라", description: "캐릭터 9 설명" },
];

const mainPage = document.getElementById("main-page");
const detailPage = document.getElementById("detail-page");
const characterName = document.getElementById("character-name");
const characterDescription = document.getElementById("character-description");
const characterButtonsContainer = document.getElementById("character-buttons");

characters.forEach((character) => {
  const button = document.createElement("button");
  button.setAttribute("data-character", character.id);
  button.textContent = character.name;
  characterButtonsContainer.appendChild(button);
});

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
