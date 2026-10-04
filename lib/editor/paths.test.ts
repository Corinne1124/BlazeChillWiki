import { describe, it, expect } from 'vitest';
import { RESERVED_SEGMENTS, checkPagePath, filePathFor, suggestPagePath } from './paths';
import { RESERVED_SEGMENTS as ROUTE_SEGMENTS } from '../navigation/routes';

describe('suggestPagePath', () => {
  it('lower-cases and hyphenates the way the wiki names files', () => {
    expect(suggestPagePath('Quick Start')).toBe('quick-start');
    expect(suggestPagePath('guides/Setup Now')).toBe('guides/setup-now');
  });

  it('keeps letters outside ASCII, which a wiki writes its files in too', () => {
    expect(suggestPagePath('艾兰')).toBe('艾兰');
    expect(suggestPagePath('아이란')).toBe('아이란');
  });
});

describe('checkPagePath', () => {
  it('accepts an ordinary page path', () => {
    expect(checkPagePath('guides/setup')).toEqual({ ok: true, path: 'guides/setup' });
  });

  it('tolerates the punctuation people type around a path', () => {
    expect(checkPagePath('/guides/setup.md/')).toEqual({ ok: true, path: 'guides/setup' });
  });

  it('reads a trailing slash as the same path', () => {
    // A folder is named by the page beside it, not by the slash: `ailan/` is
    // the page `ailan`.
    expect(checkPagePath('ailan/')).toEqual({ ok: true, path: 'ailan' });
  });

  it('keeps index as part of a path', () => {
    expect(checkPagePath('ailan/index')).toEqual({ ok: true, path: 'ailan/index' });
    expect(checkPagePath('index')).toEqual({ ok: true, path: 'index' });
  });

  it('keeps spaces, which the content already carries', () => {
    expect(checkPagePath('AE - ASKARSE')).toEqual({ ok: true, path: 'AE - ASKARSE' });
  });

  it('refuses an empty path', () => {
    expect(checkPagePath('   ')).toEqual({ ok: false, problem: 'empty' });
    expect(checkPagePath('/')).toEqual({ ok: false, problem: 'empty' });
  });

  it('refuses the segments the app keeps for its own views', () => {
    expect(checkPagePath('graph')).toEqual({ ok: false, problem: 'reserved' });
    expect(checkPagePath('tags/鬼')).toEqual({ ok: false, problem: 'reserved' });
  });

  it('refuses underscored and dotted names, which are never published', () => {
    expect(checkPagePath('_drafts/idea')).toEqual({ ok: false, problem: 'draft' });
    expect(checkPagePath('.hidden')).toEqual({ ok: false, problem: 'draft' });
  });

  it('refuses paths that leave the content directory or break a URL', () => {
    expect(checkPagePath('../../etc/passwd')).toEqual({ ok: false, problem: 'invalid' });
    expect(checkPagePath('a/./b')).toEqual({ ok: false, problem: 'invalid' });
    expect(checkPagePath('a?b')).toEqual({ ok: false, problem: 'invalid' });
    expect(checkPagePath('a:b')).toEqual({ ok: false, problem: 'invalid' });
  });

  it('agrees with the routes module about what is reserved', () => {
    // The client cannot import `lib/navigation/routes.ts` — it reads the
    // content registry — so the list is duplicated and this is what keeps the
    // two copies honest.
    expect(RESERVED_SEGMENTS).toEqual(ROUTE_SEGMENTS);
  });
});

describe('file paths', () => {
  it('maps a page to the file that holds it', () => {
    expect(filePathFor('guides/setup')).toBe('content/guides/setup.md');
    // Even a page that heads a folder is an ordinary file: the folder is a
    // neighbour, not a container it lives in.
    expect(filePathFor('ailan')).toBe('content/ailan.md');
    expect(filePathFor('/ailan/')).toBe('content/ailan.md');
  });
});
