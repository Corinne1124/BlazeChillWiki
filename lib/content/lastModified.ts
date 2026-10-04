import { execFileSync } from 'child_process';
import path from 'path';
import { CONTENT_DIR, getDoc } from './registry';

/**
 * When a page was last changed, and how that was established.
 *
 * The distinction matters to the reader only indirectly, but it decides what
 * happens when the two disagree: a date written into the frontmatter is a
 * claim the author made deliberately, and it wins over the commit that
 * happened to touch the file.
 */
export interface LastModified {
  /** Full ISO 8601 timestamp, for `<time datetime>` and structured data */
  iso: string;
  /** Calendar date in the author's own offset, e.g. `2026-08-06` */
  date: string;
  /** Where the timestamp came from */
  source: 'frontmatter' | 'git';
}

/**
 * Normalises a frontmatter date into an ISO timestamp.
 *
 * YAML parses an unquoted `2026-08-06` into a `Date`, a quoted one into a
 * string, and `updated: soon` into neither. All three reach here, and only the
 * ones that name a real instant come back out.
 *
 * @param value - Raw frontmatter value
 * @returns ISO 8601 timestamp, or null when the value is not a date
 */
function toIso(value: unknown): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  return null;
}

/**
 * Extracts the calendar date an ISO timestamp names in its own offset.
 *
 * Formatting the instant instead would make the displayed day depend on where
 * the site was built: a commit made at 08:00 in Seoul is the previous evening
 * in UTC, so a CI runner and a laptop would disagree about what day a page was
 * touched. The date the author saw on their own clock is already the leading
 * characters of the timestamp.
 *
 * @param iso - ISO 8601 timestamp
 * @returns The `YYYY-MM-DD` portion
 */
function calendarDate(iso: string): string {
  return iso.slice(0, 10);
}

/** Repo-relative commit timestamps, keyed by content path. Built once. */
let gitTimes: Map<string, string> | null = null;

/**
 * Reads the last commit time of every tracked file under `content/`.
 *
 * One `git log` covers the whole tree: walking newest-first, the first commit
 * a file appears in is the last one that touched it. Per-file invocations would
 * mean a subprocess per page, which a wiki of any size would feel.
 *
 * Failure here is ordinary rather than exceptional — a wiki scaffolded five
 * minutes ago has no repository, and a page written five minutes ago has no
 * commit. Both end up with no date, which is the honest answer.
 *
 * @returns Content paths mapped to ISO timestamps; empty when git cannot answer
 */
function readGitTimes(): Map<string, string> {
  const times = new Map<string, string>();

  try {
    const run = (args: string[]) =>
      execFileSync('git', args, {
        cwd: process.cwd(),
        encoding: 'utf-8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'ignore'],
      });

    const root = run(['rev-parse', '--show-toplevel']).trim();

    // In a shallow clone the oldest commit has had its parents cut off, so
    // git lists every file that existed then as if that commit had written
    // it — and a page from years ago is dated with whatever was checked out
    // last. Hosts clone shallowly by default. The parents are printed with
    // each date so that such a commit can be recognised and its files left
    // undated, which is the honest answer for them.
    const shallow = run(['rev-parse', '--is-shallow-repository']).trim() === 'true';

    // `@` prefixes the date lines: a path never starts with one, so the two
    // kinds of line in the output stay tellable apart without a second pass.
    // `core.quotePath=false` because git otherwise prints any path with a
    // character outside ASCII as a quoted, octal-escaped string — so every
    // page with a Korean file name failed the `.md` test below and had no
    // date at all.
    const log = run([
      '-c',
      'core.quotePath=false',
      'log',
      '--format=@%cI %P',
      '--name-only',
      '--',
      CONTENT_DIR,
    ]);

    let stamp: string | null = null;

    for (const line of log.split('\n')) {
      if (line.startsWith('@')) {
        const [iso, ...parents] = line.slice(1).split(' ').filter(Boolean);
        stamp = shallow && parents.length === 0 ? null : iso;
        continue;
      }

      if (!line || !stamp) continue;

      // Composed, as the registry keys its documents: git stores the composed
      // form, but a name read off a macOS volume arrives decomposed, and the
      // two never meet in a map.
      const relative = path.relative(CONTENT_DIR, path.resolve(root, line.normalize('NFC')));
      if (relative.startsWith('..') || !relative.endsWith('.md')) continue;

      const docPath = relative.slice(0, -'.md'.length).split(path.sep).join('/');
      // Newest first, so an entry already present is the more recent one.
      if (!times.has(docPath)) times.set(docPath, stamp);
    }
  } catch {
    return times;
  }

  return times;
}

/**
 * Returns the commit-time index, building it on first use.
 *
 * Memoised even in development, unlike everything else derived from content:
 * this describes committed history, which editing a file does not change. The
 * frontmatter half of {@link getLastModified} is read fresh each time, so the
 * date an author is actively adjusting still updates on save.
 */
function getGitTimes(): Map<string, string> {
  if (!gitTimes) gitTimes = readGitTimes();
  return gitTimes;
}

/**
 * Decides between a declared date and a commit date.
 *
 * `updated` in the frontmatter is taken as written, because an author who
 * writes one means it — a typo fixed today does not make a page from March any
 * newer. Otherwise the last commit that touched the file answers, which costs
 * the author nothing and is right far more often than a hand-maintained field,
 * since the one thing nobody remembers to update is the one recording that
 * they updated something.
 *
 * @param declared - Raw `updated` frontmatter value, if any
 * @param committed - ISO timestamp of the last commit touching the file, if any
 * @returns The timestamp and its origin, or null when neither source knows
 */
export function resolveLastModified(
  declared: unknown,
  committed: string | undefined,
): LastModified | null {
  const written = toIso(declared);
  if (written) return { iso: written, date: calendarDate(written), source: 'frontmatter' };
  if (committed) return { iso: committed, date: calendarDate(committed), source: 'git' };

  return null;
}

/**
 * Resolves when a document was last changed.
 *
 * @param docPath - Content-relative path without extension
 * @returns The timestamp and its origin, or null when neither source knows
 *
 * @example
 * ```typescript
 * getLastModified('guides/setup');
 * // { iso: '2026-08-06T08:12:44+09:00', date: '2026-08-06', source: 'git' }
 * ```
 */
export function getLastModified(docPath: string): LastModified | null {
  const doc = getDoc(docPath);
  if (!doc) return null;

  // Keyed by content path, which is the file's path: the page `guides/setup`
  // is `content/guides/setup.md`, and that is the file git dates.
  return resolveLastModified(doc.frontmatter.updated, getGitTimes().get(docPath));
}

/**
 * Resolves when a document was first published.
 *
 * Only the frontmatter answers. The first commit touching a file is when it
 * entered the repository, which for an imported vault or a restructured wiki is
 * not when the page was written — and a publication date that quietly means
 * something else is worse than none.
 *
 * @param docPath - Content-relative path without extension
 * @returns ISO 8601 timestamp, or null when `date` is absent or unparseable
 */
export function getPublished(docPath: string): string | null {
  const doc = getDoc(docPath);
  return doc ? toIso(doc.frontmatter.date) : null;
}
