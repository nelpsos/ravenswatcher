const characters = [
  { id: "scarlet", name: "스칼렛", name_en: "Scarlet" },
  {
    id: "the_piped_piper",
    name: "피리 부는 사나이",
    name_en: "The Pied Piper",
  },
  { id: "beowulf", name: "베오울프", name_en: "Beowulf" },
  { id: "the_snow_queen", name: "눈의 여왕", name_en: "The Snow Queen" },
  { id: "aladdin", name: "알라딘", name_en: "Aladdin" },
  { id: "melusine", name: "멜루신", name_en: "Melusine" },
  { id: "geppetto", name: "제페토", name_en: "Geppetto" },
  { id: "wukong", name: "손오공", name_en: "Sun Wukong" },
  { id: "carmilla", name: "카르밀라", name_en: "Carmilla" },
  { id: "romeo", name: "로미오", name_en: "Romeo" },
  { id: "juliet", name: "줄리엣", name_en: "Juliet" },
  { id: "merlin", name: "멀린", name_en: "Merlin" },
  { id: "kintaro", name: "킨타로", name_en: "Kintarō" },
];

const I18N = {
  ko: {
    buildNamePlaceholder: "빌드 이름",
    loadTitle: "빌드 불러오기",
    shareTitle: "공유",
    close: "닫기",
    back: "돌아가기",
    noSavedBuilds: "저장된 빌드가 없습니다.",
    confirmDelete: "정말 삭제하시겠습니까?",
    enterBuildName: "빌드 이름을 입력하세요.",
    buildNameMaxLength: "빌드 이름은 20자까지 작성 가능합니다.",
    overwriteConfirm: (name) => `${name}은 이미 있는 빌드입니다. 덮어쓰시겠습니까?`,
    overwriteKeyword: "덮어쓰시겠습니까?",
    saveComplete: (name) => `'${name}' 저장이 완료되었습니다.`,
    loadComplete: (name) => `'${name}' 불러오기가 완료되었습니다.`,
    rarityLabel: "등급 수치",
    rarityAll: "전체",
    rarities: {
      COMMON: "일반",
      RARE: "희귀",
      EPIC: "서사",
      LEGENDARY: "전설",
      CURSED: "저주받음",
    },
    abilityLabel: "능력 하이라이트",
    abilityClear: "해제",
    abilities: {
      attack: "공격",
      power: "파워",
      special: "특수",
      defense: "방어",
      trait: "고유 능력",
      dash: "돌진",
      ultimate: "궁극기",
    },
    notes: (n) => `음표 ${n}`,
    shareHeaders: {
      character: "캐릭터",
      startTalents: "시작 특성",
      talents: "특성",
      ultimates: "궁극기",
      ultimateTalents: "궁극기 특성",
      melodies: "멜로디",
      magicalObjects: "마법 물체",
    },
  },
  en: {
    buildNamePlaceholder: "Build Name",
    loadTitle: "Load Build",
    shareTitle: "Share",
    close: "Close",
    back: "Back",
    noSavedBuilds: "No saved builds.",
    confirmDelete: "Delete this build?",
    enterBuildName: "Please enter a build name.",
    buildNameMaxLength: "Build name can be up to 20 characters.",
    overwriteConfirm: (name) => `'${name}' already exists. Overwrite?`,
    overwriteKeyword: "Overwrite?",
    saveComplete: (name) => `'${name}' saved.`,
    loadComplete: (name) => `'${name}' loaded.`,
    rarityLabel: "Rarity Values",
    rarityAll: "All",
    rarities: {
      COMMON: "Common",
      RARE: "Rare",
      EPIC: "Epic",
      LEGENDARY: "Legendary",
      CURSED: "Cursed",
    },
    abilityLabel: "Highlight",
    abilityClear: "Clear",
    abilities: {
      attack: "Attack",
      power: "Power",
      special: "Special",
      defense: "Defense",
      trait: "Trait",
      dash: "Dash",
      ultimate: "Ultimate",
    },
    notes: (n) => `Notes ${n}`,
    shareHeaders: {
      character: "Character",
      startTalents: "Starting Talent",
      talents: "Talents",
      ultimates: "Ultimate",
      ultimateTalents: "Ultimate Talent",
      melodies: "Melodies",
      magicalObjects: "Magical Objects",
    },
  },
};

const initialTalents = {
  startTalents: [],
  talents: [],
  ultimates: [],
  ultimateTalents: [],
  melodies: [],
  magicalObjects: [],
};

const COLOR_THEME = {
  DARK: { name: "dark", icon: "☾" },
  LIGHT: { name: "light", icon: "✵" },
};

const rarityColors = ["#fff", "#88f", "#d8bfd8", "#ff0"];
const stackableRarities = ["COMMON", "RARE", "EPIC"];

let currentLang = getUserLanguage();
let selectedRarityIndex = "all";
const selectedAbilityTags = new Set();

let originalCharacterTalents = null;
let originalMagicalObjects = null;
let originalMelodies = null;
let selectedTalents = {
  characterId: "",
  startTalents: [],
  talents: [],
  ultimates: [],
  ultimateTalents: [],
  melodies: [],
  magicalObjects: [],
};
let selectedCharacter = null;

let tooltipTimer = null;
let saveNoticeTimer = null;

let lastTouchedItem = null;

const characterName = document.getElementById("character-name");
const characterImage = document.getElementById("character-image");
const characterButtonsContainer = document.getElementById("character-buttons");
const startTalents = document.getElementById("start-talents");
const talents = document.getElementById("talents");
const ultimates = document.getElementById("ultimates");
const ultimateTalents = document.getElementById("ultimate-talents");
const melodies = document.getElementById("melodies");
const magicalObjects = document.getElementById("magical-objects");
const mainPage = document.getElementById("main-page");
const detailPage = document.getElementById("detail-page");
const saveButton = document.getElementById("save-button");
const loadPopup = document.getElementById("load-popup");
const closeButton = document.getElementById("close-button");
const headerLogo = document.getElementById("header-logo");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const darkModeToggleIcon = document.getElementById("dark-mode-toggle-icon");
const langToggle = document.getElementById("lang-toggle");
const langToggleIcon = document.getElementById("lang-toggle-icon");
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
const rarityFilterButtons = document.getElementById("rarity-filter-buttons");
const abilityFilterButtons = document.getElementById("ability-filter-buttons");
const abilityClearButton = document.getElementById("ability-btn-clear");

document.addEventListener("DOMContentLoaded", DOMContentLoadedHandler);
characters.forEach(createCharacterImage);
applyLanguage(currentLang);
handleRouteChange();
window.addEventListener("popstate", popstateHandler);

darkModeToggle.addEventListener("click", darkModeToggleClickHandler);
langToggle.addEventListener("click", langToggleClickHandler);
rarityFilterButtons.addEventListener("click", rarityFilterClickHandler);
abilityFilterButtons.addEventListener("click", abilityFilterClickHandler);
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

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, maxAgeSeconds = 31536000) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function getUserLanguage() {
  const cookieLang = getCookie("lang");
  if (cookieLang === "ko" || cookieLang === "en") return cookieLang;
  const storedLang = localStorage.getItem("lang");
  if (storedLang === "ko" || storedLang === "en") return storedLang;
  return "ko";
}

function getLocalizedName(item) {
  if (!item) return "";
  return currentLang === "en" && item.name_en ? item.name_en : item.name;
}

function getLocalizedDescription(item) {
  if (!item) return "";
  if (currentLang === "en") {
    return item.description_en || item.effect_en || item.description || item.effect || "";
  }
  return item.description || item.effect || "";
}

function getLocalizedSetEffect(item) {
  if (!item) return "";
  return currentLang === "en" && item.setEffect_en ? item.setEffect_en : item.setEffect;
}

function langToggleClickHandler() {
  currentLang = currentLang === "ko" ? "en" : "ko";
  setCookie("lang", currentLang);
  localStorage.setItem("lang", currentLang);
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  const t = I18N[lang] || I18N.ko;
  document.documentElement.setAttribute("lang", lang);
  if (langToggleIcon) {
    langToggleIcon.textContent = lang.toUpperCase();
  }

  const buildNameInput = document.getElementById("build-name");
  if (buildNameInput) buildNameInput.placeholder = t.buildNamePlaceholder;

  const loadTitle = document.getElementById("load-title");
  if (loadTitle) loadTitle.textContent = t.loadTitle;

  const shareTitle = document.getElementById("share-title");
  if (shareTitle) shareTitle.textContent = t.shareTitle;

  const closeBtnText = document.getElementById("close-button-text");
  if (closeBtnText) closeBtnText.textContent = t.close;

  const closeShareBtnText = document.getElementById("close-share-button-text");
  if (closeShareBtnText) closeShareBtnText.textContent = t.close;

  const backBtnText = document.getElementById("back-button-text");
  if (backBtnText) backBtnText.textContent = t.back;

  const rarityFilterLabel = document.getElementById("rarity-filter-label");
  if (rarityFilterLabel) rarityFilterLabel.textContent = t.rarityLabel;

  const rarityBtnAll = document.getElementById("rarity-btn-all");
  if (rarityBtnAll) rarityBtnAll.textContent = t.rarityAll;
  const rarityBtn0 = document.getElementById("rarity-btn-0");
  if (rarityBtn0) rarityBtn0.textContent = t.rarities.COMMON;
  const rarityBtn1 = document.getElementById("rarity-btn-1");
  if (rarityBtn1) rarityBtn1.textContent = t.rarities.RARE;
  const rarityBtn2 = document.getElementById("rarity-btn-2");
  if (rarityBtn2) rarityBtn2.textContent = t.rarities.EPIC;
  const rarityBtn3 = document.getElementById("rarity-btn-3");
  if (rarityBtn3) rarityBtn3.textContent = t.rarities.LEGENDARY;

  const abilityFilterLabel = document.getElementById("ability-filter-label");
  if (abilityFilterLabel) abilityFilterLabel.textContent = t.abilityLabel;

  Object.entries(t.abilities).forEach(([tag, label]) => {
    const btn = document.getElementById(`ability-btn-${tag}`);
    if (btn) btn.textContent = label;
  });

  if (abilityClearButton) {
    abilityClearButton.textContent = t.abilityClear;
  }

  if (selectedCharacter) {
    characterName.textContent = getLocalizedName(selectedCharacter);
    characterImage.setAttribute("alt", getLocalizedName(selectedCharacter));
  }

  document.querySelectorAll(".character-portrait").forEach((img) => {
    const charObj = characters.find((c) => c.id === img.dataset.character);
    if (charObj) {
      img.setAttribute("alt", getLocalizedName(charObj));
    }
  });

  if (sharePopup && sharePopup.classList.contains("show") && originalCharacterTalents) {
    shareText.value = formatJsonToReadableText(selectedTalents);
  }
}

function rarityFilterClickHandler(event) {
  const btn = event.target.closest(".rarity-btn");
  if (!btn) return;
  selectedRarityIndex = btn.dataset.rarityIdx;
  rarityFilterButtons.querySelectorAll(".rarity-btn").forEach((b) => {
    b.classList.toggle("active", b === btn);
  });
}

function abilityFilterClickHandler(event) {
  const clearBtn = event.target.closest("#ability-btn-clear");
  if (clearBtn) {
    selectedAbilityTags.clear();
    abilityFilterButtons.querySelectorAll(".ability-btn").forEach((b) => {
      b.classList.remove("active");
    });
    updateAbilityHighlight();
    return;
  }

  const btn = event.target.closest(".ability-btn");
  if (!btn) return;
  const tag = btn.dataset.abilityTag;
  if (selectedAbilityTags.has(tag)) {
    selectedAbilityTags.delete(tag);
    btn.classList.remove("active");
  } else {
    selectedAbilityTags.add(tag);
    btn.classList.add("active");
  }
  updateAbilityHighlight();
}

function updateAbilityHighlight() {
  if (abilityClearButton) {
    abilityClearButton.style.display = selectedAbilityTags.size > 0 ? "inline-block" : "none";
  }

  const targetItems = document.querySelectorAll(
    "#start-talents-row .item, #talents-row .item, #ultimates-row .item, #ultimate-talents-row .item, #magical-objects-row .item",
  );

  if (selectedAbilityTags.size === 0) {
    targetItems.forEach((item) => {
      item.classList.remove("ability-highlighted", "ability-dimmed");
    });
    return;
  }

  targetItems.forEach((item) => {
    const tags = item.dataset.tags ? item.dataset.tags.split(",").filter(Boolean) : [];
    const isMatch = tags.some((t) => selectedAbilityTags.has(t));
    item.classList.toggle("ability-highlighted", isMatch);
    item.classList.toggle("ability-dimmed", !isMatch);
  });
}

function DOMContentLoadedHandler() {
  const savedColorTheme = getUserColorTheme();
  applyColorTheme(savedColorTheme);
  applyLanguage(currentLang);
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
  if (event.target.classList.contains("character-portrait")) {
    const characterId = event.target.dataset.character;
    showPage("detail", characterId);
    navigateTo(`/characters/${characterId}`);
  }
}

function detailPageClickHandler(event) {
  if (event.target.closest(".disabled")) return;

  const item = event.target.closest(".item");
  if (!item) return;

  if (window.matchMedia("(max-width: 768px)").matches) {
    // 모바일에서는 두 번 터치 시 선택
    if (lastTouchedItem === item) {
      // 두 번째 터치 시 선택
      itemClickHandler(item);
      lastTouchedItem = null;
    } else {
      // 첫 번째 터치 시 설명 표시
      showTooltip({ target: item });
      lastTouchedItem = item;
    }
  } else {
    // PC에서는 바로 선택
    itemClickHandler(item);
  }
}

function itemClickHandler(item) {
  const tr = item.closest("tr");
  const row = tr.dataset.row;
  if (!row) return;

  if (row === "4") {
    if (item.closest(".right-col")) {
      melodyMoveRightToLeft(item);
    } else {
      melodyMoveLeftToRight(item);
    }
    updateMelodyState();
  } else if (row === "5") {
    if (item.closest(".right-col")) {
      magicalObjectMoveRightToLeft(item);
    } else {
      magicalObjectMoveLeftToRight(item);
    }
  } else {
    if (item.closest(".right-col")) {
      if (row === "2") {
        const ultimateTalentsItems = document.querySelectorAll(
          "#ultimate-talents-row .right-col .item",
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
  const t = I18N[currentLang] || I18N.ko;
  const deleteButton = event.target.closest(".delete-load-item");
  if (deleteButton) {
    const buildName = deleteButton.dataset.buildName;
    const loadItem = deleteButton.previousElementSibling;
    loadItem.textContent = t.confirmDelete;
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
    ".confirm-delete-load-item",
  );
  if (confirmDeleteLoadItem) {
    const buildName = confirmDeleteLoadItem.dataset.buildName;
    let savedBuildList =
      JSON.parse(localStorage.getItem("savedBuildList")) || [];
    savedBuildList = savedBuildList.filter(
      (build) =>
        build.name !== buildName || build.character !== selectedCharacter.id,
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
        build.name === buildName && build.character === selectedCharacter.id,
    );

    if (!selectedBuild) {
      return;
    }

    selectedTalents = selectedBuild.selectedTalents;
    applySelectedTalents();
    hideLoadPopup();
    showSaveNotice(t.loadComplete(buildName));
    return;
  }
}

function saveButtonClickHandler() {
  const t = I18N[currentLang] || I18N.ko;
  const buildName = document.getElementById("build-name").value.trim();
  if (!buildName) {
    showSaveNotice(t.enterBuildName);
    return;
  }
  if (buildName.length > 20) {
    showSaveNotice(t.buildNameMaxLength);
    return;
  }

  let savedBuildList = JSON.parse(localStorage.getItem("savedBuildList")) || [];
  const existingBuild = savedBuildList.find(
    (build) =>
      build.name === buildName && build.character === selectedCharacter.id,
  );

  if (existingBuild) {
    if (
      saveNotice.textContent.includes(I18N.ko.overwriteKeyword) ||
      saveNotice.textContent.includes(I18N.en.overwriteKeyword)
    ) {
      showSaveNotice(t.saveComplete(buildName));
      saveBuild(buildName, savedBuildList);
    } else {
      showSaveNotice(t.overwriteConfirm(buildName));
    }
  } else {
    showSaveNotice(t.saveComplete(buildName));
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
  img.classList.add("character-portrait");
  img.setAttribute("data-character", character.id);
  img.setAttribute("src", `assets/${character.id}/portrait.webp`);
  img.setAttribute("alt", getLocalizedName(character));
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
    const [characterResponse, magicalObjectsResponse, melodiesResponse] =
      await Promise.all([
        fetch(`/assets/${characterId}/talents.json`),
        fetch(`/assets/magical_objects/magicalObjects.json`),
        fetch(`/assets/melodies/melodies.json`),
      ]);

    originalCharacterTalents = await characterResponse.json();
    originalMagicalObjects = await magicalObjectsResponse.json();
    originalMelodies = await melodiesResponse.json();

    if (!originalCharacterTalents) {
      throw new Error("Character talents not found");
    }

    // 페이지를 다시 로드할 때 초기화
    const character = characters.find((char) => char.id === characterId);
    if (character) {
      characterName.textContent = getLocalizedName(character);
      selectedCharacter = character;
    }

    characterImage.setAttribute("data-character", characterId);
    characterImage.setAttribute("src", `/assets/${characterId}/icon.png`);
    characterImage.setAttribute("alt", getLocalizedName(character));

    initializeTalents();
    initializePlaceholders();
    selectedTalents = { ...initialTalents, characterId };

    addTooltipEventListeners();
    updateUltimateTalentsState();
    updateMelodyState();
    updateAbilityHighlight();

    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get("share");

    if (shareData) {
      selectedTalents = JSON.parse(decodeURIComponent(atob(shareData)));
      applySelectedTalents();

      const url = new URL(window.location);
      url.searchParams.delete("share");
      history.replaceState(null, "", url);
    }

    const buildName = document.getElementById("build-name");
    buildName.value = "";
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
  melodies.innerHTML = makeMelodiesContainer();
  magicalObjects.innerHTML = originalMagicalObjects
    .map(makeObjectItemBlock)
    .join("");
}

function makeMelodiesContainer() {
  const noteCounts = [4, 5, 6];
  return `<div class="melody-row-container">
    ${noteCounts
      .map((notes) => {
        const filtered = originalMelodies.filter((m) => m.notes === notes);
        return `<div class="musical-staff">
          <div class="staff-rows">
            <div></div><div></div><div></div><div></div>
          </div>
          <div class="measures">
            ${filtered
              .map(
                (m) => `<div class="measure">${makeMelodyItemBlock(m)}</div>`,
              )
              .join("")}
          </div>
        </div>`;
      })
      .join("")}
  </div>`;
}

function makeMelodyItemBlock(itemObject) {
  const { id: itemId } = itemObject;
  const itemName = getLocalizedName(itemObject);
  const itemIcon = `${itemId}.png`;
  const itemBlock = createItemBlock(itemId, itemName, itemIcon, "melodies");
  return itemBlock.outerHTML;
}

function initializePlaceholders() {
  // 오른쪽 열의 아이템 초기화
  const rightCols = document.querySelectorAll("#detail-page .right-col");
  rightCols.forEach((col) => (col.innerHTML = ""));

  const rows = document.querySelectorAll("#detail-page table tr");
  const placeholdersCount = [1, 7, 1, 1, 3, 1]; // 각 줄에 필요한 placeholder 개수

  rows.forEach((row, index) => {
    const rightCol = row.querySelector(".right-col");
    const count = placeholdersCount[index];
    rightCol.innerHTML = null;

    if (row.id === "melodies-row") {
      const staff = document.createElement("div");
      staff.classList.add("musical-staff");

      const staffRows = document.createElement("div");
      staffRows.classList.add("staff-rows");
      for (let i = 0; i < 4; i++) {
        staffRows.appendChild(document.createElement("div"));
      }
      staff.appendChild(staffRows);

      const measures = document.createElement("div");
      measures.classList.add("measures");
      for (let i = 0; i < count; i++) {
        const measure = document.createElement("div");
        measure.classList.add("measure");
        measure.appendChild(createPlaceholder());
        measures.appendChild(measure);
      }
      staff.appendChild(measures);
      rightCol.appendChild(staff);
    } else {
      for (let i = 0; i < count; i++) {
        rightCol.appendChild(createPlaceholder());
      }
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
    const { id: itemId, icon: itemIcon, tags = [] } = itemObject;
    const itemName = getLocalizedName(itemObject);
    const itemBlock = createItemBlock(
      itemId,
      itemName,
      itemIcon,
      selectedCharacter.id,
      tags,
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
    const {
      id: itemId,
      icon: itemIcon,
      rarity: itemRarity,
      tags = [],
    } = itemObject;
    const itemName = getLocalizedName(itemObject);
    const itemBlock = createItemBlock(
      itemId,
      itemName,
      itemIcon,
      "magical_objects",
      tags,
    );
    const item = itemBlock.querySelector(".item");
    if (item) {
      item.dataset.rarity = itemRarity;
    }
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

function createItemBlock(itemId, itemName, itemIcon, characterId, tags = []) {
  const itemBlock = document.createElement("div");
  const item = document.createElement("div");
  const img = document.createElement("img");

  itemBlock.classList.add("item-block");
  itemBlock.dataset.itemId = itemId;

  item.classList.add("item");
  item.dataset.itemId = itemId;
  if (tags && tags.length > 0) {
    item.dataset.tags = tags.join(",");
  }
  img.src = `/assets/${characterId}/${itemIcon}`;
  img.alt = itemName;
  img.classList.add("item-icon");

  item.appendChild(img);
  itemBlock.appendChild(item);

  return itemBlock;
}

function melodyMoveLeftToRight(item) {
  const tr = item.closest("tr");
  const rightCol = tr.querySelector(".right-col");
  const itemData = originalMelodies.find(
    (m) => m.id === item.dataset.itemId,
  );
  if (!itemData) return false;

  const measures = rightCol.querySelectorAll(".measure");
  for (let i = 0; i < measures.length; i++) {
    const measure = measures[i];
    const placeholder = measure.querySelector(".placeholder");

    if (itemData.slot[i] && placeholder) {
      const itemBlock = item.parentElement;
      const placeholderBlock = placeholder.parentElement;

      placeholderBlock.dataset.itemId = item.dataset.itemId;
      placeholder.replaceWith(item);
      itemBlock.appendChild(placeholder);
      hideTooltip();
      syncSelectedData();
      return true;
    }
  }
  return false;
}

function melodyMoveRightToLeft(item) {
  const tr = item.closest("tr");
  const leftCol = tr.querySelector(".left-col");
  const originalItemBlock = leftCol.querySelector(
    `[data-item-id="${item.dataset.itemId}"]`,
  );

  if (!originalItemBlock) {
    return false;
  }

  const itemBlock = item.parentElement;
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

function magicalObjectMoveLeftToRight(item) {
  const itemBlock = item.parentElement;
  const itemData = originalMagicalObjects.find(
    (obj) => obj.id === itemBlock.dataset.itemId,
  );

  const rowElement = itemBlock.parentElement.parentElement;
  const rightCol = rowElement.querySelector(".right-col");
  const existingItemBlock = rightCol.querySelector(
    `[data-item-id="${item.dataset.itemId}"]`,
  );

  if (existingItemBlock && stackableRarities.includes(itemData?.rarity)) {
    // 이미 존재하는 아이템 블록이 있으면 개수만 증가
    const countSpan = existingItemBlock.querySelector(".item-count");
    countSpan.textContent = parseInt(countSpan.textContent) + 1;
  } else {
    if (existingItemBlock && !stackableRarities.includes(itemData?.rarity)) {
      return false;
    }

    // 존재하지 않으면 새로운 아이템 블록 추가
    const newItemBlock = itemBlock.cloneNode(true);

    if (stackableRarities.includes(itemData?.rarity)) {
      const countSpan = newItemBlock.querySelector(".item-count");
      if (countSpan) {
        countSpan.textContent = "1";
      } else {
        const newCountSpan = document.createElement("span");
        newCountSpan.classList.add("item-count");
        newCountSpan.textContent = "1";
        newItemBlock.appendChild(newCountSpan);
      }
    }

    const placeholderInner = rightCol.querySelector(".placeholder");
    if (placeholderInner) {
      const placeholderBlock = placeholderInner.parentElement;
      rightCol.insertBefore(newItemBlock, placeholderBlock);
    } else {
      rightCol.appendChild(newItemBlock);
      rightCol.appendChild(createPlaceholder());
    }
    newItemBlock.addEventListener("mouseover", showTooltip);
    newItemBlock.addEventListener("mouseout", hideTooltip);
  }

  syncSelectedData();
  const tooltip = document.getElementById("tooltip");
  if (tooltip && tooltip.classList.contains("show")) {
    tooltip.innerHTML = makeTooltipInnerHTML(itemData);
  }
  return true;
}

function magicalObjectMoveRightToLeft(item) {
  const itemBlock = item.parentElement;

  const itemData = originalMagicalObjects.find(
    (obj) => obj.id === itemBlock.dataset.itemId,
  );

  let shouldUpdateTooltip = false;

  if (stackableRarities.includes(itemData.rarity)) {
    // 오른쪽 열의 아이템 클릭 시 개수 감소
    const countSpan = itemBlock.querySelector(".item-count");
    let count = parseInt(countSpan.textContent);
    countSpan.textContent = --count;

    if (count === 0) {
      // 개수가 0이 되면 아이템 블록 제거
      itemBlock.remove();
      hideTooltip();
    } else {
      shouldUpdateTooltip = true;
    }
  } else {
    // 중첩 불가능한 아이템 제거
    itemBlock.remove();
    hideTooltip();
  }

  syncSelectedData();
  if (shouldUpdateTooltip) {
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
    `[data-item-id="${item.dataset.itemId}"]`,
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
    melodies: [],
    magicalObjects: [],
  };

  const rows = document.querySelectorAll("#detail-page table tr");
  rows.forEach((row) => {
    const rightCol = row.querySelector(".right-col");
    const itemBlocks = rightCol.querySelectorAll(
      ".item-block:not(.placeholder)",
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
            newTalents.melodies.push({ id: itemId });
            break;
          case "5":
            const countSpan = itemBlock.querySelector(".item-count");
            const count = countSpan ? parseInt(countSpan.textContent) : 1;
            const existingObject = newTalents.magicalObjects.find(
              (obj) => obj.id === itemId,
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
      (item) => item.id === itemId,
    ) ||
    originalMelodies.find((item) => item.id === itemId) ||
    originalMagicalObjects.find((item) => item.id === itemId);
  const tooltip = document.getElementById("tooltip");
  tooltip.innerHTML = makeTooltipInnerHTML(item);

  tooltip.classList.add("show"); // show 클래스 추가
  const rect = itemElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const isOverflowingRight = rect.right + tooltipRect.width > window.innerWidth;

  if (isOverflowingRight) {
    tooltip.style.left = rect.left - tooltipRect.width + rect.width + "px";
  } else {
    tooltip.style.left = rect.left + "px";
  }
  tooltip.style.top = rect.bottom + 5 + window.scrollY + "px"; // 스크롤 위치 반영
  tooltip.style.transform = "translateY(-5px)";

  clearTimeout(tooltipTimer);
  tooltipTimer = null;
}

function makeTooltipInnerHTML(item) {
  if (!item) return "";
  const t = I18N[currentLang] || I18N.ko;
  const itemId = item.id;
  const itemName = getLocalizedName(item) || "Unknown Item";
  let itemDescription = getLocalizedDescription(item) || "Description not found";
  let innerHTML = `<strong style="font-size: 1.2em;">${itemName}</strong>`;

  if (item && item.rarityValue) {
    item.rarityValue.forEach((values, index) => {
      let coloredValues;
      if (selectedRarityIndex === "all") {
        coloredValues = values
          .map((value, i) => {
            return `<span style="color: ${rarityColors[i]}">${value}</span>`;
          })
          .join("/");
      } else {
        const idx = Math.min(
          parseInt(selectedRarityIndex, 10),
          values.length - 1,
        );
        coloredValues = `<span style="color: ${rarityColors[idx]}; font-weight: bold;">${values[idx]}</span>`;
      }
      itemDescription = itemDescription.replace(`{${index}}`, coloredValues);
    });
  }

  // magicalObject의 경우 rarity와 setEffect 추가
  if (originalMagicalObjects.find((i) => i.id === itemId)) {
    const rarity = t.rarities[item.rarity] || "Unknown";
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

  // melody의 경우 음표 개수 추가
  if (originalMelodies.find((i) => i.id === itemId)) {
    innerHTML += ` <span class="inline-box" style="color: #ff0; border-color: #ff0">${t.notes(item.notes)}</span>`;
  }

  // 능력 태그 배지 표시
  if (item.tags && item.tags.length > 0) {
    const badges = item.tags
      .map((tag) => `<span class="tooltip-tag-badge">${t.abilities[tag] || tag}</span>`)
      .join("");
    innerHTML += ` ${badges}`;
  }

  innerHTML += `<br>${itemDescription}`;

  // melody의 경우 slot 표시 추가
  if (originalMelodies.find((i) => i.id === itemId)) {
    const slots = item.slot || [false, false, false];
    innerHTML += `<div class="melody-slots">
      ${slots
        .map(
          (isActive) =>
            `<div class="melody-slot ${isActive ? "active" : ""}">♪</div>`,
        )
        .join("")}
    </div>`;
  }

  if (originalMagicalObjects.find((i) => i.id === itemId)) {
    const rarity = item.rarity;
    if (["COMMON", "RARE", "EPIC"].includes(rarity)) {
      const set = item.set;
      const setEffect = getLocalizedSetEffect(item);
      const selectedObj = selectedTalents.magicalObjects.find(
        (obj) => obj.id === itemId,
      );
      const selectedCount = selectedObj ? selectedObj.count : 0;
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
  const t = I18N[currentLang] || I18N.ko;
  loadPopup.style.display = "block";
  mask.style.display = "block";

  setTimeout(() => {
    loadPopup.classList.add("show");
    mask.classList.add("show");
  }, 10);

  const savedBuildList =
    JSON.parse(localStorage.getItem("savedBuildList")) || [];
  const filteredBuildList = savedBuildList.filter(
    (build) => build.character === selectedCharacter.id,
  );

  if (filteredBuildList.length === 0) {
    loadList.innerHTML = `<p style="text-align: center">${t.noSavedBuilds}</p>`;
  } else {
    loadList.innerHTML = filteredBuildList
      .map(
        (build) => `
          <div class="load-item-container">
            <p class="load-item" data-build-name="${build.name}">${build.name}</p>
            <fancy-button variant="icon" background-color="red" class="delete-load-item" data-build-name="${build.name}">
              <span slot="text"><img src="/assets/delete.svg"/></span>
            </fancy-button>
          </div>
        `,
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
    "#ultimate-talents .item-block",
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
      build.name !== buildName || build.character !== selectedCharacter.id,
  );
  savedBuildList.push(newBuild);
  localStorage.setItem("savedBuildList", JSON.stringify(savedBuildList));
}

function updateMelodyState() {
  const rightCol = document.querySelector("#melodies-row .right-col");
  if (!rightCol) return;

  const measures = rightCol.querySelectorAll(".measure");
  const slotAvailability = Array.from(measures).map(
    (measure) => !!measure.querySelector(".placeholder"),
  );

  const melodyItems = document.querySelectorAll("#melodies .item-block");
  melodyItems.forEach((itemBlock) => {
    const melodyId = itemBlock.dataset.itemId;
    const itemData = originalMelodies.find((m) => m.id === melodyId);

    if (itemData) {
      const canBePlaced = itemData.slot.some(
        (isAllowed, index) => isAllowed && slotAvailability[index],
      );
      if (canBePlaced) {
        itemBlock.classList.remove("disabled");
      } else {
        itemBlock.classList.add("disabled");
      }
    }
  });
}

function applySelectedTalents() {
  // 선택된 talents를 페이지에 반영하는 로직
  const {
    startTalents,
    talents,
    ultimates,
    ultimateTalents,
    melodies,
    magicalObjects,
  } = selectedTalents;

  // 각 섹션을 초기화
  initializeTalents();
  initializePlaceholders();
  addTooltipEventListeners();

  // startTalents 반영
  startTalents.forEach((talent) => {
    const item = document.querySelector(
      `#start-talents [data-item-id="${talent.id}"] .item`,
    );
    if (item) moveLeftToRight(item);
  });

  // talents 반영
  talents.forEach((talent) => {
    const item = document.querySelector(
      `#talents [data-item-id="${talent.id}"] .item`,
    );
    if (item) moveLeftToRight(item);
  });

  // ultimates 반영
  ultimates.forEach((talent) => {
    const item = document.querySelector(
      `#ultimates [data-item-id="${talent.id}"] .item`,
    );
    if (item) moveLeftToRight(item);
  });

  // ultimateTalents 반영
  ultimateTalents.forEach((talent) => {
    const item = document.querySelector(
      `#ultimate-talents [data-item-id="${talent.id}"] .item`,
    );
    if (item) moveLeftToRight(item);
  });

  // melodies 반영
  if (melodies) {
    melodies.forEach((melody) => {
      const item = document.querySelector(
        `#melodies [data-item-id="${melody.id}"] .item`,
      );
      if (item) melodyMoveLeftToRight(item);
    });
  }

  // magicalObjects 반영
  magicalObjects.forEach((object) => {
    for (let i = 0; i < object.count; i++) {
      const item = document.querySelector(
        `#magical-objects [data-item-id="${object.id}"] .item`,
      );
      if (item) magicalObjectMoveLeftToRight(item);
    }
  });

  updateUltimateTalentsState();
  updateMelodyState();
  updateAbilityHighlight();
}

function formatJsonToReadableText(json) {
  const t = I18N[currentLang] || I18N.ko;
  const h = t.shareHeaders;

  const talentFinder = (category) => (talent) => {
    const origin = originalCharacterTalents[category].find(
      (o) => o.id === talent.id,
    );
    return getLocalizedName(origin) || "";
  };

  const magicalObjectFinder = (object) => {
    const result = originalMagicalObjects.find(
      (origin) => origin.id === object.id,
    );
    if (!result) return "";
    const objName = getLocalizedName(result);
    if (object.count === 1) return objName;
    return `${objName}(${object.count})`;
  };

  const melodyFinder = (melody) => {
    const result = originalMelodies.find((origin) => origin.id === melody.id);
    return result ? getLocalizedName(result) : "";
  };

  const charObj = characters.find((char) => char.id === json.characterId);
  const characterNameText = getLocalizedName(charObj) || "Unknown Character";

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
  const melodiesText =
    json.melodies
      .map(melodyFinder)
      .filter((item) => item !== "")
      .join(", ") || "None";
  const magicalObjects =
    json.magicalObjects
      .map(magicalObjectFinder)
      .filter((item) => item !== "")
      .join(", ") || "None";

  return `# ${h.character}: ${characterNameText}\n○ ${h.startTalents}: ${startTalents}\n○ ${h.talents}: ${talents}\n○ ${h.ultimates}: ${ultimates}\n○ ${h.ultimateTalents}: ${ultimateTalents}\n○ ${h.melodies}: ${melodiesText}\n○ ${h.magicalObjects}: ${magicalObjects}`;
}


function shareButtonClickHandler() {
  const shareData = formatJsonToReadableText(selectedTalents);
  shareText.value = shareData;

  const shareUriData = JSON.stringify(selectedTalents);
  const encodedShareUri = encodeURIComponent(btoa(shareUriData));
  const currentUrl = new URL(window.location);
  currentUrl.search = `?share=${encodedShareUri}`;
  const shareUriString = currentUrl.toString();
  shareUri.value = shareUriString;

  showSharePopup();
}

function copyShareText() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    shareText.select();
    navigator.clipboard.writeText(shareText.value).catch(() => {
      fallbackCopyToClipboard(shareText.value);
    });
  } else {
    fallbackCopyToClipboard(shareText.value);
  }
}

function copyShareUri() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    shareUri.select();
    navigator.clipboard.writeText(shareUri.value).catch(() => {
      fallbackCopyToClipboard(shareUri.value);
    });
  } else {
    fallbackCopyToClipboard(shareUri.value);
  }
}

function fallbackCopyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // 화면에서 보이지 않도록 고정
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
    console.log("텍스트가 복사되었습니다:", text);
  } catch (err) {
    console.error("텍스트 복사 실패:", err);
  }
  document.body.removeChild(textarea);
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
