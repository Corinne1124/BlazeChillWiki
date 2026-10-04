/**
 * Page paths, as the editor has to reason about them.
 *
 * The editor writes files into a repository rather than into a directory it can
 * list, so a path typed by a reader has to be checked here — before it becomes
 * a commit — and turned into the file that would hold it. A page's path is the
 * path of its file: `content/ailan.md` publishes `ailan`, and because that is
 * also the name of the folder beside it, the page heads that folder's pages in
 * the sidebar. Nothing about the file has to say so.
 *
 * Pure and client-safe: no filesystem, no registry.
 */

/** Why a typed path cannot be used. */
export type PathProblem = 'empty' | 'reserved' | 'draft' | 'invalid';

/** Either a usable path or the reason it is not one. */
export type PathCheck = { ok: true; path: string } | { ok: false; problem: PathProblem };

/**
 * First URL segments the app keeps for its own views.
 *
 * Mirrors `RESERVED_SEGMENTS` in `lib/navigation/routes.ts`. That module reads
 * the content registry, which cannot cross into the browser, and a page under
 * one of these segments would be built and then shadowed by the graph or tag
 * route — so it is refused here instead. `lib/editor/paths.test.ts` asserts the
 * two lists stay identical.
 */
export const RESERVED_SEGMENTS = ['graph', 'tags'];

/** Characters no sane filename carries, and which break URLs besides. */
const FORBIDDEN = /[\\:*?"<>|\u0000-\u001f]/;

/**
 * Turns a title into a path a file could be created at.
 *
 * The conventions are the wiki's own: lower case, hyphens for spaces — the same
 * transform `suggestPath()` applies to a wanted page's link target. Letters
 * outside ASCII survive, because a wiki written in Chinese or Korean names its
 * files in those letters too.
 *
 * @param target - A title or a path, as typed
 * @returns A content-relative path, possibly empty
 *
 * @example
 * ```typescript
 * suggestPagePath('Quick Start'); // 'quick-start'
 * suggestPagePath('guides/Setup Now'); // 'guides/setup-now'
 * ```
 */
export function suggestPagePath(target: string): string {
  return target
    .split('/')
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, ''),
    )
    .filter(Boolean)
    .join('/');
}

/**
 * Checks a path typed into the editor.
 *
 * Leading and trailing slashes and a `.md` suffix are tolerated, since all
 * three are how people write a path. A trailing slash carries no meaning of its
 * own: `ailan/` is the page `ailan`, whose file sits beside the folder of that
 * name.
 *
 * @param input - Path as typed
 * @returns The path to publish, or the reason it was refused
 *
 * @example
 * ```typescript
 * checkPagePath('guides/setup'); // { ok: true, path: 'guides/setup' }
 * checkPagePath('ailan/');       // { ok: true, path: 'ailan' }
 * checkPagePath('/graph/');      // { ok: false, problem: 'reserved' }
 * ```
 */
export function checkPagePath(input: string): PathCheck {
  const trimmed = input.trim().replace(/^\/+|\/+$/g, '');
  const withoutExt = trimmed.replace(/\.md$/i, '');
  const normalized = withoutExt
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');

  if (!normalized) return { ok: false, problem: 'empty' };

  const segments = normalized.split('/');

  for (const segment of segments) {
    if (segment === '.' || segment === '..' || FORBIDDEN.test(segment)) {
      return { ok: false, problem: 'invalid' };
    }
    // Underscored names are the wiki's drafts: the build skips them, so a page
    // created under one would never appear.
    if (segment.startsWith('_') || segment.startsWith('.')) {
      return { ok: false, problem: 'draft' };
    }
  }

  if (RESERVED_SEGMENTS.includes(segments[0].toLowerCase())) {
    return { ok: false, problem: 'reserved' };
  }

  return { ok: true, path: segments.join('/') };
}

/**
 * The repository file a page lives in.
 *
 * A page's path is its file's path, so this is a suffix rather than a lookup:
 * `guides/setup` is `content/guides/setup.md`, always.
 *
 * @param pagePath - Content path, as {@link checkPagePath} returned it
 * @returns Path from the repository root
 */
export function filePathFor(pagePath: string): string {
  return `content/${pagePath.replace(/^\/+|\/+$/g, '')}.md`;
}
