import './bottom-sheet.js'
// Copyright (c) 2022 Ivan Teplov

const $ = document.querySelector.bind(document)

const openSheetButton = $("#open-sheet")
const sheet = $("bottom-sheet")

// Open the sheet when clicking the 'open sheet' button
openSheetButton.addEventListener("click", () => {
  sheet.setAttribute("shown", "true");
})


