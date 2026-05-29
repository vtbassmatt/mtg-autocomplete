(function () {
  const resultsContainer = document.getElementById("results");
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", function(ev) {
    resultsContainer.innerText = ev.target.value;
  });
})();