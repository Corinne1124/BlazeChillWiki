'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, X } from 'lucide-react';
import { useStrings } from '@/components/providers/StringsProvider';
import { useEditorConfig } from '@/components/providers/EditorConfigProvider';
import { useEditorStore } from '@/lib/store/editorStore';
import { format } from '@/lib/i18n/format';
import { checkPagePath, filePathFor, suggestPagePath, type PathProblem } from '@/lib/editor/paths';
import {
  getField,
  parseDocument,
  parseListField,
  renderDocument,
  setField,
  type EditableField,
  type FieldValue,
  type ParsedDocument,
} from '@/lib/editor/frontmatter';
import {
  deleteFile,
  readFile,
  verifyToken,
  writeFile,
  type RemoteFile,
  type RepoRef,
} from '@/lib/editor/github';

/**
 * The in-browser editor.
 *
 * A static site has no server to write to, so an edit becomes a commit: the
 * reader supplies a token, the editor reads the page's Markdown from the
 * repository, and saving puts it back. Nothing is rendered from the browser —
 * the page the author is looking at is the previous build, and the site updates
 * when the commit reaches it.
 *
 * Two ways to write the same file are offered, because they suit different
 * changes: fields for the handful of frontmatter keys the wiki understands, and
 * source for everything else. The field editor rewrites only the lines it owns;
 * a block it cannot follow sends the reader to the source instead of being
 * flattened.
 *
 * Loaded on demand (`next/dynamic`, no SSR) from `PageLayout`, so a reader who
 * never edits downloads none of it.
 */

/** What the overlay is doing at the moment. */
type Phase = 'signin' | 'loading' | 'ready';

/** A message shown above the form. */
interface Failure {
  /** Sentence explaining what went wrong */
  text: string;
  /** The API's own words, when it had any */
  detail?: string;
}

/** A blank page, as the field editor holds it. */
function emptyDocument(): ParsedDocument {
  return { entries: [], body: '', hasFrontmatter: false, simple: true };
}

/** Reads a frontmatter value as a list, whichever shape it was written in. */
function asList(value: FieldValue | undefined): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

/** Renders a frontmatter value into a text input. */
function asText(value: FieldValue | undefined): string {
  if (value === undefined || value === null) return '';
  return Array.isArray(value) ? value.join(', ') : String(value);
}

const INPUT_CLASS =
  'w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100';

const BUTTON_PRIMARY =
  'inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 dark:ring-offset-gray-900';

const BUTTON_QUIET =
  'inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800';

const BUTTON_DANGER =
  'inline-flex items-center gap-1.5 rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950';

export function EditorOverlay() {
  const t = useStrings();
  const { repo } = useEditorConfig();
  const router = useRouter();

  const close = useEditorStore((state) => state.close);
  const signIn = useEditorStore((state) => state.signIn);
  const signOut = useEditorStore((state) => state.signOut);
  const mode = useEditorStore((state) => state.mode);
  const targetPath = useEditorStore((state) => state.targetPath);
  const storedToken = useEditorStore((state) => state.token);
  const storedRemember = useEditorStore((state) => state.remember);

  const [phase, setPhase] = useState<Phase>('signin');
  const [busy, setBusy] = useState(false);
  const [canWrite, setCanWrite] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [notice, setNotice] = useState<{ text: string; url: string | null } | null>(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(storedRemember);
  const [file, setFile] = useState<RemoteFile | null>(null);
  const [doc, setDoc] = useState<ParsedDocument>(emptyDocument);
  const [source, setSource] = useState('');
  const [tab, setTab] = useState<'fields' | 'source'>('fields');
  const [message, setMessage] = useState('');
  const [newPath, setNewPath] = useState('');
  const [movePath, setMovePath] = useState('');
  const [deleteArmed, setDeleteArmed] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  /** Where the branch's web address is, for the password hint. */
  const repoLabel = repo ? `${repo.owner}/${repo.repo}` : '';

  /** Turns a refusal from the path checker into a sentence. */
  const pathProblem = useCallback(
    (problem: PathProblem): string => {
      switch (problem) {
        case 'reserved':
          return t.editorPathReserved;
        case 'draft':
          return t.editorPathDraft;
        default:
          return t.editorPathInvalid;
      }
    },
    [t],
  );

  const describeError = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
  };

  // Escape closes, the page behind stops scrolling, and focus lands inside —
  // the same three things the mobile menu does, for the same reasons.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus();
    });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(raf);
    };
  }, [close]);

  // Signing in, then loading whatever the overlay was opened on.
  useEffect(() => {
    if (!storedToken) {
      setPhase('signin');
      return;
    }

    if (!repo) {
      setFailure({ text: t.editorPathInvalid });
      setPhase('signin');
      return;
    }

    let cancelled = false;

    const run = async () => {
      setPhase('loading');
      setFailure(null);
      setNotice(null);
      setCanWrite(false);

      try {
        const account = await verifyToken(storedToken, repo);
        if (cancelled) return;

        setLogin(account.login);

        if (!account.canPush) {
          setFailure({
            text: format(t.editorNoPush, { login: account.login, repo: repoLabel }),
          });
          setPhase('ready');
          return;
        }

        setCanWrite(true);
      } catch (error) {
        if (cancelled) return;
        setFailure({ text: t.editorAuthFailed, detail: describeError(error) });
        setPhase('ready');
        return;
      }

      if (mode === 'edit' && targetPath) {
        try {
          const found = await locate(storedToken, repo, targetPath);
          if (cancelled) return;

          if (!found) {
            setFailure({
              text: format(t.editorLoadFailed, { message: `content/${targetPath}.md` }),
            });
            setPhase('ready');
            return;
          }

          const parsed = parseDocument(found.content);

          setFile(found);
          setDoc(parsed);
          setSource(found.content);
          // A block this reader cannot rewrite safely opens as source, which is
          // the only mode that cannot lose what it does not understand.
          setTab(parsed.simple ? 'fields' : 'source');
          setMessage(format(t.editorMessageEdit, { path: targetPath }));
          setMovePath(targetPath);
          setDeleteArmed(false);
          setPhase('ready');
          return;
        } catch (error) {
          if (cancelled) return;
          setFailure({
            text: format(t.editorLoadFailed, { message: describeError(error) }),
          });
          setPhase('ready');
          return;
        }
      }

      setFile(null);
      setDoc(emptyDocument());
      setSource('');
      setTab('fields');
      setMessage('');
      setNewPath('');
      setPhase('ready');
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [storedToken, repo, repoLabel, mode, targetPath, t]);

  /** The text that would be committed right now. */
  const currentText = tab === 'source' ? source : renderDocument(doc);

  const unlock = async () => {
    const token = password.trim();
    if (!token) return;

    setBusy(true);
    setFailure(null);

    try {
      if (!repo) {
        setFailure({ text: t.editorAuthFailed });
        return;
      }

      const account = await verifyToken(token, repo);

      if (!account.canPush) {
        setFailure({ text: format(t.editorNoPush, { login: account.login, repo: repoLabel }) });
        return;
      }

      signIn(token, remember);
      setPassword('');
    } catch (error) {
      setFailure({ text: t.editorAuthFailed, detail: describeError(error) });
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!repo || !storedToken) return;

    setBusy(true);
    setFailure(null);
    setNotice(null);

    try {
      if (mode === 'new') {
        const title = asText(getField(doc, 'title'));
        const typed = newPath.trim();
        const check = checkPagePath(typed || suggestPagePath(title));

        if (!check.ok) {
          setFailure({ text: pathProblem(check.problem) });
          return;
        }

        const target = filePathFor(check.path);
        const existing = await readFile(storedToken, repo, target);

        if (existing) {
          setFailure({ text: format(t.editorPathTaken, { path: check.path }) });
          return;
        }

        const result = await writeFile(
          storedToken,
          repo,
          target,
          currentText,
          format(t.editorMessageCreate, { path: check.path }),
        );

        setNotice({
          text: format(t.editorCommitted, { path: check.path }),
          url: result.commitUrl,
        });
        return;
      }

      if (!file) return;

      if (currentText === file.content) {
        setFailure({ text: t.editorNoChanges });
        return;
      }

      const result = await writeFile(
        storedToken,
        repo,
        file.file,
        currentText,
        message.trim() || format(t.editorMessageEdit, { path: targetPath ?? file.file }),
        file.sha,
      );

      // The blob has a new revision, and the next save has to name it.
      setFile({ ...file, content: currentText, sha: result.sha ?? file.sha });
      setNotice({
        text: format(t.editorCommitted, { path: targetPath ?? file.file }),
        url: result.commitUrl,
      });
    } catch (error) {
      setFailure({ text: format(t.editorSaveFailed, { message: describeError(error) }) });
    } finally {
      setBusy(false);
    }
  };

  const move = async () => {
    if (!repo || !storedToken || !file || !targetPath) return;

    setBusy(true);
    setFailure(null);
    setNotice(null);

    try {
      const check = checkPagePath(movePath);

      if (!check.ok) {
        setFailure({ text: pathProblem(check.problem) });
        return;
      }

      const target = filePathFor(check.path);

      if (target === file.file) {
        setFailure({ text: t.editorNoChanges });
        return;
      }

      const existing = await readFile(storedToken, repo, target);

      if (existing) {
        setFailure({ text: format(t.editorPathTaken, { path: check.path }) });
        return;
      }

      // Moving a page breaks every link that arrived from outside the wiki, so
      // the old address is declared as an alias in the file's new home — the
      // same thing an author would do by hand, and the reason the move is two
      // commits rather than a rename.
      const parsed = parseDocument(currentText);
      const aliases = [...new Set([...asList(getField(parsed, 'aliases')), targetPath])];
      const moved = renderDocument(setField(parsed, 'aliases', aliases));

      const created = await writeFile(
        storedToken,
        repo,
        target,
        moved,
        format(t.editorMessageMove, { from: targetPath, to: check.path }),
      );

      await deleteFile(
        storedToken,
        repo,
        file.file,
        format(t.editorMessageDelete, { path: targetPath }),
        file.sha,
      );

      setFile({ file: target, sha: created.sha ?? '', content: moved });
      setMovePath(check.path);
      setNotice({
        text: format(t.editorCommitted, { path: check.path }),
        url: created.commitUrl,
      });
    } catch (error) {
      setFailure({ text: format(t.editorSaveFailed, { message: describeError(error) }) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!repo || !storedToken || !file || !targetPath) return;

    setBusy(true);
    setFailure(null);
    setNotice(null);

    try {
      await deleteFile(
        storedToken,
        repo,
        file.file,
        format(t.editorMessageDelete, { path: targetPath }),
        file.sha,
      );

      close();
      router.push('/');
    } catch (error) {
      setFailure({ text: format(t.editorSaveFailed, { message: describeError(error) }) });
    } finally {
      setBusy(false);
    }
  };

  const showSource = () => {
    if (tab === 'fields') setSource(renderDocument(doc));
    setTab('source');
  };

  const showFields = () => {
    const parsed = parseDocument(source);
    if (!parsed.simple) return;
    setDoc(parsed);
    setTab('fields');
  };

  const write = (key: EditableField, value: FieldValue | undefined) =>
    setDoc((current) => setField(current, key, value));

  const heading = mode === 'new' ? t.editorNewPage : t.editorTitle;
  const fieldRows = useMemo(
    () =>
      [
        { key: 'title' as const, label: t.editorFieldTitle, kind: 'text' as const },
        { key: 'description' as const, label: t.editorFieldDescription, kind: 'text' as const },
        { key: 'order' as const, label: t.editorFieldOrder, kind: 'number' as const },
        { key: 'tags' as const, label: t.editorFieldTags, kind: 'list' as const },
        { key: 'aliases' as const, label: t.editorFieldAliases, kind: 'list' as const },
        { key: 'updated' as const, label: t.editorFieldUpdated, kind: 'text' as const },
      ] satisfies Array<{
        key: EditableField;
        label: string;
        kind: 'text' | 'number' | 'list';
      }>,
    [t],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:p-6">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-heading"
        className="my-4 flex w-full max-w-3xl flex-col rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 print:hidden"
      >
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div className="min-w-0">
            <h2
              id="editor-heading"
              className="text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              {heading}
            </h2>
            <p className="mt-0.5 truncate font-mono text-xs text-gray-500 dark:text-gray-400">
              {mode === 'edit' && file ? file.file : repoLabel}
            </p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            {login && (
              <button
                type="button"
                onClick={signOut}
                title={t.editorSignOut}
                className="rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                {t.editorSignOut}
              </button>
            )}
            <button
              type="button"
              onClick={close}
              aria-label={t.editorClose}
              title={t.editorClose}
              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="min-h-[12rem] px-4 py-4">
          {phase === 'loading' && (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {login ? t.editorLoading : t.editorChecking}
            </p>
          )}

          {phase === 'signin' && (
            <form
              className="mx-auto max-w-sm space-y-3 py-4"
              onSubmit={(event) => {
                event.preventDefault();
                void unlock();
              }}
            >
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.editorPassword}
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  className={INPUT_CLASS}
                />
              </label>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(t.editorPasswordHint, { repo: repoLabel })}
              </p>

              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-700"
                />
                {t.editorRemember}
              </label>

              <button type="submit" disabled={busy || !password.trim()} className={BUTTON_PRIMARY}>
                {busy ? t.editorChecking : t.editorUnlock}
              </button>
            </form>
          )}

          {phase === 'ready' && (
            <div className="space-y-4">
              {failure && <FailureMessage failure={failure} />}

              {notice && (
                <p className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
                  {notice.text}
                  {notice.url && (
                    <>
                      {' '}
                      <a
                        href={notice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline"
                      >
                        {t.editorCommitLink}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </>
                  )}
                </p>
              )}

              {/* Nothing below can be committed without write access. */}
              {canWrite && (
                <>
                  {mode === 'new' && (
                    <div className="grid gap-3">
                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                          {t.editorPathLabel}
                        </span>
                        <input
                          value={newPath}
                          onChange={(event) => setNewPath(event.target.value)}
                          placeholder="guides/setup"
                          className={`${INPUT_CLASS} font-mono`}
                        />
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.editorPathHint}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={showFields}
                      disabled={!doc.simple}
                      aria-pressed={tab === 'fields'}
                      className={`rounded-md px-2 py-1 transition-colors ${
                        tab === 'fields'
                          ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      } disabled:opacity-40`}
                    >
                      {t.editorFieldsTab}
                    </button>
                    <button
                      type="button"
                      onClick={showSource}
                      aria-pressed={tab === 'source'}
                      className={`rounded-md px-2 py-1 transition-colors ${
                        tab === 'source'
                          ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      {t.editorSourceTab}
                    </button>
                  </div>

                  {tab === 'fields' ? (
                    <>
                      {!doc.simple && (
                        <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                          {t.editorFieldsUnavailable}
                        </p>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        {fieldRows.map((row) => (
                          <label key={row.key} className="block">
                            <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                              {row.label}
                            </span>
                            <input
                              value={asText(getField(doc, row.key))}
                              onChange={(event) => {
                                const raw = event.target.value;

                                if (row.kind === 'number') {
                                  const parsed = Number(raw.trim());
                                  write(
                                    row.key,
                                    raw.trim() === '' || Number.isNaN(parsed) ? undefined : parsed,
                                  );
                                  return;
                                }

                                if (row.kind === 'list') {
                                  const items = parseListField(raw);
                                  write(row.key, items.length ? items : undefined);
                                  return;
                                }

                                write(row.key, raw.trim() === '' ? undefined : raw);
                              }}
                              className={INPUT_CLASS}
                            />
                          </label>
                        ))}

                        <label className="flex items-center gap-2 pt-5 text-sm text-gray-700 dark:text-gray-200">
                          <input
                            type="checkbox"
                            checked={getField(doc, 'hidden') === true}
                            onChange={(event) =>
                              write('hidden', event.target.checked ? true : undefined)
                            }
                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-700"
                          />
                          {t.editorFieldHidden}
                        </label>
                      </div>

                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                          {t.editorFieldBody}
                        </span>
                        <textarea
                          value={doc.body.replace(/^\n+/, '')}
                          onChange={(event) =>
                            setDoc((current) => ({ ...current, body: event.target.value }))
                          }
                          rows={16}
                          spellCheck={false}
                          className={`${INPUT_CLASS} font-mono leading-relaxed`}
                        />
                      </label>
                    </>
                  ) : (
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                        {t.editorSourceTab}
                      </span>
                      <textarea
                        value={source}
                        onChange={(event) => setSource(event.target.value)}
                        rows={22}
                        spellCheck={false}
                        className={`${INPUT_CLASS} font-mono leading-relaxed`}
                      />
                    </label>
                  )}

                  {mode === 'edit' && (
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                        {t.editorFieldMessage}
                      </span>
                      <input
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        className={INPUT_CLASS}
                      />
                    </label>
                  )}

                  <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => void save()}
                      disabled={busy}
                      className={BUTTON_PRIMARY}
                    >
                      {mode === 'new' ? t.editorCreate : t.editorSave}
                    </button>
                    <button type="button" onClick={close} className={BUTTON_QUIET}>
                      {t.editorCancel}
                    </button>
                  </div>

                  {mode === 'edit' && file && (
                    <div className="grid gap-3 border-t border-gray-200 pt-3 dark:border-gray-800">
                      <div className="flex flex-wrap items-end gap-2">
                        <label className="min-w-[12rem] flex-1">
                          <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
                            {t.editorMove}
                          </span>
                          <input
                            value={movePath}
                            onChange={(event) => setMovePath(event.target.value)}
                            className={`${INPUT_CLASS} font-mono`}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => void move()}
                          disabled={busy}
                          className={BUTTON_QUIET}
                        >
                          {t.editorMove}
                        </button>
                      </div>

                      {deleteArmed ? (
                        <div className="flex flex-wrap items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 dark:border-red-900 dark:bg-red-950">
                          <span className="text-xs text-red-800 dark:text-red-200">
                            {format(t.editorDeleteConfirm, { path: targetPath ?? '' })}
                          </span>
                          <button
                            type="button"
                            onClick={() => void remove()}
                            disabled={busy}
                            className={BUTTON_DANGER}
                          >
                            {t.editorDelete}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteArmed(false)}
                            className={BUTTON_QUIET}
                          >
                            {t.editorCancel}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="button"
                            onClick={() => setDeleteArmed(true)}
                            disabled={busy}
                            className={BUTTON_DANGER}
                          >
                            {t.editorDelete}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Shows what went wrong, with the API's own words beneath when it had any. */
function FailureMessage({ failure }: { failure: Failure }) {
  return (
    <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
      {failure.text}
      {failure.detail && (
        <span className="mt-1 block font-mono text-xs opacity-80">{failure.detail}</span>
      )}
    </p>
  );
}

/**
 * Reads the file a page lives in.
 *
 * One request, because a page's path is its file's path: `ailan` is
 * `content/ailan.md` and nothing else, whether or not a folder of that name
 * sits beside it.
 */
async function locate(token: string, repo: RepoRef, pagePath: string): Promise<RemoteFile | null> {
  return readFile(token, repo, filePathFor(pagePath));
}
