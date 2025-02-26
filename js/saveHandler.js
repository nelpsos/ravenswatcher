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
  console.log(exportPopup);
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
loadItemsData();
