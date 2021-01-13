/*
|-------------------------------------------------------------------------------
| Extractor for "&text=..." Google Fonts param
|-------------------------------------------------------------------------------
|
| Run this in browser console to get all the characters used by fonts
| that aren't native.
|
|   copyGoogleFontsTextParam();
|
*/

function copyGoogleFontsTextParam() {
  var googleFamEl = document.querySelector(
    'link[href*="fonts.googleapis.com"][href*="family="]'
  );
  if (!googleFamEl)
    throw new Error("Cannot find a google fonts <link> element on the page.");

  var googleFamAttr = new URL(
    googleFamEl.getAttribute("href")
  ).searchParams.get("family");
  if (!googleFamAttr)
    throw new Error(
      'Google fonts link does not contain font families - check the "family" search param.'
    );

  var fontFamilies = googleFamAttr
    .split("|")
    .map((query) => query.split(":")[0]);
  if (
    !(
      Array.isArray(fontFamilies) &&
      fontFamilies.every((fam) => typeof fam === "string")
    )
  )
    throw new TypeError(
      "Expected font-family names on the google fonts link resolve to an array of strings."
    );

  var alphabet = "";
  for (var i = 32; i <= 126; i++) {
    alphabet += String.fromCharCode(i);
  }
  var alphabetMap = alphabet.split("").map((char) => {
    alphabetMap;
    return { char: char, present: false, uni: char.charCodeAt(0) };
  });

  var table = {};

  document.body.querySelectorAll("*").forEach((el) => {
    var fam = css(el, "font-family");
    table[fam] =
      table[fam] ||
      alphabet.split("").map((char) => {
        return { char: char, present: false, uni: char.charCodeAt(0) };
      });

    el.innerText.split("").forEach((char) => {
      table[fam].forEach((obj) => {
        if (obj.char === char) {
          obj.present = true;
          return false;
        }
      });
    });
  });

  var allChars = Object.keys(table).reduce((allChars, key) => {
    if (!key.startsWith('"')) return allChars;
    allChars = allChars.concat(
      table[key]
        .filter((obj) => obj.present)
        .filter((obj) => obj.char !== " ")
        .reverse()
        .map((obj) => (obj.uni < 48 ? encodeURIComponent(obj.char) : obj.char))
    );
    return allChars;
  }, []);

  var thing = "&text=" + uniq(allChars).sort().reverse().join("");

  var isCopied = false;
  if (window.copy) {
    window.copy(thing);
    isCopied = true
  }

  console.log(thing + (isCopied ? "\n\n ...Copied to clipboard!" : ''));

  function css(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
  }

  function uniq(array) {
    return array.filter(
      (value, index, self) =>
        index === self.findIndex((other) => other === value)
    );
  }
}

console.log('\nRUN THE FOLLOWING WHEN READY:\n\n  copyGoogleFontsTextParam()\n ')
