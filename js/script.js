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
const rarityColors = ["#fff", "#88f", "#d8bfd8", "#ff0"];

const characterName = document.getElementById("character-name");
const characterImage = document.getElementById("character-image");
const characterButtonsContainer = document.getElementById("character-buttons");

const startTalents = document.getElementById("start-talents");
const talents = document.getElementById("talents");
const ultimates = document.getElementById("ultimates");
const ultimateTalents = document.getElementById("ultimate-talents");
const magicalObjects = document.getElementById("magical-objects");

const mainPage = document.getElementById("main-page");
const detailPage = document.getElementById("detail-page");

const saveButton = document.getElementById("save-button");
const exportButton = document.getElementById("export-button");
const importFile = document.getElementById("import-file");
const exportPopup = document.getElementById("export-popup");
const exportData = document.getElementById("export-data");
const copyButton = document.getElementById("copy-button");
const downloadButton = document.getElementById("download-button");
const closeButton = document.getElementById("close-button");

characters.forEach((character) => {
  const img = document.createElement("img");
  img.id = character.id;
  img.classList.add("character-image");
  img.setAttribute("data-character", character.id);
  img.setAttribute("src", `assets/${character.id}/portrait.webp`);
  img.setAttribute("alt", character.name);
  characterButtonsContainer.appendChild(img);
});

function showPage(pageId, characterId) {
  if (pageId === "main") {
    mainPage.style.display = "block";
    detailPage.style.display = "none";

    // 메인 페이지로 돌아올 때 캐릭터 이미지를 다시 로드
    characterButtonsContainer.innerHTML = "";
    characters.forEach((character) => {
      const img = document.createElement("img");
      img.id = character.id;
      img.classList.add("character-image");
      img.setAttribute("data-character", character.id);
      img.setAttribute("src", `assets/${character.id}/portrait.webp`);
      img.setAttribute("alt", character.name);
      characterButtonsContainer.appendChild(img);
    });

    // 선택된 아이템 초기화
    startTalents.innerHTML = "";
    talents.innerHTML = "";
    ultimates.innerHTML = "";
    ultimateTalents.innerHTML = "";
    magicalObjects.innerHTML = "";
    selectedTalents = { ...initialTalents }; // 선택된 아이템 초기화

    // 오른쪽 열의 아이템 초기화
    const rightCols = document.querySelectorAll("#detail-page .right-col");
    rightCols.forEach((col) => (col.innerHTML = ""));
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
  // 페이지 이동 시 초기화
  selectedTalents = { ...initialTalents };
}

// 초기 로드 및 popstate 이벤트 처리
handleRouteChange();
window.addEventListener("popstate", handleRouteChange);

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
    if (!characterTalents) {
      throw new Error("Character talents not found");
    }

    // 페이지를 다시 로드할 때 초기화
    selectedTalents = { ...initialTalents };

    const character = characters.find((char) => char.id === characterId);
    if (character) {
      characterName.textContent = character.name;
    }

    characterImage.setAttribute("data-character", characterId);
    characterImage.setAttribute("src", `/assets/${characterId}/icon.png`);
    characterImage.setAttribute("alt", character.name);

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

    // 각 row에 placeholder 추가
    addPlaceholders();
  } catch (error) {
    console.error("Error fetching talents:", error);
  }
}

function addPlaceholders() {
  const rows = document.querySelectorAll("#detail-page table tr");
  const placeholdersCount = [1, 7, 1, 1, 53]; // 각 줄에 필요한 placeholder 개수

  rows.forEach((row, index) => {
    const rightCol = row.querySelector(".right-col");
    for (let i = 0; i < placeholdersCount[index]; i++) {
      const placeholder = document.createElement("div");
      placeholder.classList.add("item-block");
      placeholder.dataset.itemId = "";
      placeholder.onmouseover = (event) => showTooltip(event);
      placeholder.onmouseout = () => hideTooltip();

      const placeholderInner = document.createElement("div");
      placeholderInner.classList.add("placeholder");
      placeholder.appendChild(placeholderInner);

      rightCol.appendChild(placeholder);
    }

    // 왼쪽 열의 아이템에도 이벤트 추가
    const leftCol = row.querySelector(".left-col");
    const items = leftCol.querySelectorAll(".item");
    items.forEach((item) => {
      item.onmouseover = (event) => showTooltip(event);
      item.onmouseout = () => hideTooltip();
    });
  });
}

function makeItemBlock(itemObject) {
  try {
    const {
      id: itemId,
      name: itemName,
      icon: itemIcon,
      description: itemDescription,
    } = itemObject;

    const itemBlock = document.createElement("div");
    itemBlock.classList.add("item-block");
    itemBlock.dataset.itemId = itemId;

    const item = document.createElement("div");
    item.classList.add("item");
    item.dataset.itemId = itemId;
    item.onmouseover = (event) => showTooltip(event); // 마우스 오버 이벤트 추가
    item.onmouseout = () => hideTooltip(); // 마우스 아웃 이벤트 추가

    const img = document.createElement("img");
    const characterId = window.location.pathname.split("/")[2];
    img.src = `/assets/${characterId}/${itemIcon}`;
    img.alt = itemName;
    img.classList.add("item-icon");

    item.appendChild(img);
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

function showTooltip(event) {
  const itemElement = event.target.closest(".item");
  if (!itemElement) return;
  const itemId = itemElement.dataset.itemId;
  const item =
    characterTalents.startTalents.find((item) => item.id === itemId) ||
    characterTalents.talents.find((item) => item.id === itemId) ||
    characterTalents.ultimates.find((item) => item.id === itemId) ||
    characterTalents.ultimateTalents.find((item) => item.id === itemId);
  const name = item ? item.name : "Unknown Item";

  let description = item
    ? item.description.replace(/<br>/g, "\n")
    : "Description not found";

  if (item && item.rarityValue) {
    item.rarityValue.forEach((values, index) => {
      const coloredValues = values
        .map((value, i) => {
          return `<span style="color: ${rarityColors[i]}">${value}</span>`;
        })
        .join("/");
      description = description.replace(`{${index}}`, coloredValues);
    });
  }

  const tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = `<strong style="font-size: 1.2em;">${name}</strong><br>${description}`;
  tooltip.style.display = "block";
  const rect = itemElement.getBoundingClientRect();
  tooltip.style.left = rect.right + 5 + "px";
  tooltip.style.top = rect.top + "px";
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.style.display = "none";
}

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
