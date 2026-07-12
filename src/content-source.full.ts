import divineComedy from "../Knowledge/divine_comedy.html?raw";
import iliad from "../Knowledge/iliad.html?raw";
import paradiseLost from "../Knowledge/paradise-lost.html?raw";

export const htmlModules: Record<string, string> = {
  "../Knowledge/divine_comedy.html": divineComedy,
  "../Knowledge/iliad.html": iliad,
  "../Knowledge/paradise-lost.html": paradiseLost,
};

export const KNOWN_IDS: Record<string, string> = {
  "iliad.html": "iliad",
  "divine_comedy.html": "divine-comedy",
  "paradise-lost.html": "paradise-lost",
};

export const FALLBACK_SUMMARY: Record<string, string> = {
  iliad: "A primary text explorer for Homeric books, characters, themes, and passages from the Iliad.",
  "divine-comedy": "A canto and passage explorer for Dante's Inferno, Purgatorio, and Paradiso.",
  "paradise-lost": "A study explorer for Milton's Paradise Lost with books, notable passages, characters, and quiz material.",
};
