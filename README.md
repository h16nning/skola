# Skola
![Bildschirm­foto 2023-03-24 um 16 38 23](https://user-images.githubusercontent.com/48356881/227647754-24bd757c-2d52-43f6-ae4d-a40e5e48e039.png)
![Bildschirm­foto 2023-03-24 um 16 51 02](https://user-images.githubusercontent.com/48356881/227647758-4584000e-eb56-483e-a329-cf393a2ac921.png)

An early project aiming to create a web-based spaced repetition flash card app like anki. View a demo [here](https://skola.web.app).

#### Current state of the project:
- Normal / double-sided and cloze cards
- rich text content (html)
- Learning algorithm with using fsrs.js (implementation of free spaced repetition scheduler)
- light / dark / system mode

#### What doesn't work (yet)?
- image occlusion
- audio
- today view
- statistics
- caching for offline usage

#### Goals:
- open source and free
- user-friendly, intuitive design
- fun and rewarding experience
- responsive design optimized for mobile and desktop experience
- storing data locally (using IndexedDB) in the future also syncing
- PWA and caching for offline usage (possibly usage of Notification API)
- customizability

#### Technologies:
- Typescript
- React
- Mantine React
- Data storage in the browser using dexie.js (IndexedDB)

#### Motivation
Many students and other learners use spaced repetition tools, mainly Anki. Anki is very useful, but it has an overall offputting user interface that is often unintuitive und doesn't reward the user for learning. Other alternatives are costly or closed source.
If you are interested, you are very welcome to contribute to this project. If you have any questions or suggestions, please go ahead by creating an issue or starting a discussion.

