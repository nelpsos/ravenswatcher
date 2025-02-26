const talentObject = {
  
}

const startTalents = document.getElementById("#start-talents");
const talents = document.getElementById("#talents");
const ultimates = document.getElementById("#ultimates");
const ultimateTalents = document.getElementById("#ultimate-talents");
const magicalObjects = document.getElementById("#magical-objects");

detailPage.addEventListener("click", (event) => {
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
        console.log(placeholder.parentElement);
        console.log(item);
        placeholder.parentElement.dataset.itemId = item.dataset.itemId;
        placeholder.replaceWith(item);
        itemBlock.appendChild(placeholder);
      }
    }
  }
});
