# Skola
![Bildschirm­foto 2023-03-24 um 16 38 23](https://user-images.githubusercontent.com/48356881/227647754-24bd757c-2d52-43f6-ae4d-a40e5e48e039.png)
![Bildschirm­foto 2023-03-24 um 16 51 02](https://user-images.githubusercontent.com/48356881/227647758-4584000e-eb56-483e-a329-cf393a2ac921.png)

A very early project to create a web based spaced repetition flash card app like anki. View a demo [here](https://skola.web.app).

#### Motivation
Many students any other learners including myself use spaced repetition tools, that being mainly Anki. Anki is certainly very useful, but it has a overall offputting user interface that is often unintuitive und doesn't reward the user for learning. Other alternatives are costly and closed source.
Skola aims to create an intuitive and fun yet still effective learning experience.
This is an enthusiast's project currently only being worked on part-time by a single person. However, you are very welcome to contribute to this project. If you have any questions or suggestions, please go ahead by creating an issue or starting a discussion.

#### Current state of the project:
- Create, delete, renename decks
- Add flash cards to these decks
- Cards have rich text content (html)
- Cards can be renamed and deleted
- Card types: normal, double sided and cloze
- Learning algorithm using spaced repetition (SM2)
- A deck will show when cards in it need to be learned
- Settings view
- Light / dark / system mode
- Save cards / decks / settings to IndexedDB (and retrieve / modify them) using dexie.js

#### What doesn't work (yet)?
- Moving decks / cards
- Image occlusion
- Statistics

#### Goals:
- open source and free
- user-friendly, intuitive design
- responsive design optimized for mobile and desktop experience
- storing data locally (using IndexedDB) but also syncing via a server
- PWA and caching for offline usage (possibly usage of Notification API)
- customizability

#### Technologies:
- Typescript
- React
- Mantine React Component Library
- Data storage in the browser using dexie.js (IndexedDB)
