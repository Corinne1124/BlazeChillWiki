import { describe, it, expect } from 'vitest';
import { mergeDiscoveredDocs } from './auto';
import { extractAllPaths } from './builder';
import { getAllDocPaths, getContentRegistry, getDoc } from '../content/registry';
import { NavigationItem } from '../payload/types';

/** Finds a node anywhere in the tree by its display name. */
function findByName(items: NavigationItem[], name: string): NavigationItem | null {
  for (const item of items) {
    if (item.name === name) return item;
    if (item.children) {
      const found = findByName(item.children, name);
      if (found) return found;
    }
  }
  return null;
}

/** Finds the section that holds a given page, at any depth. */
function findSectionContaining(items: NavigationItem[], path: string): NavigationItem | null {
  for (const item of items) {
    if (item.children?.some((child) => child.path === path)) return item;
    if (item.children) {
      const found = findSectionContaining(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

/** Finds a navigation node by the content path it publishes, at any depth. */
function findByPath(items: NavigationItem[], path: string): NavigationItem | null {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children) {
      const found = findByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

describe('mergeDiscoveredDocs', () => {
  it('builds the whole tree from content when nothing is curated', () => {
    const merged = mergeDiscoveredDocs([]);
    const paths = extractAllPaths(merged);

    const expected = getAllDocPaths().filter((path) => !getDoc(path)?.hidden);
    expect(paths.sort()).toEqual(expected.sort());
  });

  it('leaves curated entries untouched', () => {
    const curated: NavigationItem[] = [{ name: '🏠 Custom Intro Label', path: 'intro' }];
    const merged = mergeDiscoveredDocs(curated);

    expect(merged[0]).toMatchObject({ name: '🏠 Custom Intro Label', path: 'intro' });
  });

  it('does not duplicate a document the curated tree already references', () => {
    const merged = mergeDiscoveredDocs([{ name: 'Intro', path: 'intro' }]);
    const paths = extractAllPaths(merged);

    expect(paths.filter((path) => path === 'intro')).toHaveLength(1);
  });

  it('appends a discovered document to the curated section owning its directory', () => {
    const curated: NavigationItem[] = [
      {
        name: '📚 Getting Started',
        children: [{ name: 'Quick Start', path: 'example/getting-started/quick-start' }],
      },
    ];

    const section = findByName(mergeDiscoveredDocs(curated), '📚 Getting Started');
    const childPaths = section?.children?.map((child) => child.path) ?? [];

    // 'installation' and 'first-wiki' live in the same directory and were not
    // curated, so they should land inside the existing section.
    expect(childPaths).toContain('example/getting-started/quick-start');
    expect(childPaths).toContain('example/getting-started/installation');
    expect(childPaths).toContain('example/getting-started/first-wiki');
  });

  it('creates a section for a directory the curated tree does not cover', () => {
    const merged = mergeDiscoveredDocs([]);

    // The section is named by content/example/getting-started/_meta.json, so
    // match on the pages it holds rather than on a label that is content's to
    // choose. It sits under the `example` section, hence the recursive search.
    const section = findSectionContaining(merged, 'example/getting-started/quick-start');

    expect(section?.children?.length).toBeGreaterThan(0);
    expect(section?.path).toBeUndefined();
  });

  it('takes a section name from the folder _meta.json', () => {
    const merged = mergeDiscoveredDocs([]);

    expect(findByName(merged, '📚 快速入门')).not.toBeNull();
  });

  it('orders root pages and sections in one sequence', () => {
    const merged = mergeDiscoveredDocs([]);

    // Both kinds reach the top level, and a root page sits between sections
    // rather than behind all of them. That is what "one sequence" means here,
    // and it is checkable without depending on any particular page: the old
    // assertion named a document that has since been renamed.
    //
    // A section is a node with children and no path of its own; a root page is
    // a node with a path and no children.
    const sections = merged.filter((item) => !item.path && item.children);
    const pages = merged.filter((item) => item.path && !item.children);

    if (sections.length === 0 || pages.length === 0) return;

    const lastSection = merged.indexOf(sections[sections.length - 1]);

    expect(merged.indexOf(pages[0])).toBeLessThan(lastSection);
    expect(merged.slice(0, lastSection).some((item) => item.path && !item.children)).toBe(true);
  });

  it('places every top-level entry by the order it declares', () => {
    const merged = mergeDiscoveredDocs([]);

    /**
     * The weight a top-level node declares, or null when it declares none.
     *
     * A section is weighed by its directory — `_meta.json` first, then the
     * folder page's own `order` — and a page by its own. This is the same rule
     * the merge sorts by, restated here so the assertion fails if the two ever
     * drift apart.
     */
    const declared = (item: NavigationItem): number | null => {
      if (!item.children) return item.path ? (getDoc(item.path)?.order ?? null) : null;

      const child = item.children.find((entry) => entry.path);
      const dir = item.path ?? child?.path?.slice(0, child.path.lastIndexOf('/'));
      if (!dir) return null;

      const meta = getContentRegistry().dirMeta.get(dir)?.order;
      if (typeof meta === 'number') return meta;
      return getDoc(`${dir}/index`)?.order ?? null;
    };

    const weighed = merged
      .map((item) => ({ name: item.name, weight: declared(item) }))
      .filter((entry): entry is { name: string; weight: number } => entry.weight !== null);

    expect(weighed.length).toBeGreaterThan(1);

    const sequence = weighed.map((entry) => entry.weight);
    const ascending = [...sequence].sort((a, b) => a - b);

    // Compared as whole sequences rather than element by element, so a failure
    // prints the ordering that came out instead of the first pair that differs.
    expect(sequence).toEqual(ascending);
  });

  it('keeps a curated entry where the payload put it', () => {
    // A discovered page outranks it by weight, and must not be inserted above
    // it: the payload's order is a statement, not a suggestion.
    const curated: NavigationItem[] = [
      { name: 'First', path: 'example/getting-started/quick-start' },
      { name: 'Second', path: 'example/intro' },
    ];

    const merged = mergeDiscoveredDocs(curated);

    expect(merged[0].name).toBe('First');
    expect(merged[1].name).toBe('Second');
  });

  it('omits documents marked hidden in frontmatter', () => {
    const paths = extractAllPaths(mergeDiscoveredDocs([]));
    const hidden = getAllDocPaths().filter((path) => getDoc(path)?.hidden);

    for (const path of hidden) {
      expect(paths).not.toContain(path);
    }
  });

  it('does not mutate the curated tree it was given', () => {
    const curated: NavigationItem[] = [
      {
        name: 'Getting Started',
        children: [{ name: 'Quick Start', path: 'getting-started/quick-start' }],
      },
    ];
    const before = JSON.stringify(curated);

    mergeDiscoveredDocs(curated);

    expect(JSON.stringify(curated)).toBe(before);
  });

  it('places root-level documents at the top level', () => {
    const merged = mergeDiscoveredDocs([]);
    const topLevel = merged.filter((item) => item.path).map((item) => item.path);

    // Whatever is at the root of `content/` — the test is that being there puts
    // a page in the top level of the sidebar, not that any given page is. A
    // folder page is included: `x/index.md` publishes the path `x`, which is a
    // root path, and when the folder holds nothing else yet the page is a
    // top-level leaf exactly like `x.md` would be.
    const expected = getAllDocPaths().filter((path) => {
      const doc = getDoc(path);
      return Boolean(doc && doc.dir === '' && !doc.hidden);
    });

    expect(expected.length).toBeGreaterThan(0);
    for (const path of expected) expect(topLevel).toContain(path);

    // And nothing that lives in a folder reaches the top level on its own: it
    // belongs to the section its directory becomes.
    const nested = getAllDocPaths().filter((path) => {
      const doc = getDoc(path);
      return Boolean(doc && doc.dir !== '' && !doc.hidden);
    });

    for (const path of nested) expect(topLevel).not.toContain(path);
  });

  it('heads a folder with the page published beside it', () => {
    const node = findByPath(mergeDiscoveredDocs([]), 'fixtures');

    expect(node).not.toBeNull();
    // The node is a page now, not a heading…
    expect(node?.path).toBe('fixtures');
    expect(node?.name).toBe('夹具父页面');

    // …and it still holds the folder's pages.
    const childPaths = node?.children?.map((child) => child.path) ?? [];
    expect(childPaths).toContain('fixtures/child');
    expect(childPaths).toContain('fixtures/second');
    // The page must not also appear among its own children.
    expect(childPaths).not.toContain('fixtures');
  });

  it('keeps the heading page once in the tree', () => {
    const paths = extractAllPaths(mergeDiscoveredDocs([]));

    expect(paths.filter((path) => path === 'fixtures')).toHaveLength(1);
  });

  it('heads a nested folder with the page beside it too', () => {
    const node = findByPath(mergeDiscoveredDocs([]), 'fixtures/deep');

    expect(node?.path).toBe('fixtures/deep');
    expect(node?.children?.map((child) => child.path)).toContain('fixtures/deep/leaf');
  });

  it('leaves a folder without a page beside it an unclickable section', () => {
    const merged = mergeDiscoveredDocs([]);
    const section = findSectionContaining(merged, 'fixtures/plain/one');

    expect(section).not.toBeNull();
    expect(section?.path).toBeUndefined();
    expect(section?.children?.map((child) => child.path)).toContain('fixtures/plain/one');
  });

  it('treats index.md as an ordinary page inside its folder', () => {
    const merged = mergeDiscoveredDocs([]);
    const paths = extractAllPaths(merged);

    // The old convention published `fixtures/plain` for this file; now it is a
    // page called `fixtures/plain/index`, listed among its siblings.
    expect(paths).toContain('fixtures/plain/index');
    expect(findByPath(merged, 'fixtures/plain/index')).not.toBeNull();
  });

  it('keeps the folder presentation on the page node', () => {
    const node = findByPath(mergeDiscoveredDocs([]), 'fixtures');

    // The folder's `_meta.json` hides the whole subtree from the sidebar, and
    // gained no name or icon of its own, so the page's title names the node.
    expect(node?.hidden).toBe(true);
    expect(node?.name).toBe('夹具父页面');
  });

  it('places a headed folder by the order its own page declares', () => {
    const merged = mergeDiscoveredDocs([]);
    const at = merged.findIndex((item) => item.path === 'fixtures');
    const order = getDoc('fixtures')?.order;

    expect(at).toBeGreaterThanOrEqual(0);
    expect(order).toBeDefined();

    // `content/fixtures/` has no `_meta.json` order, so the weight of the
    // folder is the weight of the page heading it: every root page declaring a
    // smaller one comes first, and every root page declaring a larger one comes
    // after — a folder does not simply land behind every page or before them.
    for (const [index, item] of merged.entries()) {
      const doc = item.path ? getDoc(item.path) : undefined;
      if (!doc || doc.dir !== '' || item.children === undefined) continue;
      if (doc.order < order!) expect(index).toBeLessThan(at);
      if (doc.order > order!) expect(index).toBeGreaterThan(at);
    }
  });
});
