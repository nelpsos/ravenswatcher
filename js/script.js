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

const rarityColors = ["#fff", "#88f", "#d8bfd8", "#ff0"];
const stackableRarities = ["COMMON", "RARE", "EPIC"];

let originalCharacterTalents = null;
let originalMagicalObjects = null;
let selectedTalents = {
  characterId: "",
  startTalents: [],
  talents: [],
  ultimates: [],
  ultimateTalents: [],
  magicalObjects: [],
};
let selectedCharacter = null;

let tooltipTimer = null;
let saveNoticeTimer = null;

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
const darkModeToggle = document.getElementById("dark-mode-toggle");
const darkModeToggleIcon = document.getElementById("dark-mode-toggle-icon");
const saveNotice = document.getElementById("save-notice");
const loadButton = document.getElementById("load-button");
const backButton = document.getElementById("back-button");
const loadList = document.getElementById("load-list");
const mask = document.getElementById("mask");
const shareButton = document.getElementById("share-button");
const sharePopup = document.getElementById("share-popup");
const shareText = document.getElementById("share-text");
const copyShareTextButton = document.getElementById("copy-share-text");
const shareUri = document.getElementById("share-uri");
const copyShareUriButton = document.getElementById("copy-share-uri");
const closeSharePopupButton = document.getElementById("close-share-popup");

document.addEventListener("DOMContentLoaded", DOMContentLoadedHandler);
characters.forEach(createCharacterImage);
handleRouteChange();
window.addEventListener("popstate", popstateHandler);

darkModeToggle.addEventListener("click", darkModeToggleClickHandler);
headerLogo.addEventListener("click", headerLogoClickHandler);
mainPage.addEventListener("click", mainPageClickHandler);
detailPage.addEventListener("click", detailPageClickHandler);
closeButton.addEventListener("click", hideLoadPopup);
mask.addEventListener("click", hideLoadPopup);
mask.addEventListener("click", hideSharePopup);
loadButton.addEventListener("click", initializeLoadPopup);
backButton.addEventListener("click", backButtonClickHandler);
loadList.addEventListener("click", loadListClickHandler);
saveButton.addEventListener("click", saveButtonClickHandler);
shareButton.addEventListener("click", shareButtonClickHandler);
copyShareTextButton.addEventListener("click", copyShareText);
copyShareUriButton.addEventListener("click", copyShareUri);
closeSharePopupButton.addEventListener("click", hideSharePopup);

function DOMContentLoadedHandler() {
  const savedColorTheme = getUserColorTheme();
  applyColorTheme(savedColorTheme);
}

function darkModeToggleClickHandler() {
  const currentColorTheme =
    document.documentElement.getAttribute("color-theme");
  const changedColorTheme =
    currentColorTheme === COLOR_THEME.DARK.name
      ? COLOR_THEME.LIGHT
      : COLOR_THEME.DARK;

  applyColorTheme(changedColorTheme.name);
  localStorage.setItem("color-theme", changedColorTheme.name);
}

function headerLogoClickHandler(event) {
  event.preventDefault();
  navigateTo("/");
}

function popstateHandler() {
  handleRouteChange();
  hideTooltip();
}

function mainPageClickHandler(event) {
  // 캐릭터 버튼 클릭 이벤트 처리 (navigateTo() 사용)
  if (event.target.classList.contains("character-image")) {
    const characterId = event.target.dataset.character;
    showPage("detail", characterId);
    navigateTo(`/characters/${characterId}`);
  }
}

function detailPageClickHandler(event) {
  if (event.target.closest(".disabled")) return;

  const item = event.target.closest(".item");
  if (!item) return;
  
  const itemBlock = item.parentElement;
  const row = itemBlock.parentElement?.parentElement?.dataset?.row;
  if (!row) return;

  if (row === "4") {
    if (itemBlock.parentElement.classList.contains("right-col")) {
      magicalObjectMoveRightToLeft(item);
    } else {
      magicalObjectMoveLeftToRight(item);
    }
  } else {
    if (itemBlock.parentElement.classList.contains("right-col")) {
      if (row === "2") {
        const ultimateTalentsItems = document.querySelectorAll(
          "#ultimate-talents-row .right-col .item"
        );
        ultimateTalentsItems.forEach(moveRightToLeft);
      }
      moveRightToLeft(item);
    } else {
      moveLeftToRight(item);
    }

    if (row === "2") {
      updateUltimateTalentsState();
    }
  }
}

function loadListClickHandler(event) {
  const deleteButton = event.target.closest(".delete-load-item");
  if (deleteButton) {
    const buildName = deleteButton.dataset.buildName;
    const loadItem = deleteButton.previousElementSibling;
    loadItem.textContent = "정말 삭제하시겠습니까?";
    loadItem.classList.add("deleting");
    deleteButton.style.display = "none";

    const confirmDeleteButton = document.createElement("fancy-button");
    const checkButton = document.createElement("span");
    checkButton.textContent = "✔";
    checkButton.setAttribute("slot", "text");
    confirmDeleteButton.appendChild(checkButton);
    confirmDeleteButton.classList.add("confirm-delete-load-item");
    confirmDeleteButton.dataset.buildName = buildName;
    confirmDeleteButton.setAttribute("variant", "icon");
    confirmDeleteButton.setAttribute("background-color", "red");

    const cancelDeleteButton = document.createElement("fancy-button");
    const xButton = document.createElement("span");
    xButton.textContent = "✖";
    xButton.setAttribute("slot", "text");
    cancelDeleteButton.appendChild(xButton);
    cancelDeleteButton.classList.add("cancel-delete-load-item");
    cancelDeleteButton.setAttribute("variant", "icon");
    cancelDeleteButton.setAttribute("background-color", "blue");

    deleteButton.parentElement.appendChild(confirmDeleteButton);
    deleteButton.parentElement.appendChild(cancelDeleteButton);

    return;
  }

  const confirmDeleteLoadItem = event.target.closest(
    ".confirm-delete-load-item"
  );
  if (confirmDeleteLoadItem) {
    const buildName = confirmDeleteLoadItem.dataset.buildName;
    let savedBuildList =
      JSON.parse(localStorage.getItem("savedBuildList")) || [];
    savedBuildList = savedBuildList.filter(
      (build) =>
        build.name !== buildName || build.character !== selectedCharacter.id
    );
    localStorage.setItem("savedBuildList", JSON.stringify(savedBuildList));
    initializeLoadPopup();
    return;
  }

  const cancelDeleteLoadItem = event.target.closest(".cancel-delete-load-item");
  if (cancelDeleteLoadItem) {
    const loadItem =
      cancelDeleteLoadItem.parentElement.querySelector(".load-item");
    loadItem.textContent = loadItem.dataset.buildName;
    loadItem.classList.remove("deleting");

    const deleteButton =
      cancelDeleteLoadItem.parentElement.querySelector(".delete-load-item");
    deleteButton.style.display = "inline";

    cancelDeleteLoadItem.parentElement
      .querySelector(".confirm-delete-load-item")
      .remove();
    cancelDeleteLoadItem.remove();
    return;
  }

  const loadItem = event.target.closest(".load-item");
  if (loadItem) {
    const buildName = event.target.textContent;
    const savedBuildList =
      JSON.parse(localStorage.getItem("savedBuildList")) || [];
    const selectedBuild = savedBuildList.find(
      (build) =>
        build.name === buildName && build.character === selectedCharacter.id
    );

    if (!selectedBuild) {
      return;
    }

    selectedTalents = selectedBuild.selectedTalents;
    applySelectedTalents();
    hideLoadPopup();
    showSaveNotice(`'${buildName}' 불러오기가 완료되었습니다.`);
    return;
  }
}

function saveButtonClickHandler() {
  const buildName = document.getElementById("build-name").value.trim();
  if (!buildName) {
    showSaveNotice("빌드 이름을 입력하세요.");
    return;
  }
  if (buildName.length > 20) {
    showSaveNotice("빌드 이름은 20자까지 작성 가능합니다.");
    return;
  }

  let savedBuildList = JSON.parse(localStorage.getItem("savedBuildList")) || [];
  const existingBuild = savedBuildList.find(
    (build) =>
      build.name === buildName && build.character === selectedCharacter.id
  );

  if (existingBuild) {
    if (saveNotice.textContent.includes("덮어쓰시겠습니까?")) {
      showSaveNotice(`'${buildName}' 저장이 완료되었습니다.`);
      saveBuild(buildName, savedBuildList);
    } else {
      showSaveNotice(`${buildName}은 이미 있는 빌드입니다. 덮어쓰시겠습니까?`);
    }
  } else {
    showSaveNotice(`'${buildName}' 저장이 완료되었습니다.`);
    saveBuild(buildName, savedBuildList);
  }
}

function getUserColorTheme() {
  const savedColorTheme = localStorage.getItem("color-theme");
  if (savedColorTheme) return savedColorTheme;
  const osColorTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? COLOR_THEME.DARK.name
    : COLOR_THEME.LIGHT.name;
  return osColorTheme;
}

function applyColorTheme(theme) {
  document.documentElement.setAttribute("color-theme", theme);
  darkModeToggleIcon.textContent = theme === COLOR_THEME.DARK.name ? "☾" : "✵";
}

function createCharacterImage(character) {
  const img = document.createElement("img");
  img.id = character.id;
  img.classList.add("character-image");
  img.setAttribute("data-character", character.id);
  img.setAttribute("src", `assets/${character.id}/portrait.webp`);
  img.setAttribute("alt", character.name);
  characterButtonsContainer.appendChild(img);
}

function showPage(pageId, characterId) {
  if (pageId === "main") {
    mainPage.style.display = "block";
    detailPage.style.display = "none";

    // 메인 페이지로 돌아올 때 캐릭터 이미지를 다시 로드
    characterButtonsContainer.innerHTML = "";
    characters.forEach((character) => {
      createCharacterImage(character);
    });
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
    const character = characters.find((char) => char.id === characterId);
    if (character) {
      characterName.textContent = character.name;
      selectedCharacter = character;
    }

    characterImage.setAttribute("data-character", characterId);
    characterImage.setAttribute("src", `/assets/${characterId}/icon.png`);
    characterImage.setAttribute("alt", character.name);

    initializeTalents();
    initializePlaceholders();
    selectedTalents = { ...initialTalents, characterId };

    addTooltipEventListeners();
    updateUltimateTalentsState();

    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get("share");

    if (shareData) {
      selectedTalents = JSON.parse(decodeURIComponent(atob(shareData)));
      applySelectedTalents();
    }
  } catch (error) {
    console.error("Error fetching talents:", error);
  }
}

function initializeTalents() {
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
}

function initializePlaceholders() {
  // 오른쪽 열의 아이템 초기화
  const rightCols = document.querySelectorAll("#detail-page .right-col");
  rightCols.forEach((col) => (col.innerHTML = ""));

  const rows = document.querySelectorAll("#detail-page table tr");
  const placeholdersCount = [1, 7, 1, 1, 53]; // 각 줄에 필요한 placeholder 개수

  rows.forEach((row, index) => {
    const rightCol = row.querySelector(".right-col");
    const count = placeholdersCount[index];
    rightCol.innerHTML = null;

    for (let i = 0; i < count; i++) {
      rightCol.appendChild(createPlaceholder());
    }
  });
}

function createPlaceholder() {
  const placeholder = document.createElement("div");
  placeholder.classList.add("item-block");
  placeholder.dataset.itemId = "";

  const placeholderInner = document.createElement("div");
  placeholderInner.classList.add("placeholder");
  placeholder.appendChild(placeholderInner);

  return placeholder;
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
    const itemBlock = createItemBlock(
      itemId,
      itemName,
      itemIcon,
      selectedCharacter.id
    );
    if (
      itemBlock.parentElement &&
      itemBlock.parentElement.id === "ultimate-talents"
    ) {
      itemBlock.classList.add("disabled");
    }
    return itemBlock.outerHTML;
  } catch (error) {
    console.error("Error making item block:", error);
  }
}

function makeObjectItemBlock(itemObject) {
  try {
    const { id: itemId, name: itemName, icon: itemIcon } = itemObject;
    const itemBlock = createItemBlock(
      itemId,
      itemName,
      itemIcon,
      "magical_objects"
    );
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

function createItemBlock(itemId, itemName, itemIcon, characterId) {
  const itemBlock = document.createElement("div");
  const item = document.createElement("div");
  const img = document.createElement("img");

  itemBlock.classList.add("item-block");
  itemBlock.dataset.itemId = itemId;

  item.classList.add("item");
  item.dataset.itemId = itemId;
  img.src = `/assets/${characterId}/${itemIcon}`;
  img.alt = itemName;
  img.classList.add("item-icon");

  item.appendChild(img);
  itemBlock.appendChild(item);

  return itemBlock;
}

function magicalObjectMoveLeftToRight(item) {
  const itemBlock = item.parentElement;
  const itemData = originalMagicalObjects.find(
    (obj) => obj.id === itemBlock.dataset.itemId
  );

  if (!stackableRarities.includes(itemData?.rarity)) {
    return moveLeftToRight(item);
  }

  const rowElement = itemBlock.parentElement.parentElement;
  const rightCol = rowElement.querySelector(".right-col");
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
    newItemBlock.addEventListener("mouseover", showTooltip);
    newItemBlock.addEventListener("mouseout", hideTooltip);
  }

  syncSelectedData();

  if (existingItemBlock) {
    const tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = makeTooltipInnerHTML(itemData);
  }
  return true;
}

function magicalObjectMoveRightToLeft(item) {
  const itemBlock = item.parentElement;

  const itemData = originalMagicalObjects.find(
    (obj) => obj.id === itemBlock.dataset.itemId
  );

  if (!stackableRarities.includes(itemData.rarity)) {
    return moveRightToLeft(item);
  }

  // 오른쪽 열의 아이템 클릭 시 개수 감소
  const countSpan = itemBlock.querySelector(".item-count");
  let count = parseInt(countSpan.textContent);
  countSpan.textContent = --count;

  if (count === 0) {
    // 개수가 0이 되면 아이템 블록 제거하고 placeholder 추가
    const placeholder = createPlaceholder();
    itemBlock.replaceWith(placeholder);
    hideTooltip();
  }

  syncSelectedData();

  if (count !== 0) {
    const tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = makeTooltipInnerHTML(itemData);
  }

  return true;
}

function moveRightToLeft(item) {
  const itemBlock = item.parentElement;
  const rowElement = itemBlock.parentElement.parentElement;
  const leftCol = rowElement.querySelector(".left-col");
  const originalItemBlock = leftCol.querySelector(
    `[data-item-id="${item.dataset.itemId}"]`
  );

  if (!originalItemBlock) {
    return false;
  }

  const placeholder = originalItemBlock.querySelector(".placeholder");
  if (placeholder) {
    placeholder.replaceWith(item);
    itemBlock.appendChild(placeholder);
  } else {
    originalItemBlock.appendChild(item);
  }

  hideTooltip();
  syncSelectedData();
  return true;
}

function moveLeftToRight(item) {
  const itemBlock = item.parentElement;
  const rowElement = itemBlock.parentElement.parentElement;
  const rightCol = rowElement.querySelector(".right-col");
  const placeholder = rightCol.querySelector(".placeholder");

  if (!placeholder) {
    return false;
  }

  placeholder.parentElement.dataset.itemId = item.dataset.itemId;
  placeholder.replaceWith(item);
  itemBlock.appendChild(placeholder);
  hideTooltip();
  syncSelectedData();
  return true;
}

function syncSelectedData() {
  const newTalents = {
    characterId: selectedCharacter.id,
    startTalents: [],
    talents: [],
    ultimates: [],
    ultimateTalents: [],
    magicalObjects: [],
  };

  const rows = document.querySelectorAll("#detail-page table tr");
  rows.forEach((row) => {
    const rightCol = row.querySelector(".right-col");
    const itemBlocks = rightCol.querySelectorAll(
      ".item-block:not(.placeholder)"
    );

    itemBlocks.forEach((itemBlock) => {
      const itemId = itemBlock.dataset.itemId;
      const item = itemBlock.querySelector(".item");

      if (item) {
        const itemType = row.dataset.row;
        switch (itemType) {
          case "0":
            newTalents.startTalents.push({ id: itemId });
            break;
          case "1":
            newTalents.talents.push({ id: itemId });
            break;
          case "2":
            newTalents.ultimates.push({ id: itemId });
            break;
          case "3":
            newTalents.ultimateTalents.push({ id: itemId });
            break;
          case "4":
            const countSpan = itemBlock.querySelector(".item-count");
            const count = countSpan ? parseInt(countSpan.textContent) : 1;
            const existingObject = newTalents.magicalObjects.find(
              (obj) => obj.id === itemId
            );
            if (existingObject) {
              existingObject.count += count;
            } else {
              newTalents.magicalObjects.push({ id: itemId, count });
            }
            break;
        }
      }
    });

    selectedTalents = newTalents;
  });
}

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
  const tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = makeTooltipInnerHTML(item);

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
  tooltip.style.top = rect.top + window.scrollY + "px"; // 스크롤 위치 반영
  tooltip.style.transform = "translateY(-5px)";

  clearTimeout(tooltipTimer);
  tooltipTimer = null;
}

function makeTooltipInnerHTML(item) {
  const itemId = item.id;
  const itemName = item ? item.name : "Unknown Item";
  let itemDescription = item ? item.description : "Description not found";
  let innerHTML = `<strong style="font-size: 1.2em;">${itemName}</strong>`;

  if (item && item.rarityValue) {
    item.rarityValue.forEach((values, index) => {
      const coloredValues = values
        .map((value, i) => {
          return `<span style="color: ${rarityColors[i]}">${value}</span>`;
        })
        .join("/");
      itemDescription = itemDescription.replace(`{${index}}`, coloredValues);
    });
  }

  // magicalObject의 경우 rarity와 setEffect 추가
  if (originalMagicalObjects.find((i) => i.id === itemId)) {
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
    innerHTML += ` <span class="inline-box" style="color: ${rarityColor}; border-color: ${rarityColor}">${rarity}</span>`;
  }

  innerHTML += `<br>${itemDescription}`;

  if (originalMagicalObjects.find((i) => i.id === itemId)) {
    const rarity = item.rarity;
    if (["COMMON", "RARE", "EPIC"].includes(rarity)) {
      const set = item.set;
      const setEffect = item.setEffect;
      const selectedCount = selectedTalents.magicalObjects.filter(
        (obj) => obj.id === itemId
      ).length;
      const setColor = selectedCount >= set ? "#ff0" : "#888";

      innerHTML += `<br><span class="inline-box">x${set}</span> <span style="color: ${setColor};">${setEffect}</span>`;
    }
  }

  return innerHTML;
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.classList.remove("show");
  tooltip.style.transform = "translateY(0)";
}

function hideLoadPopup() {
  loadPopup.classList.remove("show");
  mask.classList.remove("show");
  setTimeout(() => {
    loadPopup.style.display = "none";
    mask.style.display = "none";
  }, 200); // transition duration과 동일하게 설정
}

function initializeLoadPopup() {
  loadPopup.style.display = "block";
  mask.style.display = "block";

  setTimeout(() => {
    loadPopup.classList.add("show");
    mask.classList.add("show");
  }, 10);

  const savedBuildList =
    JSON.parse(localStorage.getItem("savedBuildList")) || [];
  const filteredBuildList = savedBuildList.filter(
    (build) => build.character === selectedCharacter.id
  );

  if (filteredBuildList.length === 0) {
    loadList.innerHTML =
      '<p style="text-align: center">저장된 빌드가 없습니다.</p>';
  } else {
    loadList.innerHTML = filteredBuildList
      .map(
        (build) => `
          <div class="load-item-container">
            <p class="load-item" data-build-name="${build.name}">${build.name}</p>
            <fancy-button variant="icon" background-color="red" class="delete-load-item" data-build-name="${build.name}">
              <span slot="text"><img src="/assets/delete.svg"/></slot>
            </fancy-button>
          </div>
        `
      )
      .join("");
  }
}

function backButtonClickHandler() {
  detailPage.style.display = "none";
  mainPage.style.display = "block";
  navigateTo("/");
}

function updateUltimateTalentsState() {
  const selectedUltimate = selectedTalents.ultimates[0];
  const ultimateTalentsItems = document.querySelectorAll(
    "#ultimate-talents .item-block"
  );

  ultimateTalentsItems.forEach((itemBlock) => {
    const itemId = itemBlock.dataset.itemId;
    if (!selectedUltimate) {
      itemBlock.classList.add("disabled");
    } else {
      if (itemId.startsWith(selectedUltimate.id)) {
        itemBlock.classList.remove("disabled");
      } else {
        itemBlock.classList.add("disabled");
      }
    }
  });
}

function showSaveNotice(message) {
  clearTimeout(saveNoticeTimer);
  saveNotice.textContent = message;
  saveNotice.classList.remove("transparent");
  saveNoticeTimer = setTimeout(() => {
    saveNotice.classList.add("transparent");
  }, 3000);
}

function saveBuild(buildName, savedBuildList) {
  const newBuild = {
    name: buildName,
    character: selectedCharacter.id,
    selectedTalents,
  };
  savedBuildList = savedBuildList.filter(
    (build) =>
      build.name !== buildName || build.character !== selectedCharacter.id
  );
  savedBuildList.push(newBuild);
  localStorage.setItem("savedBuildList", JSON.stringify(savedBuildList));
}

function applySelectedTalents() {
  // 선택된 talents를 페이지에 반영하는 로직
  const { startTalents, talents, ultimates, ultimateTalents, magicalObjects } =
    selectedTalents;

  // 각 섹션을 초기화
  initializeTalents();
  initializePlaceholders();
  addTooltipEventListeners();

  // startTalents 반영
  startTalents.forEach((talent) => {
    const item = document.querySelector(
      `#start-talents [data-item-id="${talent.id}"] .item`
    );
    if (item) moveLeftToRight(item);
  });

  // talents 반영
  talents.forEach((talent) => {
    const item = document.querySelector(
      `#talents [data-item-id="${talent.id}"] .item`
    );
    if (item) moveLeftToRight(item);
  });

  // ultimates 반영
  ultimates.forEach((talent) => {
    const item = document.querySelector(
      `#ultimates [data-item-id="${talent.id}"] .item`
    );
    if (item) moveLeftToRight(item);
  });

  // ultimateTalents 반영
  ultimateTalents.forEach((talent) => {
    const item = document.querySelector(
      `#ultimate-talents [data-item-id="${talent.id}"] .item`
    );
    if (item) moveLeftToRight(item);
  });

  // magicalObjects 반영
  magicalObjects.forEach((object) => {
    for (let i = 0; i < object.count; i++) {
      const item = document.querySelector(
        `#magical-objects [data-item-id="${object.id}"] .item`
      );
      if (item) magicalObjectMoveLeftToRight(item);
    }
  });

  updateUltimateTalentsState();
}

function formatJsonToReadableText(json) {
  const talentFinder = (category) => (talent) =>
    originalCharacterTalents[category].find((origin) => origin.id === talent.id)
      ?.name || "";

  const magicalObjectFinder = (object) => {
    const result = originalMagicalObjects.find(
      (origin) => origin.id === object.id
    );
    if (!result) return "";
    if (object.count === 1) return result.name;
    return `${result.name}(${object.count})`;
  };

  const characterName =
    characters.find((char) => char.id === json.characterId)?.name ||
    "Unknown Character";

  const startTalents =
    json.startTalents
      .map(talentFinder("startTalents"))
      .filter((item) => item !== "")
      .join(", ") || "None";
  const talents =
    json.talents
      .map(talentFinder("talents"))
      .filter((item) => item !== "")
      .join(", ") || "None";
  const ultimates =
    json.ultimates
      .map(talentFinder("ultimates"))
      .filter((item) => item !== "")
      .join(", ") || "None";
  const ultimateTalents =
    json.ultimateTalents
      .map(talentFinder("ultimateTalents"))
      .filter((item) => item !== "")
      .join(", ") || "None";
  const magicalObjects =
    json.magicalObjects
      .map(magicalObjectFinder)
      .filter((item) => item !== "")
      .join(", ") || "None";

  return `캐릭터명: ${characterName}\n시작 특성: ${startTalents}\n특성: ${talents}\n궁극기: ${ultimates}\n궁극기 특성: ${ultimateTalents}\n마법 물체: ${magicalObjects}`;
}

function shareButtonClickHandler() {
  const shareData = formatJsonToReadableText(selectedTalents);
  shareText.value = shareData;

  const shareUriData = JSON.stringify(selectedTalents);
  const encodedShareUri = encodeURIComponent(btoa(shareUriData));
  const shareUriString = `${window.location}?share=${encodedShareUri}`;
  shareUri.value = shareUriString;

  showSharePopup();
}

function copyShareText() {
  shareText.select();
  window.navigator.clipboard.writeText(shareText.value);
  alert("텍스트가 복사되었습니다.");
}

function copyShareUri() {
  shareUri.select();
  window.navigator.clipboard.writeText(shareUri.value);
  alert("URI가 복사되었습니다.");
}

function hideSharePopup() {
  sharePopup.classList.remove("show");
  mask.classList.remove("show");
  setTimeout(() => {
    loadPopup.style.display = "none";
    mask.style.display = "none";
  }, 200);
}

function showSharePopup() {
  sharePopup.style.display = "block";
  mask.style.display = "block";

  setTimeout(() => {
    sharePopup.classList.add("show");
    mask.classList.add("show");
  }, 10);
}
