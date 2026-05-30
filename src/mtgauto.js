import { Trie } from "./trie.js";
(function () {
  const resultsContainer = document.getElementById("results");
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", function(ev) {
    resultsContainer.innerText = searchTrie.candidates(ev.target.value);
  });

  const searchTrie = new Trie();
  searchTrie.insert("Llanowar Elves");
  searchTrie.insert("Llanowar Legion");
  searchTrie.insert("+2 Mace");
})();