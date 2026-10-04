import { describe, it, expect, beforeEach } from 'vitest';
import {
  clearRegistryCache,
  getAllDocPaths,
  getContentRegistry,
  getDoc,
  titleize,
} from './registry';

/**
 * These run against the repository's own `content/` directory rather than a
 * fixture, so they double as a check that the shipped content stays valid.
 */

describe('titleize', () => {
  it('turns file naming conventions into readable labels', () => {
    expect(titleize('quick-start')).toBe('Quick Start');
    expect(titleize('api_reference')).toBe('Api Reference');
    expect(titleize('intro')).toBe('Intro');
  });
});

describe('getContentRegistry', () => {
  beforeEach(clearRegistryCache);

  it('discovers every Markdown file under content/', () => {
    const { docs } = getContentRegistry();

    expect(docs.length).toBeGreaterThan(0);
    expect(docs.every((doc) => doc.filePath.endsWith('.md'))).toBe(true);
  });

  it('strips the extension and normalises the path', () => {
    const paths = getAllDocPaths();

    expect(paths).toContain('example/intro');
    expect(paths).toContain('example/getting-started/quick-start');
    expect(paths.every((path) => !path.endsWith('.md'))).toBe(true);
    expect(paths.every((path) => !path.startsWith('/'))).toBe(true);
  });

  it('reads the title from frontmatter', () => {
    expect(getDoc('example/getting-started/quick-start')?.title).toBe('快速入门');
  });

  it('splits the path into segments and a directory', () => {
    const doc = getDoc('example/getting-started/quick-start');

    expect(doc?.segments).toEqual(['example', 'getting-started', 'quick-start']);
    expect(doc?.dir).toBe('example/getting-started');
  });

  it('reports a root-level document as having no directory', () => {
    // Named rather than looked up by path: which files sit at the root is the
    // author's to decide, and a test that required a particular one failed the
    // day that page was renamed. The invariant is about the shape of a path,
    // not about any page in particular.
    const rootDocs = getContentRegistry().docs.filter((doc) => doc.dir === '');

    expect(rootDocs.length).toBeGreaterThan(0);
    for (const doc of rootDocs) {
      expect(doc.path).not.toContain('/');
      expect(doc.segments).toEqual([doc.path]);
    }
  });

  it('publishes every page at the path of its file', () => {
    // The whole convention: nothing is rewritten, so `content/ailan.md` is the
    // page `ailan` and the folder beside it is organised around that page
    // rather than owning a page of its own.
    for (const doc of getContentRegistry().docs) {
      expect(doc.filePath.replace(/\\/g, '/').endsWith(`/${doc.path}.md`)).toBe(true);
    }
  });

  it('strips the frontmatter block from the body', () => {
    const doc = getDoc('example/intro');

    // A `---` rule may still appear mid-document; what must be gone is the
    // leading frontmatter block and the keys it declared.
    expect(doc?.content.trimStart().startsWith('---')).toBe(false);
    expect(doc?.content).not.toContain('title: 欢迎使用 eziwiki');
    expect(doc?.frontmatter.title).toBe('欢迎使用 eziwiki');
  });

  it('returns undefined for a path with no file', () => {
    expect(getDoc('does-not-exist')).toBeUndefined();
  });

  it('memoises the scan until the cache is cleared', () => {
    expect(getContentRegistry()).toBe(getContentRegistry());

    const before = getContentRegistry();
    clearRegistryCache();
    expect(getContentRegistry()).not.toBe(before);
  });

  it('sorts documents by order then title', () => {
    const { docs } = getContentRegistry();

    for (let i = 1; i < docs.length; i++) {
      const previous = docs[i - 1];
      const current = docs[i];

      if (previous.order === current.order) {
        expect(previous.title.localeCompare(current.title)).toBeLessThanOrEqual(0);
      } else {
        expect(previous.order).toBeLessThan(current.order);
      }
    }
  });

  it('reads a page published beside its folder', () => {
    // content/fixtures.md and content/fixtures/ — the page is the file, and
    // the folder is simply where its sub-pages live.
    const doc = getDoc('fixtures');

    expect(doc).toBeDefined();
    expect(doc?.dir).toBe('');
    expect(doc?.title).toBe('夹具父页面');
    expect(doc?.filePath.replace(/\\/g, '/')).toMatch(/content\/fixtures\.md$/);
  });

  it('reads a heading page nested as deeply as its folder', () => {
    const doc = getDoc('fixtures/deep');

    expect(doc).toBeDefined();
    expect(doc?.dir).toBe('fixtures');
    expect(doc?.title).toBe('夹具深层父页面');
    expect(doc?.filePath.replace(/\\/g, '/')).toMatch(/fixtures\/deep\.md$/);
  });

  it('treats index.md as an ordinary page', () => {
    // The old convention made this file stand for its folder. It no longer
    // does: the page's path is the path of its file, `index` and all.
    const paths = getAllDocPaths();

    expect(paths).toContain('fixtures/plain/index');
    expect(getDoc('fixtures/plain/index')?.title).toBe('夹具 index 页面');
  });
});
