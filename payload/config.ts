import { Payload } from '@/lib/payload/types';

/**
 * Site configuration.
 *
 * Navigation is intentionally absent: every page under `content/` is discovered
 * automatically, grouped by folder, and ordered by frontmatter. See
 * `content/configuration/navigation.md` for how to override that.
 */
export const payload: Payload = {
  global: {
    title: '炽冽BlazeChill - 设定，故事与世界观',
    description: '炽冽设定集',
    favicon: '/favicon.svg',
    lang: 'zh-CN',

    /**
     * Where this site is published.
     *
     * Canonical tags, the sitemap and social images are absolute URLs built
     * from this, so it has to name a host that actually serves the site — a
     * canonical pointing at a domain that does not resolve tells search
     * engines the real page is somewhere unreachable. A deployment can
     * override it by setting `NEXT_PUBLIC_SITE_URL`.
     */
    baseUrl: 'https://corinne1124.github.io/BlazeChillWiki',
    /** Linked from the sidebar. Omit it and the link is not rendered. */
    repoUrl: 'https://github.com/Corinne1124/BlazeChillWiki',
    /**
     * URL form for content pages.
     *
     * 'path' mirrors the content tree (`/getting-started/quick-start`) and is
     * what search engines and readers can make sense of.
     * 'hash' emits opaque digests (`/a3f2e9d1-...`), concealing the structure
     * at the cost of SEO and shareable links.
     */
    urlStrategy: 'path',
    /**
     * Publish pages found under `content/` without listing them anywhere.
     *
     * This site relies on it entirely: there is no `navigation` array below.
     * Section names, order, and colours come from each folder's `_meta.json`,
     * and page order from frontmatter. Add a `navigation` array here to take
     * manual control of naming and ordering.
     */
    autoNavigation: true,
    seo: {
      openGraph: {
        title: '炽冽BlazeChill - 设定，故事与世界观',
        description: '炽冽设定集',
        images: [
          {
            url: '/og-image.svg',
            width: 1200,
            height: 630,
            alt: '忌夜！',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: '炽冽BlazeChill - 设定，故事与世界观',
        description: '炽冽BlazeChill - 设定，故事与世界观',
        images: ['/og-image.svg'],
      },
    },
  },
  documents: {
    /**
     * Documents to show as pictures of their pages rather than in the viewer.
     *
     * For scans. A scanned page is already a picture and carries no text to
     * select or search, so drawing it during the build loses nothing and saves
     * the reader the parser, the worker, and every line of script.
     *
     * Opt-in because the same treatment ruins a text document — thirty-eight
     * times the bytes, and the text gone with it. See
     * `content/features/pdf-embeds.md`.
     */
    raster: ['scans/**'],
  },
  /**
   * The in-browser editor.
   *
   * Enabled, any reader who supplies a GitHub token with write access to
   * `global.repoUrl` can edit a page where they are reading it: the change is
   * committed to this repository and published by the Pages workflow that
   * already runs on every push to `main`, so nothing else has to be deployed.
   *
   * The token is never part of the site. It is typed by the reader, kept (only
   * if they ask) in that browser's storage, and sent to `api.github.com` and
   * nowhere else — which is the whole of the security model a static site can
   * have. Anyone able to commit to this repository can already change every
   * page, so this grants no new power; it only shortens the distance between
   * spotting a mistake and fixing it. Set `enabled: false` to remove the
   * controls entirely. See `content/example/configuration/editing.md`.
   */
  editor: {
    enabled: true,
  },
  theme: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    background: '#ffffff',
    text: '#1f2937',
    sidebarBg: '#f9fafb',
    codeBg: '#f3f4f6',
  },
};

export default payload;
