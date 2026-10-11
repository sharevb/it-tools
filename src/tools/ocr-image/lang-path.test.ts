import { describe, expect, it } from 'vitest';
import { getMirrorLangPath } from './lang-path';

describe('getMirrorLangPath', () => {
  it('uses a plain directory as is, with or without a trailing slash', () => {
    expect(getMirrorLangPath('https://intranet.example/tessdata/', 'fra', 'https://it-tools.example/')).to.equal(
      'https://intranet.example/tessdata/',
    );
    expect(getMirrorLangPath('https://intranet.example/tessdata', 'fra', 'https://it-tools.example/')).to.equal(
      'https://intranet.example/tessdata',
    );
  });

  it('fills a {lang} placeholder in the directory path', () => {
    expect(
      getMirrorLangPath(
        'https://intranet.example/npm/@tesseract.js-data/{lang}/4.0.0_best_int',
        'deu',
        'https://it-tools.example/',
      ),
    ).to.equal('https://intranet.example/npm/@tesseract.js-data/deu/4.0.0_best_int');
  });

  it('reduces a template naming the file to its directory', () => {
    expect(
      getMirrorLangPath('https://intranet.example/tessdata/{lang}.traineddata.gz', 'fra', 'https://it-tools.example/'),
    ).to.equal('https://intranet.example/tessdata');
    expect(
      getMirrorLangPath('https://intranet.example/{lang}/{lang}.traineddata', 'fra', 'https://it-tools.example/'),
    ).to.equal('https://intranet.example/fra');
  });

  it('resolves relative mirrors against the app base', () => {
    expect(getMirrorLangPath('tessdata/', 'fra', 'https://it-tools.example/sub/')).to.equal(
      'https://it-tools.example/sub/tessdata/',
    );
  });
});
