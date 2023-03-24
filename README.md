# Super Anki (placeholder name)

![Webaufnahme_18-3-2023_133046_localhost](https://user-images.githubusercontent.com/48356881/226106275-d4d3e39f-9f27-46fc-b513-94dda155bcac.jpeg)

A little (very early) project to create a web based spaced repetition app like anki.

If you have any questions or are interested in contributing feel free to reach out by start a discussion or opening an issue!

#### Current state of the project:
- Create, delete, renename decks
- Add flash cards to these decks
- Cards have rich text content (html)
- Cards can be renamed and deleted
- Currently their is only card type ("Normal"). It has a front and a back side.
- Learning algorithm using spaced repetition (SM2)
- A deck will show when cards in it need to be learned
- Settings view
- Light / dark / system mode
- Save cards / decks / settings to IndexedDB (and retrieve / modify them) using dexie.js

#### What doesn't work (yet)?
- Moving decks / cards
- Other card types (at least cloze)

#### Goals:
- open source
- user-friendly, intuitive design (maybe customizable using css later down the road)
- storing data locally (with IndexedDB) but also syncing via a server
- PWA?

#### Technologies:
- React
- Mantine React components
- data storage in the browser using dexie.js (IndexedDB)
