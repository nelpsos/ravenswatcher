const characters = [
  { id: "scarlet", name: "스칼렛", description: "캐릭터 1 설명" },
  {
    id: "the_piped_piper",
    name: "피리 부는 사나이",
    description: "캐릭터 2 설명",
  },
  { id: "beowulf", name: "베오울프", description: "캐릭터 3 설명" },
  { id: "the_snow_queen", name: "눈의 여왕", description: "캐릭터 4 설명" },
  { id: "aladdin", name: "알라딘", description: "캐릭터 5 설명" },
  { id: "melusine", name: "멜루신", description: "캐릭터 6 설명" },
  { id: "geppetto", name: "제페토", description: "캐릭터 7 설명" },
  { id: "wukong", name: "오공", description: "캐릭터 8 설명" },
  { id: "carmilla", name: "카르밀라", description: "캐릭터 9 설명" },
];

const characterName = document.getElementById("character-name");
const characterDescription = document.getElementById("character-description");
const characterButtonsContainer = document.getElementById("character-buttons");

characters.forEach((character) => {
  const img = document.createElement("img");
  img.id = character.id;
  img.classList.add("character-image");
  img.setAttribute("data-character", character.id);
  img.setAttribute("src", `assets/${character.id}/portrait.webp`);
  img.setAttribute("alt", character.name);
  characterButtonsContainer.appendChild(img);
});

const mainPage = document.getElementById("main-page");
const detailPage = document.getElementById("detail-page");

function showPage(pageId, characterId) {
  if (pageId === "main") {
    mainPage.style.display = "block";
    detailPage.style.display = "none";
  } else if (pageId === "detail") {
    showCharacterPage(characterId);
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
    const character = characters.find((char) => char.id === characterId);
    if (character) {
      showPage("detail", characterId);
    } else {
      show404Page();
    }
  } else {
    show404Page();
  }
}

// history.pushState() 호출 시 라우팅 처리
function navigateTo(path) {
  history.pushState(null, "", path);
  handleRouteChange();
}

// 초기 로드 및 popstate 이벤트 처리
handleRouteChange();
window.addEventListener("popstate", handleRouteChange);

const initialTalents = {
  startTalents: [],
  talents: [],
  ultimates: [],
  ultimateTalents: [],
  magicalObjects: [],
};

let characterTalents = null;
let selectedTalents = {
  startTalents: [],
  talents: [],
  ultimates: [],
  ultimateTalents: [],
  magicalObjects: [],
};

const startTalents = document.getElementById("start-talents");
const talents = document.getElementById("talents");
const ultimates = document.getElementById("ultimates");
const ultimateTalents = document.getElementById("ultimate-talents");
const magicalObjects = document.getElementById("magical-objects");

// 캐릭터 버튼 클릭 이벤트 처리 (navigateTo() 사용)
mainPage.addEventListener("click", (event) => {
  if (event.target.classList.contains("character-image")) {
    const characterId = event.target.dataset.character;
    showPage("detail", characterId);
    navigateTo(`/characters/${characterId}`);
    selectedTalents = { ...initialTalents };
  }
});

// 캐릭터 페이지 표시
async function showCharacterPage(characterId) {
  try {
    const response = await fetch(`/assets/${characterId}/talents.json`);
    characterTalents = await response.json();
    console.log(characterTalents.startTalents);
    console.log(startTalents);

    startTalents.innerHTML = characterTalents.startTalents
      .map(makeItemBlock)
      .join("");
    talents.innerHTML = characterTalents.talents.map(makeItemBlock).join("");
    ultimates.innerHTML = characterTalents.ultimates
      .map(makeItemBlock)
      .join("");
    ultimateTalents.innerHTML = characterTalents.ultimateTalents
      .map(makeItemBlock)
      .join("");
  } catch (error) {
    console.error("Error fetching talents:", error);
  }
}

function makeItemBlock(itemObject) {
  try {
    const { id: itemId, name: itemName } = itemObject;

    const itemBlock = document.createElement("div");
    itemBlock.classList.add("item-block");
    itemBlock.dataset.itemId = itemId;

    const item = document.createElement("div");
    item.classList.add("item");
    item.dataset.itemId = itemId;
    item.textContent = itemName;
    itemBlock.appendChild(item);

    return itemBlock.outerHTML;
  } catch (error) {
    console.error("Error making item block:", error);
  }
}

detailPage.addEventListener("click", (event) => {
  if (event.target.id === "back-button") {
    detailPage.style.display = "none";
    mainPage.style.display = "block";
    navigateTo("/");
    return;
  }

  const item = event.target.closest(".item");
  if (item) {
    const itemBlock = item.parentElement;
    const row = itemBlock.parentElement.parentElement.dataset.row;
    const leftCol = detailPage.querySelector(`[data-row="${row}"] .left-col`);
    const rightCol = detailPage.querySelector(`[data-row="${row}"] .right-col`);

    if (itemBlock.parentElement.classList.contains("right-col")) {
      // 오른쪽 열의 아이템 클릭 시 왼쪽 열로 이동
      const originalItemBlock = leftCol.querySelector(
        `[data-item-id="${item.dataset.itemId}"]`
      );

      if (originalItemBlock) {
        const placeholder = originalItemBlock.querySelector(".placeholder");
        if (placeholder) {
          placeholder.replaceWith(item);
          itemBlock.appendChild(placeholder);
        } else {
          originalItemBlock.appendChild(item);
        }
      }
    } else {
      const placeholder = rightCol.querySelector(".placeholder");

      // 왼쪽 열의 아이템 클릭 시 오른쪽 열로 이동
      if (placeholder) {
        placeholder.parentElement.dataset.itemId = item.dataset.itemId;
        placeholder.replaceWith(item);
        itemBlock.appendChild(placeholder);
      }
    }
  }
});

const saveButton = document.getElementById("save-button");
const exportButton = document.getElementById("export-button");
const importFile = document.getElementById("import-file");
const exportPopup = document.getElementById("export-popup");
const exportData = document.getElementById("export-data");
const copyButton = document.getElementById("copy-button");
const downloadButton = document.getElementById("download-button");
const closeButton = document.getElementById("close-button");

// 내보내기 버튼 클릭 이벤트 처리
exportButton.addEventListener("click", () => {
  const data = getItemsData();
  const json = JSON.stringify(data, null, 2); // 들여쓰기 추가
  exportData.textContent = json;
  exportPopup.style.display = "block";
});

// 복사 버튼 클릭 이벤트 처리
copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(exportData.textContent);
});

// 다운로드 버튼 클릭 이벤트 처리
downloadButton.addEventListener("click", () => {
  const json = exportData.textContent;
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "itemsData.json";
  a.click();
  URL.revokeObjectURL(url);
});

// 닫기 버튼 클릭 이벤트 처리
closeButton.addEventListener("click", () => {
  exportPopup.style.display = "none";
});

// 저장 버튼 클릭 이벤트 처리
saveButton.addEventListener("click", () => {
  const data = getItemsData();
  localStorage.setItem("itemsData", JSON.stringify(data));
});

// 불러오기 기능 구현
function loadItemsData() {
  const data = JSON.parse(localStorage.getItem("itemsData"));
  if (data) {
    setItemsData(data);
  }
}

// 가져오기 기능 구현
importFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    setItemsData(data);
  };
  reader.readAsText(file);
});

// 아이템 데이터 가져오기
function getItemsData() {
  const data = [];
  // ... 아이템 데이터 추출 로직 ...
  return data;
}

// 아이템 데이터 설정
function setItemsData(data) {
  // ... 아이템 데이터 표시 로직 ...
}

// 초기 로드 시 데이터 불러오기
// loadItemsData();
