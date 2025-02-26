const detailPage = document.getElementById("detail-page");

detailPage.addEventListener("click", (event) => {
  const item = event.target.closest(".item");
  if (item) {
    const row = item.parentElement.parentElement.dataset.row;
    const rightCol = detailPage.querySelector(`[data-row="${row}"] .right-col`);
    const placeholder = rightCol.querySelector(".placeholder");
    if (placeholder) {
      placeholder.replaceWith(item);
      detailPage
        .querySelector(`[data-row="${row}"] .left-col`)
        .appendChild(placeholder);
    }
  }
});
