const characters = [
  { id: "scarlet", name: "스칼렛" },
  {
    id: "the_piped_piper",
    name: "피리 부는 사나이",
  },
  { id: "beowulf", name: "베오울프" },
  { id: "the_snow_queen", name: "눈의 여왕" },
  { id: "aladdin", name: "알라딘" },
  { id: "melusine", name: "멜루신" },
  { id: "geppetto", name: "제페토" },
  { id: "wukong", name: "오공" },
  { id: "carmilla", name: "카르밀라" },
];

const initialTalents = {
  startTalents: [],
  talents: [],
  ultimates: [],
  ultimateTalents: [],
  magicalObjects: [],
};

const COLOR_THEME = {
  DARK: { name: "dark", icon: "☾" },
  LIGHT: { name: "light", icon: "✵" },
};

let originalCharacterTalents = null;
let originalMagicalObjects = null;
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
const loadPopup = document.getElementById("load-popup");
const closeButton = document.getElementById("close-button");

const headerLogo = document.getElementById("header-logo");

let tooltipTimer = null;

const darkModeToggle = document.getElementById("dark-mode-toggle");

// 페이지 진입 시 로컬스토리지의 다크모드 값 읽기
document.addEventListener("DOMContentLoaded", () => {
  const savedColorTheme = getUserColorTheme();
  document.documentElement.setAttribute("color-theme", savedColorTheme);
  darkModeToggle.textContent = savedColorTheme === "dark" ? "☾" : "✵";
});

function getUserColorTheme() {
  const savedColorTheme = localStorage.getItem("color-theme");
  if (savedColorTheme) return savedColorTheme;
  const osColorTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? COLOR_THEME.DARK.name
    : COLOR_THEME.LIGHT.name;
  return osColorTheme;
}

darkModeToggle.addEventListener("click", () => {
  const currentColorTheme =
    document.documentElement.getAttribute("color-theme");
  const changedColorTheme =
    currentColorTheme === COLOR_THEME.DARK.name
      ? COLOR_THEME.LIGHT
      : COLOR_THEME.DARK;

  document.documentElement.setAttribute("color-theme", changedColorTheme.name);
  darkModeToggle.textContent = changedColorTheme.icon;
  localStorage.setItem("color-theme", changedColorTheme.name);
});

headerLogo.addEventListener("click", (event) => {
  event.preventDefault();
  navigateTo("/");
});

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
window.addEventListener("popstate", () => {
  handleRouteChange();
  hideTooltip(); // 툴팁 숨기기
});

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
    const [characterResponse, magicalObjectsResponse] = await Promise.all([
      fetch(`/assets/${characterId}/talents.json`),
      fetch(`/assets/magical_objects/magicalObjects.json`),
    ]);

    originalCharacterTalents = await characterResponse.json();
    originalMagicalObjects = await magicalObjectsResponse.json();

    if (!originalCharacterTalents) {
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

    startTalents.innerHTML = originalCharacterTalents.startTalents
      .map(makeCharacterItemBlock)
      .join("");
    talents.innerHTML = originalCharacterTalents.talents
      .map(makeCharacterItemBlock)
      .join("");
    ultimates.innerHTML = originalCharacterTalents.ultimates
      .map(makeCharacterItemBlock)
      .join("");
    ultimateTalents.innerHTML = originalCharacterTalents.ultimateTalents
      .map(makeCharacterItemBlock)
      .join("");
    magicalObjects.innerHTML = originalMagicalObjects
      .map(makeObjectItemBlock)
      .join("");

    addPlaceholders();
    addTooltipEventListeners();
  } catch (error) {
    console.error("Error fetching talents:", error);
  }
}

function addPlaceholders() {
  const rows = document.querySelectorAll("#detail-page table tr");
  const placeholdersCount = [1, 7, 1, 1, 53]; // 각 줄에 필요한 placeholder 개수

  rows.forEach((row, index) => {
    const rightCol = row.querySelector(".right-col");
    rightCol.innerHTML = null;
    for (let i = 0; i < placeholdersCount[index]; i++) {
      const placeholder = document.createElement("div");
      placeholder.classList.add("item-block");
      placeholder.dataset.itemId = "";

      const placeholderInner = document.createElement("div");
      placeholderInner.classList.add("placeholder");
      placeholder.appendChild(placeholderInner);

      rightCol.appendChild(placeholder);
    }
  });
}

function addTooltipEventListeners() {
  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    item.addEventListener("mouseover", showTooltip);
    item.addEventListener("mouseout", hideTooltip);
  });
}

function makeCharacterItemBlock(itemObject) {
  try {
    const { id: itemId, name: itemName, icon: itemIcon } = itemObject;

    const itemBlock = document.createElement("div");
    const item = document.createElement("div");
    const img = document.createElement("img");
    const characterId = window.location.pathname.split("/")[2];

    itemBlock.classList.add("item-block");
    itemBlock.dataset.itemId = itemId;

    item.classList.add("item");
    item.dataset.itemId = itemId;
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

function makeObjectItemBlock(itemObject) {
  try {
    const { id: itemId, name: itemName, icon: itemIcon } = itemObject;

    const itemBlock = document.createElement("div");
    const item = document.createElement("div");
    const img = document.createElement("img");

    itemBlock.classList.add("item-block");
    itemBlock.dataset.itemId = itemId;

    item.classList.add("item");
    item.dataset.itemId = itemId;
    img.src = `/assets/magical_objects/${itemIcon}`;
    img.alt = itemName;
    img.classList.add("item-icon");

    item.appendChild(img);
    itemBlock.appendChild(item);

    // 오른쪽 열에만 개수 표시를 위한 span 추가
    if (
      itemBlock.parentElement &&
      itemBlock.parentElement.classList.contains("right-col")
    ) {
      const countSpan = document.createElement("span");
      countSpan.classList.add("item-count");
      countSpan.textContent = "1";
      itemBlock.appendChild(countSpan);
    }

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
    const row = itemBlock.parentElement?.parentElement?.dataset?.row;
    if (!row) return; // row가 null인 경우 처리
    const rightCol = detailPage.querySelector(`[data-row="${row}"] .right-col`);

    const stackableRarities = ["COMMON", "RARE", "EPIC"];
    const rarity = originalMagicalObjects.find(
      (obj) => obj.id === itemBlock.dataset.itemId
    );

    if (row === "4" && stackableRarities.includes(rarity.rarity)) {
      // magicalObjects 행의 경우
      if (itemBlock.parentElement.classList.contains("right-col")) {
        // 오른쪽 열의 아이템 클릭 시 개수 감소
        const countSpan = itemBlock.querySelector(".item-count");
        countSpan.textContent = parseInt(countSpan.textContent) - 1;
        if (parseInt(countSpan.textContent) === 0) {
          // 개수가 0이 되면 아이템 블록 제거하고 placeholder 추가
          const placeholder = document.createElement("div");
          placeholder.classList.add("item-block");
          placeholder.dataset.itemId = "";

          const placeholderInner = document.createElement("div");
          placeholderInner.classList.add("placeholder");
          placeholder.appendChild(placeholderInner);

          itemBlock.replaceWith(placeholder);
          hideTooltip();
        }
        // selectedTalents에서 아이템 제거
        selectedTalents.magicalObjects = selectedTalents.magicalObjects.filter(
          (obj) => obj.id !== item.dataset.itemId
        );
      } else {
        const existingItemBlock = rightCol.querySelector(
          `[data-item-id="${item.dataset.itemId}"]`
        );
        if (existingItemBlock) {
          // 이미 존재하는 아이템 블록이 있으면 개수만 증가
          const countSpan = existingItemBlock.querySelector(".item-count");
          countSpan.textContent = parseInt(countSpan.textContent) + 1;
        } else {
          // 존재하지 않으면 새로운 아이템 블록 추가
          const newItemBlock = itemBlock.cloneNode(true);
          const countSpan = newItemBlock.querySelector(".item-count");
          if (countSpan) {
            countSpan.textContent = "1";
          } else {
            const newCountSpan = document.createElement("span");
            newCountSpan.classList.add("item-count");
            newCountSpan.textContent = "1";
            newItemBlock.appendChild(newCountSpan);
          }
          const placeholder = rightCol.querySelector(".placeholder");
          if (placeholder) {
            placeholder.parentElement.replaceWith(newItemBlock);
          }
        }
        // selectedTalents에 아이템 추가
        selectedTalents.magicalObjects.push({
          id: item.dataset.itemId,
          set: item.dataset.set,
        });
      }
    } else {
      if (itemBlock.parentElement.classList.contains("right-col")) {
        // 오른쪽 열의 아이템 클릭 시 왼쪽 열로 이동
        const leftCol = detailPage.querySelector(
          `[data-row="${row}"] .left-col`
        );
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
  }
});

function showTooltip(event) {
  const itemElement = event.target.closest(".item");
  if (!itemElement) return;
  const itemId = itemElement.dataset.itemId;
  const item =
    originalCharacterTalents.startTalents.find((item) => item.id === itemId) ||
    originalCharacterTalents.talents.find((item) => item.id === itemId) ||
    originalCharacterTalents.ultimates.find((item) => item.id === itemId) ||
    originalCharacterTalents.ultimateTalents.find(
      (item) => item.id === itemId
    ) ||
    originalMagicalObjects.find((item) => item.id === itemId);
  const name = item ? item.name : "Unknown Item";
  let description = item ? item.description : "Description not found";

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
  tooltip.innerHTML = `<strong style="font-size: 1.2em;">${name}</strong>`;

  // magicalObject의 경우 rarity와 setEffect 추가
  if (originalMagicalObjects.find((item) => item.id === itemId)) {
    const rarity =
      {
        COMMON: "일반",
        RARE: "희귀",
        EPIC: "서사",
        LEGENDARY: "전설",
        CURSED: "저주받음",
      }[item.rarity] || "Unknown";
    const rarityColor =
      {
        COMMON: "#fff",
        RARE: "#88f",
        EPIC: "#d8bfd8",
        LEGENDARY: "#ff0",
        CURSED: "#f00",
      }[item.rarity] || "#fff";
    tooltip.innerHTML += ` <span class="inline-box" style="color: ${rarityColor}; border-color: ${rarityColor}">${rarity}</span>`;
  }

  tooltip.innerHTML += `<br>${description}`;

  if (originalMagicalObjects.find((item) => item.id === itemId)) {
    const rarity = item.rarity;
    if (["COMMON", "RARE", "EPIC"].includes(rarity)) {
      const set = item.set;
      const setEffect = item.setEffect;
      const selectedCount = selectedTalents.magicalObjects.filter(
        (obj) => obj.id === itemId
      ).length;
      const setColor = selectedCount >= set ? "#ff0" : "#888";

      tooltip.innerHTML += `<br><span class="inline-box">x${set}</span> <span style="color: ${setColor};">${setEffect}</span>`;
    }
  }

  tooltip.classList.add("show"); // show 클래스 추가
  const rect = itemElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const isOverflowingRight =
    rect.right + tooltipRect.width + 5 > window.innerWidth;

  if (isOverflowingRight) {
    tooltip.style.left = rect.left - tooltipRect.width - 5 + "px";
  } else {
    tooltip.style.left = rect.right + 5 + "px";
  }
  tooltip.style.top = rect.top + "px";
  tooltip.style.transform = "translateY(-5px)"; // 위치 변경 애니메이션

  clearTimeout(tooltipTimer); // 이전 타이머 제거
  tooltipTimer = null;
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.classList.remove("show");
  tooltip.style.transform = "translateY(0)"; // 위치 초기화
}

// 닫기 버튼 클릭 이벤트 처리
closeButton.addEventListener("click", () => {
  loadPopup.style.display = "none";
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


}
