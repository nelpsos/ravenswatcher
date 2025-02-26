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
  img.classList.add("character-image");
  img.setAttribute("data-character", character.id);
  img.setAttribute("src", `assets/${character.id}/portrait.webp`);
  img.setAttribute("alt", character.name);
  characterButtonsContainer.appendChild(img);
});
