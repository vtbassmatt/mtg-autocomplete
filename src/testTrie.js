import { Trie } from "./trie.js";

const t = new Trie();
t.insert("Llanowar Elves");
t.insert("Llanowar Legion");
t.insert("+2 Mace");
console.log(t.candidates("llanowar"));
console.log(t.candidates("llanowar e"));
console.log(t.candidates("elves"));
const ser = t.serialize();
console.log(ser);

const t2 = new Trie(ser);
console.log(t2.candidates("llanowar"));
console.log(t2.candidates("llanowar e"));
console.log(t2.candidates("elves"));

const ser2 = t2.serialize();
console.log("survives roundtrip:", ser == ser2);
