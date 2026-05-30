export class Trie {
  constructor(serializedData) {
    if (serializedData) {
      this.root = JSON.parse(serializedData, (key, value) => 
        key == 'children' ? new Map(Object.entries(value)) : value
      );
    } else {
      this.root = {'children': new Map()};
    }
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
    if (str.length == 0) { return []; }

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
      value instanceof Map ? Object.fromEntries(value) : value
    );
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
