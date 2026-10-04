/**
 * The tesseract.js `langPath` for a language served by the `ocr-image.lang-url` mirror from tools-settings.json.
 *
 * tesseract.js always appends `/<lang>.traineddata.gz` to langPath, so the mirror is a directory, optionally with a
 * `{lang}` placeholder in the path (e.g. a mirror of jsDelivr's `.../@tesseract.js-data/{lang}/4.0.0_best_int`). A
 * template that names the file itself (`.../{lang}.traineddata.gz`) is reduced to its directory. Relative URLs resolve
 * against `baseUrl`.
 */
export function getMirrorLangPath(template: string, lang: string, baseUrl: string) {
  const directory = template.replace(/\/?\{lang\}\.traineddata(\.gz)?$/, '');
  return new URL(directory.replaceAll('{lang}', lang), baseUrl).href;
}
