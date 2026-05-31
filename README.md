# mtg-autocomplete

An experiment to see if we can do a high-performance autocomplete for Magic: the Gathering card titles on the client side.

## Trying it

```shellsession
% cd src
% python -m http.server

# then open a browser to http://localhost:8000/harness.html
```

## Rebuilding the autocomplete database

```shellsession
% cd builder
% python build.py download emit
% cp triebuilder.js ../src
```

Now run a Python HTTP server as above and go to http://localhost:8000/triebuilder.html.
This will build the trie in memory, then you can download the result.
Finally, copy that result to the appropriate line in `mtgauto.js`.