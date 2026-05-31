import csv
import lzma
import shutil
import sys
import urllib.request


HEADER = """import { Trie } from "./trie.js";
(function () {
  const searchTrie = new Trie();
"""
FOOTER = """
  const trieData = searchTrie.serialize();
  const data = JSON.stringify({'data': trieData});
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const downloader = document.getElementById('download');
  downloader.href = url;
  downloader.download = 'trie.txt';
})();
"""

def download_and_unpack():
    opener = urllib.request.build_opener()
    opener.addheaders = [('User-agent', 'mtg-autocomplete/1.0.0')]
    # TODO: we should be pulling from AtomicCards.json.xz or AllPrintings.sqlite.xz instead, for legalities
    with opener.open('https://mtgjson.com/api/v5/csv/cards.csv.xz') as response:
        print('downloading...')
        with lzma.open(response) as compressed:
            print('decompressing...')
            with open('cards.csv', 'wb') as csv_out:
                shutil.copyfileobj(compressed, csv_out)


def make_trie_builder():
    with open('cards.csv', newline='') as f, open('triebuilder.js', 'w') as js:
        print('converting...')
        # header
        print(HEADER, file=js)

        # list of cards
        reader = csv.DictReader(f)
        for row in reader:
            name = row['name']
            name = name.replace('"', '\\"')
            print(f'  searchTrie.insert("{name}");', file=js)
        
        # footer
        print(FOOTER, file=js)

        print('now you can copy triebuilder.js into src/ and open triebuilder.html')


def main():
    download = 'download' in sys.argv
    emit = 'emit' in sys.argv
    usage = '--help' in sys.argv or '-?' in sys.argv
    if not any([download, emit]):
        usage = True

    if usage: print_usage()
    if download: download_and_unpack()
    if emit: make_trie_builder()


def print_usage():
    print(f"{sys.argv[0]} download - download new cards.csv")
    print(f"{sys.argv[0]} emit     - crunch cards.csv into new triebuilder.js")
    print()
    print("you can do both in one invocation:")
    print(f"  {sys.argv[0]} download emit")

if __name__ == '__main__':
    main()
