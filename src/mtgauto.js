class TrieNode {
  constructor(contents) {
    this.contents = contents;
    this.children = new Map();
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode(null);
  }

  insert(str) {
    const addr = this.#toAddr(str);

    let node = this.root;
    for (const a of addr) {
      if (!node.children.has(a)) { node.children.set(a, new TrieNode(null)); }
      node = node.children.get(a);
    }

    if (node.contents == null) { node.contents = str; }
    else if (node.contents === str) { return; } // exact duplicates are OK
    else { throw Error(`"${node.contents}" already tracked and is not equal to "${str}"`); }
  }

  contains(str) {
    const addr = this.#toAddr(str);

    let node = this.root;
    for (const a of addr) {
      if (node.children.has(a)) { node = node.children.get(a); }
      else { return false; }
    }

    return !(node.contents == null);
  }

  candidates(str) {
    const addr = this.#toAddr(str);
    const resultsTarget = 20;

    let node = this.root;
    for (const a of addr) {
      if (node.children.has(a)) { node = node.children.get(a); }
      else { return []; }
    }

    let results = [];
    let queue = new Array(node);
    while (queue.length > 0) {
      node = queue.shift();
      if (node.contents != null) { results.push(node.contents); }
      if (results.length >= resultsTarget) { return results; }
      node.children.forEach((value) => { queue.push(value); });
    }
    return results;
  }

  #toAddr(str) {
    const splitter = /\s+/;
    const addr = [];
    for (const cp of str.split(splitter).join(' ')) {
      if      ('a' <= cp && cp <= 'z') { addr.push(cp); }
      else if ('A' <= cp && cp <= 'Z') { addr.push(cp.toLowerCase()); }
      else                             { addr.push('_'); }
    }
    return addr;
  }
}

(function () {
  const resultsContainer = document.getElementById("results");
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", function(ev) {
    resultsContainer.innerText = ev.target.value;
  });
})();