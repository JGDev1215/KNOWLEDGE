export const htmlModules = import.meta.glob<string>("../Knowledge/*.html", {
  eager: true,
  import: "default",
  query: "?raw",
});

export const KNOWN_IDS: Record<string, string> = {
  "great_books_1_secrets_of_the_universe.html": "great-books-secrets",
  "great_books_5_the_odyssey.html": "odyssey",
  "iliad.html": "iliad",
  "divine_comedy.html": "divine-comedy",
  "paradise-lost.html": "paradise-lost",
  "newton-daniel-study.html": "newton-daniel",
};

export const FALLBACK_SUMMARY: Record<string, string> = {
  "great-books-secrets": "Lecture notes on consciousness, imagination, freedom, meditation, and the role of great books.",
  odyssey: "Lecture notes reading the Odyssey as a family story about trauma, memory, and the repair of the soul.",
  iliad: "A primary text explorer for Homeric books, characters, themes, and passages from the Iliad.",
  "divine-comedy": "A canto and passage explorer for Dante's Inferno, Purgatorio, and Paradiso.",
  "paradise-lost": "A study explorer for Milton's Paradise Lost with books, notable passages, characters, and quiz material.",
  "newton-daniel": "A study guide to Newton's Observations upon the Prophecies of Daniel, focused on prophecy, concepts, and chronology.",
  "dante-in-paradise": "A literature study page on Dante's Paradise, poetic tradition, Beatrice, and ascent through the spheres.",
  "dantes-hierarchy-of-hell": "A literature study page on Dante's cosmology, hierarchy, love, and the structure of Hell.",
  "dantes-la-commedia": "A literature study page on Dante's La Commedia, its structure, and its response to the Aeneid.",
  "dantes-revolution": "A literature study page on Dante's revolution, Virgil, Augustine, and The Divine Comedy.",
  "gay-taleses-sparks-of-light": "A literature study page on Gay Talese's writing method, books, essays, and sparks of light.",
  "the-anti-homer": "A literature study page on the Aeneid as anti-Homer and the shift from Greek arete to Roman piety.",
  "the-poetry-of-empire": "A literature study page on the Aeneid, empire, love, piety, and The Divine Comedy.",
};
