import { NavigationItem } from '../payload/types';
import { getContentRegistry, titleize, type ContentDoc, type DirMeta } from '../content/registry';
import { extractAllPaths } from './builder';
import { cached, contentGeneration, stamp } from '../cache';

/**
 * Filesystem-derived navigation.
 *
 * The curated tree in `payload/config.ts` stays authoritative for naming and
 * ordering, but it no longer has to be exhaustive: any document under
 * `content/` that the curated tree does not mention is discovered here and
 * appended to the section matching its directory. Adding a Markdown file is
 * therefore enough to publish it.
 *
 * This module reads the content registry and must only run on the server.
 */

/** Sort weight applied to directories without an explicit `order`. */
const DEFAULT_DIR_ORDER = Number.MAX_SAFE_INTEGER;

/**
 * A section node's weight among its siblings.
 *
 * Sections and root pages share one list, and both are placed by the `order`
 * they declare: a page's own, or — for a section — the weight of the directory
 * it stands for, which is its folder's `_meta.json` when it has one and the
 * `order` declared by the page heading that folder when it does not.
 *
 * Appending instead of placing, which is what the merge used to do, put a
 * section wherever the first document that happened to reference it sorted. A
 * folder whose `_meta.json` says `order: 500` landed at the top of the sidebar
 * for that reason: the first document to reference it was a nested folder page
 * declaring `order: 1` — a weight meant to sort that page against its own
 * siblings, read as a weight for the whole top level.
 *
 * @param dir - The directory the section stands for
 * @param dirOrder - Weight of a directory
 * @returns The weight its siblings are sorted by
 */
function sectionWeight(dir: string, dirOrder: (dir: string) => number): number {
  return dir ? dirOrder(dir) : DEFAULT_DIR_ORDER;
}

/**
 * The directory a section node stands for, inferred from its descendants.
 *
 * A section built by the merge stands for the directory it was created for, and
 * its first children are appended immediately after it is placed — so by the
 * time another node has to be compared against it, its descendants name that
 * directory. A section spanning several directories answers null, and is then
 * not something to sort against.
 *
 * @param section - A section node
 * @returns The directory it stands for, or null when it does not name one
 */
function sectionDir(section: NavigationItem): string | null {
  const dirs = new Set<string>();

  function visit(node: NavigationItem): void {
    if (node.path) {
      const at = node.path.lastIndexOf('/');
      dirs.add(at === -1 ? '' : node.path.slice(0, at));
    }

    for (const child of node.children ?? []) visit(child);
  }

  for (const child of section.children ?? []) visit(child);

  return dirs.size === 1 ? [...dirs][0] : null;
}

/**
 * Returns the parent directory of a content directory path.
 *
 * @param dir - Directory path relative to `content/`
 * @returns The parent directory, or '' for a top-level directory
 */
function parentDir(dir: string): string {
  const index = dir.lastIndexOf('/');
  return index === -1 ? '' : dir.slice(0, index);
}

/**
 * Deep-clones a navigation tree so merging never mutates the payload config.
 *
 * The payload is a module-level constant shared across every rendered page;
 * appending discovered documents to it in place would compound the tree on
 * each render during a dev session.
 */
function cloneTree(items: NavigationItem[]): NavigationItem[] {
  return items.map((item) => ({
    ...item,
    children: item.children ? cloneTree(item.children) : undefined,
  }));
}

/**
 * Maps content directories to the curated section that already represents them.
 *
 * A curated section does not declare which directory it covers, so ownership is
 * inferred from its descendants: a section whose documents all live under
 * `getting-started/` is taken to own that directory. Sections spanning several
 * directories are left unmapped, since appending to them would be a guess.
 *
 * @param items - Curated navigation tree
 * @returns Directory path to the owning navigation node
 */
function indexSectionsByDir(items: NavigationItem[]): Map<string, NavigationItem> {
  const sections = new Map<string, NavigationItem>();

  function visit(node: NavigationItem): Set<string> {
    const dirs = new Set<string>();

    if (node.path) {
      const index = node.path.lastIndexOf('/');
      dirs.add(index === -1 ? '' : node.path.slice(0, index));
    }

    for (const child of node.children ?? []) {
      for (const dir of visit(child)) dirs.add(dir);
    }

    // Only claim ownership when the section is unambiguous.
    if (node.children && dirs.size === 1) {
      const [dir] = Array.from(dirs);
      if (dir && !sections.has(dir)) {
        sections.set(dir, node);
      }
    }

    return dirs;
  }

  for (const item of items) visit(item);
  return sections;
}

/**
 * The sort weight a document contributes to its position at the top level.
 *
 * For a document inside a folder this is the folder's `_meta.json` order, since
 * the document's own order only ranks it among its siblings. For a root-level
 * document there is no folder, so its own `order` serves — which is what lets a
 * single sequence of numbers interleave root pages and sections, rather than
 * root pages always landing after every folder.
 */
function sectionOrder(doc: ContentDoc, dirOrder: (dir: string) => number): number {
  return doc.dir === '' ? doc.order : dirOrder(doc.dir);
}

/**
 * Orders discovered documents so that appended entries land predictably.
 *
 * Documents are grouped by the section they belong to and those sections
 * ordered first, so that a section is created at the right position the moment
 * its first document is appended. Within a section, documents follow their own
 * frontmatter order.
 */
function compareOrphans(a: ContentDoc, b: ContentDoc, dirOrder: (dir: string) => number): number {
  const aSection = sectionOrder(a, dirOrder);
  const bSection = sectionOrder(b, dirOrder);
  if (aSection !== bSection) return aSection - bSection;

  if (a.dir !== b.dir) return a.dir.localeCompare(b.dir);
  if (a.order !== b.order) return a.order - b.order;
  return a.title.localeCompare(b.title);
}

/**
 * Builds a navigation node for a discovered document.
 */
function docToNavItem(doc: ContentDoc): NavigationItem {
  const item: NavigationItem = {
    name: doc.title,
    path: doc.path,
  };

  if (typeof doc.frontmatter.icon === 'string') item.icon = doc.frontmatter.icon;
  if (typeof doc.frontmatter.color === 'string') item.color = doc.frontmatter.color;

  return item;
}

/**
 * Builds a navigation section node for a content directory.
 */
function dirToNavItem(dir: string, meta: DirMeta): NavigationItem {
  const name = meta.name ?? titleize(dir.slice(dir.lastIndexOf('/') + 1));
  const item: NavigationItem = { name, children: [] };

  if (meta.icon) item.icon = meta.icon;
  if (meta.color) item.color = meta.color;
  if (meta.hidden) item.hidden = true;

  return item;
}

/**
 * Merges curated navigation with documents discovered under `content/`.
 *
 * Curated entries are preserved exactly as written. Every document not already
 * referenced — and not marked `hidden` in its frontmatter — is appended to the
 * section covering its directory, creating that section (and any missing
 * ancestors) when necessary.
 *
 * A directory that has a page of its own beside it stops being a bare section
 * and becomes that page: `content/ailan.md` heads the pages of
 * `content/ailan/`, so the node carries the page's path, opens on a click, and
 * still holds the folder's other pages as its children. A page with sub-pages
 * therefore needs no configuration — write the page beside the folder it
 * belongs to, under the folder's name.
 *
 * @param curated - Navigation from the payload config; may be empty
 * @returns The merged navigation tree
 *
 * @example
 * ```typescript
 * // content/guides/advanced.md exists but is absent from the payload
 * const nav = mergeDiscoveredDocs(payload.navigation ?? []);
 * // The 'Guides' section now includes an 'Advanced' entry.
 * ```
 */
export function mergeDiscoveredDocs(curated: NavigationItem[]): NavigationItem[] {
  const { docs, dirMeta } = getContentRegistry();
  const root = cloneTree(curated);

  const referenced = new Set(extractAllPaths(root));
  const sections = indexSectionsByDir(root);

  /**
   * The nodes the curated tree itself put in place.
   *
   * Everything discovered is placed by weight; a curated entry is not, because
   * its position is the author's statement about where it goes. Marking them
   * lets the two rules stay out of each other's way: a curated node is skipped
   * when looking for somewhere to insert, so the merge never pushes one down.
   */
  const authored = new WeakSet<NavigationItem>();

  function markAuthored(items: NavigationItem[]): void {
    for (const item of items) {
      authored.add(item);
      if (item.children) markAuthored(item.children);
    }
  }

  markAuthored(root);

  /**
   * The directory each section built here stands for.
   *
   * Kept beside the node because a section is placed before it has any
   * children, and at that moment its directory is the one thing that says
   * where it belongs — it cannot be read back off a tree that is still empty.
   *
   * A `WeakMap` rather than a property on the node: the node is handed to the
   * page and serialised, and this is scaffolding for the merge alone.
   */
  const sectionDirs = new WeakMap<NavigationItem, string>();

  const orphans = docs.filter((doc) => !referenced.has(doc.path) && !doc.hidden);

  // Which directories will actually appear as navigation nodes: one does when a
  // page lives inside it or inside one of its subdirectories. A page never puts
  // its own name in here — `content/ailan.md` names the directory `ailan`, not
  // something inside it — which is what keeps a page whose folder holds nothing
  // (or nothing else) an ordinary leaf rather than an empty heading.
  const nodeDirs = new Set<string>();
  for (const doc of orphans) {
    for (let dir = doc.dir; dir; dir = parentDir(dir)) nodeDirs.add(dir);
  }

  // Directory → the page beside it that heads it: `content/ailan.md` heads the
  // pages of `content/ailan/`. A page the curated tree lists, or one that hides
  // itself in frontmatter, is not offered here.
  const parentPage = new Map<string, ContentDoc>();
  for (const doc of orphans) {
    if (nodeDirs.has(doc.path) && !parentPage.has(doc.path)) parentPage.set(doc.path, doc);
  }

  // A heading page is represented by the node it heads, so it is not appended
  // among that node's children as well.
  const leaves = orphans.filter((doc) => !parentPage.has(doc.path));

  // A directory's sort weight. Folders without metadata sort after every root
  // page; a folder headed by a page that declares no `_meta.json` order keeps
  // the `order` that page declares, so writing `content/ailan.md` beside
  // `content/ailan/` does not reposition anything among its siblings.
  const dirOrder = (dir: string) =>
    dirMeta.get(dir)?.order ?? parentPage.get(dir)?.order ?? DEFAULT_DIR_ORDER;

  /**
   * Turns a directory node into the page that heads it, when there is one.
   *
   * Only nodes the auto-merge built itself gain the page's path — a curated
   * section is preserved exactly as written, and listing `path` there is how a
   * curated tree says it wants the page. The folder's `_meta.json` keeps the
   * last word on name, colour and icon, so styling a folder stays where it was.
   */
  function attachFolderPage(node: NavigationItem, dir: string): void {
    if (node.path) return;
    const page = parentPage.get(dir);
    if (!page) return;

    node.path = page.path;
    // `_meta.json` keeps the last word on how the folder is presented; the
    // page's own title only fills in when the folder names none.
    const meta = dirMeta.get(dir);
    if (!meta?.name) node.name = page.title;
    if (!meta?.icon && !node.icon && typeof page.frontmatter.icon === 'string') {
      node.icon = page.frontmatter.icon;
    }
    if (!meta?.color && !node.color && typeof page.frontmatter.color === 'string') {
      node.color = page.frontmatter.color;
    }
  }

  /** `order` declared by a document, keyed by its published path. */
  const declaredOrder = new Map<string, number>();
  for (const doc of docs) declaredOrder.set(doc.path, doc.order);

  /** Weight of a page, by content path. */
  const pageOrder = (path: string) => declaredOrder.get(path) ?? DEFAULT_DIR_ORDER;

  /**
   * Places a node among its siblings by the weight it declares.
   *
   * Appending — which is what creating a section on first sight used to do —
   * puts it wherever the first document that happened to reference it sorted,
   * and that is not the same question as where it belongs. A folder whose
   * `_meta.json` says `order: 500` was landing at the top of the sidebar
   * because the first document to reference it was a nested folder page with
   * its own `order: 1`: a weight meant to sort it against its siblings, read as
   * a weight for the whole top level.
   *
   * Sections and root pages are placed by one rule rather than two, because
   * they share one list: a page declaring `order: 3` belongs before a section
   * declaring `order: 500`, and neither belongs after an unnumbered one.
   *
   * @param parent - The children array to insert into
   * @param node - The node being placed
   * @param dir - The directory a section stands for; '' for a page
   */
  function insertByWeight(parent: NavigationItem[], node: NavigationItem, dir: string): void {
    // A page is weighed by its own `order`; a section by the directory it
    // stands for. Both are that node's answer to "where do I belong".
    const weight = node.children
      ? sectionWeight(dir, dirOrder)
      : node.path
        ? pageOrder(node.path)
        : DEFAULT_DIR_ORDER;

    /**
     * The weight of a sibling already in the list.
     *
     * A section records the directory it stands for when it is created, which
     * is what makes this answerable while a section is still empty. A curated
     * section records nothing, so it is weighed by the directory its own
     * descendants name, and one that names none reports the default: it then
     * neither moves nor holds anything back.
     *
     * @param sibling - A node already placed
     * @returns Its weight, or null when it is the author's to position
     */
    const siblingWeight = (sibling: NavigationItem): number | null => {
      if (authored.has(sibling)) return null;
      if (!sibling.children) return sibling.path ? pageOrder(sibling.path) : DEFAULT_DIR_ORDER;

      const siblingDir = sectionDirs.get(sibling) ?? sectionDir(sibling);
      return siblingDir === null ? DEFAULT_DIR_ORDER : sectionWeight(siblingDir, dirOrder);
    };

    const at = parent.findIndex((sibling) => {
      const siblingWeightValue = siblingWeight(sibling);

      // Curated entries are skipped rather than compared: where one sits is
      // the payload's statement, not something a discovered document gets to
      // rearrange.
      return siblingWeightValue !== null && siblingWeightValue > weight;
    });

    if (at === -1) parent.push(node);
    else parent.splice(at, 0, node);
  }

  /**
   * Returns the children array that documents in `dir` should be appended to,
   * creating the section chain if it does not exist yet.
   */
  function childrenFor(dir: string): NavigationItem[] {
    if (!dir) return root;

    const existing = sections.get(dir);
    if (existing) {
      existing.children ??= [];
      // A curated section that owns this directory gains the page beside it as
      // its path; its label, colour and ordering stay exactly as written.
      const page = parentPage.get(dir);
      if (page && !existing.path) existing.path = page.path;
      return existing.children;
    }

    const node = dirToNavItem(dir, dirMeta.get(dir) ?? {});
    attachFolderPage(node, dir);
    insertByWeight(childrenFor(parentDir(dir)), node, dir);
    sections.set(dir, node);
    sectionDirs.set(node, dir);

    return node.children!;
  }

  for (const doc of [...leaves].sort((a, b) => compareOrphans(a, b, dirOrder))) {
    const item = docToNavItem(doc);
    // A `_meta.json` that hides a folder hides the pages it holds.
    if (dirMeta.get(doc.dir)?.hidden) item.hidden = true;

    // Placed rather than appended, so a root page and a top-level section come
    // out in one sequence of `order` values. Appending was what left every
    // root page behind every folder, and then behind a folder whose weight
    // came from a nested page's own ordering.
    insertByWeight(childrenFor(doc.dir), item, doc.dir);
  }

  return root;
}

/**
 * Flags curated entries whose document hides itself in frontmatter.
 *
 * Discovery already leaves such documents out, but a curated entry is kept
 * exactly as written — so a page marked `hidden: true` that the payload also
 * lists stayed in the sidebar and in the reading sequence, while search, the
 * sitemap and the graph all honoured the frontmatter. Marking the entry here
 * lets every consumer of the tree agree with them.
 */
function markHiddenDocs(items: NavigationItem[], hidden: Set<string>): void {
  for (const item of items) {
    if (item.path && hidden.has(item.path)) item.hidden = true;
    if (item.children) markHiddenDocs(item.children, hidden);
  }
}

let memo: NavigationItem[] | null = null;
const memoStamp = stamp();

/**
 * Returns the site navigation, memoised per process.
 *
 * When `autoNavigation` is disabled in the payload, the curated tree is
 * returned untouched; otherwise discovered documents are merged in.
 *
 * @param curated - Navigation from the payload config
 * @param autoNavigation - Whether to append discovered documents (default true)
 * @returns The navigation tree to render
 */
export function getNavigation(
  curated: NavigationItem[] | undefined,
  autoNavigation = true,
): NavigationItem[] {
  const hit = cached(memo, memoStamp);
  if (hit) return hit;

  const base = curated ?? [];
  const tree = autoNavigation ? mergeDiscoveredDocs(base) : cloneTree(base);

  // Both branches return a clone, so this never marks the payload itself.
  const hiddenDocs = new Set(
    getContentRegistry()
      .docs.filter((doc) => doc.hidden)
      .map((doc) => doc.path),
  );
  markHiddenDocs(tree, hiddenDocs);

  memo = tree;
  memoStamp.at = contentGeneration();

  return memo;
}
