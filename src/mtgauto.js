class Trie {
  constructor() {
    this.root = {'children': new Map()};
  }

  insert(str) {
    const addr = this.#toAddr(str);

    let node = this.root;
    for (const a of addr) {
      if (!node.children.has(a)) { node.children.set(a, {'children': new Map()}); }
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

  serialize() {
    return JSON.stringify(this.root, (key, value) =>
      value instanceof Map ? Array.from(value.entries()) : value
    );
  }

  static fromSerialized(serialized) {
    const result = new Trie();
    result.root = JSON.parse(serialized, (key, value) =>
      Array.isArray(value) && value.every(Array.isArray) ? new Map(value) : value,);
    return result;
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

const t = new Trie();
t.insert("Llanowar Elves");
t.insert("Llanowar Legion");
t.insert("+2 Mace");
console.log(t.candidates("llanowar"));
console.log(t.candidates("llanowar e"));
console.log(t.candidates("elves"));
const ser = t.serialize();
console.log(ser);

const t2 = Trie.fromSerialized(ser);
console.log(t2.candidates("llanowar"));
console.log(t2.candidates("llanowar e"));
console.log(t2.candidates("elves"));

const ser2 = t2.serialize();
console.log("survives roundtrip:", ser == ser2);


(function () {
  const resultsContainer = document.getElementById("results");
  const searchBox = document.getElementById("searchBox");
  searchBox.addEventListener("input", function(ev) {
    resultsContainer.innerText = ev.target.value;
  });
})();