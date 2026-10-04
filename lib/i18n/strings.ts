/**
 * The wiki's own words — everything the interface says that the author did not
 * write.
 *
 * A page's content is whatever language it was written in, but the furniture
 * around it — the search box, the contents rail, the link to the next page —
 * was in English regardless, so a Korean wiki read as half-translated. These
 * are resolved once on the server from `global.lang` and handed to the client
 * tree as plain data, so a visitor downloads one language rather than all of
 * them.
 *
 * A value may contain `{placeholders}`; see {@link format}.
 */
export interface Strings {
  /** Visible label on the search control */
  search: string;
  /** Accessible name of the search dialog */
  searchDialog: string;
  /** Placeholder inside the search field */
  searchPlaceholder: string;
  /** Accessible name of the search field */
  searchQuery: string;
  /** Shown before anything has been typed */
  searchHint: string;
  /** Shown when a query matches nothing. `{query}` */
  searchEmpty: string;
  /** Shown when the index could not be fetched */
  searchError: string;
  /** Read out when results arrive. `{count}` */
  searchResults: string;
  /** Footer hint after the arrow keys */
  searchNavigateHint: string;
  /** Footer hint after the enter key */
  searchSelectHint: string;
  /** Footer hint after the escape key */
  searchCloseHint: string;

  /** Link to the repository the wiki is kept in */
  sourceRepository: string;
  /** Collapses the sidebar to its rail */
  collapseSidebar: string;
  /** Restores the full sidebar */
  expandSidebar: string;
  /** Folds a navigation section. `{name}` */
  collapseSection: string;
  /** Unfolds a navigation section. `{name}` */
  expandSection: string;
  /** Opens the navigation on a narrow screen */
  toggleMenu: string;
  /** Dismisses the navigation on a narrow screen */
  closeMenu: string;
  /** Jumps past the navigation to the article */
  skipToContent: string;
  /** Accessible name of the site navigation */
  navigation: string;
  /** Accessible name of the breadcrumb trail */
  breadcrumb: string;
  /** Steps back through visited pages */
  goBack: string;
  /** Steps forward again */
  goForward: string;
  /** Switches to the light theme */
  switchToLight: string;
  /** Switches to the dark theme */
  switchToDark: string;

  /** Opens another tab */
  newTab: string;
  /** Name a tab carries before it holds a page */
  newTabTitle: string;
  /** Closes a tab */
  closeTab: string;
  /** Accessible name of the tab strip */
  tabs: string;
  /** Accessible name of a tab's context menu */
  tabActions: string;
  /** Closes every tab but this one */
  closeOtherTabs: string;
  /** Closes every tab after this one */
  closeTabsToRight: string;

  /** Heading above the contents rail */
  onThisPage: string;
  /** Accessible name of the previous/next pair */
  pageNavigation: string;
  /** Label above the preceding page */
  previous: string;
  /** Label above the following page */
  next: string;
  /** Accessible name of the tag row */
  tags: string;
  /** Heading above the pages linking here, when there is one. `{count}` */
  linkedFromOne: string;
  /** Heading above the pages linking here. `{count}` */
  linkedFromMany: string;
  /** Heading above the neighbourhood graph, when there is one. `{count}` */
  connectedToOne: string;
  /** Heading above the neighbourhood graph. `{count}` */
  connectedToMany: string;
  /** States when the page last changed. `{date}` */
  lastUpdated: string;
  /** Link to the page's source */
  editThisPage: string;
  /** Resting label on a code block's copy button */
  copy: string;
  /** Confirmation shown after copying */
  copied: string;
  /** Accessible name of a heading's own link. `{title}` */
  linkToSection: string;
  /** Precedes the source of included content */
  includedFrom: string;
  /** Accessible name of a diagram drawn from a fence */
  diagram: string;

  /** Opens the viewer from the first-page preview. `{name}` */
  pdfOpen: string;
  /** The same, on the button itself, where the name is already beside it */
  pdfOpenShort: string;
  /** Shown while an embedded document is being opened */
  pdfLoading: string;
  /** Shown when an embedded document cannot be opened */
  pdfError: string;
  /** Accessible name of the document viewer. `{name}` */
  pdfDocument: string;
  /** Where the reader is in the document. `{page}`, `{pages}` */
  pdfPageOf: string;
  /** Goes back one page */
  pdfPrevious: string;
  /** Goes forward one page */
  pdfNext: string;
  /** Makes the pages larger */
  pdfZoomIn: string;
  /** Makes the pages smaller */
  pdfZoomOut: string;
  /** Saves the document */
  pdfDownload: string;
  /** Fills the screen with the viewer */
  pdfFullscreen: string;
  /** Returns the viewer to the page */
  pdfExitFullscreen: string;

  /** Heading on a former address */
  pageMoved: string;
  /** Explains the forwarding on a former address */
  pageMovedBody: string;
  /** Link to the page that superseded the address. `{title}` */
  continueTo: string;

  /** Heading on the 404 page */
  notFound: string;
  /** What went wrong, on the 404 page */
  notFoundBody: string;
  /** What to do about it, on the 404 page */
  notFoundHint: string;
  /** Link back to the front page */
  goHome: string;

  /** Heading when something went wrong rendering a page */
  error: string;
  /** What to do about an ordinary error */
  errorBody: string;
  /** Heading when the page could not be rendered at all */
  criticalError: string;
  /** What to do about a critical error */
  criticalErrorBody: string;
  /** Retries rendering */
  tryAgain: string;

  /** Heading on the whole-site graph */
  graph: string;
  /** What the whole-site graph shows */
  graphDescription: string;
  /** Accessible name of the drawn graph. `{pages}`, `{links}` */
  graphLabel: string;
  /** Shown in place of a graph with nothing in it */
  graphEmpty: string;
  /** Sizes up the graph. `{pages}`, `{links}`, `{connected}` */
  graphSummary: string;
  /** How to read the graph */
  graphHint: string;
  /** Makes the graph bigger */
  graphZoomIn: string;
  /** Makes the graph smaller */
  graphZoomOut: string;
  /** Returns the graph to its fitted view */
  graphResetView: string;
  /** Heading above the links that resolve to nothing. `{count}` */
  unresolvedLinks: string;
  /** One unresolved link. `{target}`, `{page}` */
  unresolvedLink: string;
  /** Why an unresolved link is ambiguous. `{candidates}` */
  unresolvedAmbiguous: string;
  /** Heading above the pages the wiki refers to but does not have. `{count}` */
  wantedPages: string;
  /** How many pages are asking for a wanted page. `{count}` */
  wantedBy: string;

  /** Opens the in-browser editor on the page being read */
  editorOpenHere: string;
  /** Opens the in-browser editor with a blank page */
  editorNewPage: string;
  /** Heading of the editor dialog */
  editorTitle: string;
  /** Closes the editor */
  editorClose: string;
  /** Dismisses the editor without committing */
  editorCancel: string;
  /** Label of the password field */
  editorPassword: string;
  /** Explains what the password is. `{repo}` */
  editorPasswordHint: string;
  /** Keeps the password on this device */
  editorRemember: string;
  /** Submits the password */
  editorUnlock: string;
  /** Shown while the password is being checked */
  editorChecking: string;
  /** Forgets the stored password */
  editorSignOut: string;
  /** Shown when the password was refused */
  editorAuthFailed: string;
  /** Shown when the account cannot write to the repository. `{login}`, `{repo}` */
  editorNoPush: string;
  /** Shown while a page is being fetched */
  editorLoading: string;
  /** Shown when a page could not be fetched. `{message}` */
  editorLoadFailed: string;
  /** Shown when a commit was refused. `{message}` */
  editorSaveFailed: string;
  /** Confirms a commit. `{path}` */
  editorCommitted: string;
  /** Links to the commit where it was made */
  editorCommitLink: string;
  /** Label of the frontmatter field editor */
  editorFieldsTab: string;
  /** Label of the raw source editor */
  editorSourceTab: string;
  /** Shown when the field editor must not be used */
  editorFieldsUnavailable: string;
  /** Frontmatter field: the page's title */
  editorFieldTitle: string;
  /** Frontmatter field: the page's description */
  editorFieldDescription: string;
  /** Frontmatter field: sort weight */
  editorFieldOrder: string;
  /** Frontmatter field: subjects the page belongs to */
  editorFieldTags: string;
  /** Frontmatter field: keep the page out of navigation */
  editorFieldHidden: string;
  /** Frontmatter field: paths the page used to live at */
  editorFieldAliases: string;
  /** Frontmatter field: when the page was last revised */
  editorFieldUpdated: string;
  /** Label of the Markdown body */
  editorFieldBody: string;
  /** Label of the commit message */
  editorFieldMessage: string;
  /** Default commit message for an edit. `{path}` */
  editorMessageEdit: string;
  /** Default commit message for a new page. `{path}` */
  editorMessageCreate: string;
  /** Default commit message for a move. `{from}`, `{to}` */
  editorMessageMove: string;
  /** Default commit message for a removal. `{path}` */
  editorMessageDelete: string;
  /** Saves the page */
  editorSave: string;
  /** Creates the page */
  editorCreate: string;
  /** Label of the path a new page is written to */
  editorPathLabel: string;
  /** How a path is written, and what naming it after a folder does */
  editorPathHint: string;
  /** Shown when a page already occupies the path. `{path}` */
  editorPathTaken: string;
  /** Shown when there is nothing to commit */
  editorNoChanges: string;
  /** Shown when a path cannot be used at all */
  editorPathInvalid: string;
  /** Shown when a path is reserved by the site itself */
  editorPathReserved: string;
  /** Shown when a path would never be published */
  editorPathDraft: string;
  /** Label of the move control */
  editorMove: string;
  /** Deletes the page */
  editorDelete: string;
  /** Asks before deleting. `{path}` */
  editorDeleteConfirm: string;
}

/**
 * The default language, and the fallback for every other.
 *
 * A missing translation shows English rather than the key itself: a reader who
 * meets one unexpected English word can still use the control, and one who
 * meets `searchPlaceholder` cannot.
 */
const EN: Strings = {
  search: 'Search…',
  searchDialog: 'Search documentation',
  searchPlaceholder: 'Search documentation…',
  searchQuery: 'Search query',
  searchHint: 'Search titles, headings, and page contents.',
  searchEmpty: 'No results for “{query}”',
  searchError: 'Search is unavailable. Try reloading the page.',
  searchResults: '{count} results',
  searchNavigateHint: 'to navigate',
  searchSelectHint: 'to select',
  searchCloseHint: 'to close',

  sourceRepository: 'Source repository',
  collapseSidebar: 'Collapse sidebar',
  expandSidebar: 'Expand sidebar',
  collapseSection: 'Collapse {name}',
  expandSection: 'Expand {name}',
  toggleMenu: 'Toggle menu',
  closeMenu: 'Close menu',
  skipToContent: 'Skip to content',
  navigation: 'Navigation',
  breadcrumb: 'Breadcrumb',
  goBack: 'Go back',
  goForward: 'Go forward',
  switchToLight: 'Switch to light mode',
  switchToDark: 'Switch to dark mode',

  newTab: 'New tab',
  newTabTitle: 'New Tab',
  closeTab: 'Close tab',
  tabs: 'Tabs',
  tabActions: 'Tab actions',
  closeOtherTabs: 'Close others',
  closeTabsToRight: 'Close to the right',

  onThisPage: 'On this page',
  pageNavigation: 'Page navigation',
  previous: 'Previous',
  next: 'Next',
  tags: 'Tags',
  linkedFromOne: 'Linked from {count} page',
  linkedFromMany: 'Linked from {count} pages',
  connectedToOne: 'Connected to {count} page',
  connectedToMany: 'Connected to {count} pages',
  lastUpdated: 'Last updated on {date}',
  editThisPage: 'Edit this page',
  copy: 'Copy',
  copied: 'Copied',
  linkToSection: 'Link to this section: {title}',
  includedFrom: 'From ',
  diagram: 'Diagram',

  pdfOpen: 'Open {name}',
  pdfOpenShort: 'Open',
  pdfLoading: 'Opening document…',
  pdfError: 'This document could not be shown.',
  pdfDocument: '{name}, document viewer',
  pdfPageOf: 'Page {page} of {pages}',
  pdfPrevious: 'Previous page',
  pdfNext: 'Next page',
  pdfZoomIn: 'Zoom in',
  pdfZoomOut: 'Zoom out',
  pdfDownload: 'Download',
  pdfFullscreen: 'Full screen',
  pdfExitFullscreen: 'Exit full screen',

  pageMoved: 'This page moved',
  pageMovedBody: 'You are being taken there now. If nothing happens, follow the link.',
  continueTo: 'Continue to {title}',

  notFound: 'Page not found',
  notFoundBody: 'The page you’re looking for doesn’t exist or has been moved.',
  notFoundHint: 'Try using the navigation sidebar to find what you’re looking for.',
  goHome: 'Go back home',

  error: 'Something went wrong',
  errorBody: 'This page could not be shown. Trying again may be enough.',
  criticalError: 'Critical error',
  criticalErrorBody: 'The page could not be loaded at all. Refreshing may be enough.',
  tryAgain: 'Try again',

  graph: 'Graph',
  graphDescription: 'How the pages in this wiki link to one another.',
  graphLabel: 'Link graph of {pages} pages and {links} links',
  graphEmpty: 'No pages to graph yet.',
  graphSummary:
    '{pages} pages, {links} links. {connected} pages are connected to at least one other.',
  graphHint:
    'Hover a node to isolate its neighbours; click to open the page, drag to pan, and scroll or pinch to zoom.',
  graphZoomIn: 'Zoom in',
  graphZoomOut: 'Zoom out',
  graphResetView: 'Reset view',
  unresolvedLinks: 'Unresolved links ({count})',
  unresolvedLink: '{target} in {page}',
  unresolvedAmbiguous: 'matches {candidates}',
  wantedPages: 'Wanted pages ({count})',
  wantedBy: 'wanted by {count}',

  editorOpenHere: 'Edit here',
  editorNewPage: 'New page',
  editorTitle: 'In-browser editor',
  editorClose: 'Close editor',
  editorCancel: 'Cancel',
  editorPassword: 'Password',
  editorPasswordHint:
    'A GitHub token with write access to {repo}. It is kept in this browser and sent only to api.github.com.',
  editorRemember: 'Remember on this device',
  editorUnlock: 'Unlock',
  editorChecking: 'Checking…',
  editorSignOut: 'Sign out',
  editorAuthFailed: 'That password was refused. Check the token and its permissions.',
  editorNoPush: '{login} cannot write to {repo}.',
  editorLoading: 'Loading the page…',
  editorLoadFailed: 'The page could not be loaded: {message}',
  editorSaveFailed: 'Committing failed: {message}',
  editorCommitted: 'Committed {path}. The site updates when the next build finishes.',
  editorCommitLink: 'View commit',
  editorFieldsTab: 'Fields',
  editorSourceTab: 'Source',
  editorFieldsUnavailable:
    'This frontmatter is too complex for the field editor, so the source is shown instead.',
  editorFieldTitle: 'Title',
  editorFieldDescription: 'Description',
  editorFieldOrder: 'Order',
  editorFieldTags: 'Tags',
  editorFieldHidden: 'Hide from navigation',
  editorFieldAliases: 'Aliases',
  editorFieldUpdated: 'Updated',
  editorFieldBody: 'Body',
  editorFieldMessage: 'Commit message',
  editorMessageEdit: 'docs: edit {path}',
  editorMessageCreate: 'docs: add {path}',
  editorMessageMove: 'docs: move {from} to {to}',
  editorMessageDelete: 'docs: remove {path}',
  editorSave: 'Save',
  editorCreate: 'Create page',
  editorPathLabel: 'Path',
  editorPathHint:
    'Like guides/setup. Name it after a folder — ailan beside ailan/ — and the page heads that folder’s pages in the sidebar.',
  editorPathTaken: 'A page already exists at {path}.',
  editorNoChanges: 'Nothing has changed yet.',
  editorPathInvalid: 'That path cannot be used as a file name.',
  editorPathReserved: 'That name is kept by the site itself.',
  editorPathDraft: 'Names starting with “_” or “.” are drafts, and are never published.',
  editorMove: 'Move or rename',
  editorDelete: 'Delete page',
  editorDeleteConfirm: 'Delete {path}? The removal is committed to the repository.',
};

const KO: Strings = {
  search: '검색…',
  searchDialog: '문서 검색',
  searchPlaceholder: '문서 검색…',
  searchQuery: '검색어',
  searchHint: '제목, 소제목, 본문에서 찾습니다.',
  searchEmpty: '“{query}” 검색 결과가 없습니다',
  searchError: '검색을 사용할 수 없습니다. 페이지를 새로고침해 보세요.',
  searchResults: '검색 결과 {count}개',
  searchNavigateHint: '이동',
  searchSelectHint: '선택',
  searchCloseHint: '닫기',

  sourceRepository: '소스 저장소',
  collapseSidebar: '사이드바 접기',
  expandSidebar: '사이드바 펼치기',
  collapseSection: '{name} 접기',
  expandSection: '{name} 펼치기',
  toggleMenu: '메뉴 열고 닫기',
  closeMenu: '메뉴 닫기',
  skipToContent: '본문으로 건너뛰기',
  navigation: '탐색',
  breadcrumb: '현재 위치',
  goBack: '뒤로 가기',
  goForward: '앞으로 가기',
  switchToLight: '밝은 화면으로 전환',
  switchToDark: '어두운 화면으로 전환',

  newTab: '새 탭',
  newTabTitle: '새 탭',
  closeTab: '탭 닫기',
  tabs: '탭',
  tabActions: '탭 메뉴',
  closeOtherTabs: '다른 탭 닫기',
  closeTabsToRight: '오른쪽 탭 닫기',

  onThisPage: '이 페이지의 목차',
  pageNavigation: '페이지 이동',
  previous: '이전',
  next: '다음',
  tags: '태그',
  // Korean does not inflect for number, so both forms are the same sentence.
  linkedFromOne: '이 페이지를 가리키는 문서 {count}개',
  linkedFromMany: '이 페이지를 가리키는 문서 {count}개',
  connectedToOne: '연결된 문서 {count}개',
  connectedToMany: '연결된 문서 {count}개',
  lastUpdated: '마지막 수정: {date}',
  editThisPage: '이 페이지 편집',
  copy: '복사',
  copied: '복사됨',
  linkToSection: '이 절로 가는 링크: {title}',
  includedFrom: '출처: ',
  diagram: '다이어그램',

  pdfOpen: '{name} 열기',
  pdfOpenShort: '열기',
  pdfLoading: '문서를 여는 중…',
  pdfError: '이 문서를 표시하지 못했습니다.',
  pdfDocument: '{name} 문서 뷰어',
  pdfPageOf: '{pages}쪽 중 {page}쪽',
  pdfPrevious: '이전 쪽',
  pdfNext: '다음 쪽',
  pdfZoomIn: '확대',
  pdfZoomOut: '축소',
  pdfDownload: '내려받기',
  pdfFullscreen: '전체 화면',
  pdfExitFullscreen: '전체 화면 끝내기',

  pageMoved: '이 페이지는 옮겨졌습니다',
  pageMovedBody: '곧 새 주소로 이동합니다. 이동하지 않으면 아래 링크를 눌러 주세요.',
  continueTo: '{title}(으)로 이동',

  notFound: '페이지를 찾을 수 없습니다',
  notFoundBody: '찾으시는 페이지가 없거나 다른 주소로 옮겨졌습니다.',
  notFoundHint: '왼쪽 사이드바에서 찾아보세요.',
  goHome: '첫 페이지로',

  error: '문제가 발생했습니다',
  errorBody: '이 페이지를 표시하지 못했습니다. 다시 시도해 보세요.',
  criticalError: '심각한 오류',
  criticalErrorBody: '페이지를 불러오지 못했습니다. 새로고침해 보세요.',
  tryAgain: '다시 시도',

  graph: '그래프',
  graphDescription: '이 위키의 문서들이 서로 어떻게 이어져 있는지 보여줍니다.',
  graphLabel: '문서 {pages}개와 링크 {links}개의 연결 그래프',
  graphEmpty: '아직 그릴 문서가 없습니다.',
  graphSummary: '문서 {pages}개, 링크 {links}개. 그중 {connected}개가 다른 문서와 이어져 있습니다.',
  graphHint:
    '노드에 마우스를 올리면 이웃만 남고, 클릭하면 해당 문서로 이동합니다. 드래그로 이동하고, 스크롤이나 두 손가락으로 확대·축소할 수 있습니다.',
  graphZoomIn: '확대',
  graphZoomOut: '축소',
  graphResetView: '보기 초기화',
  unresolvedLinks: '연결되지 않은 링크 ({count})',
  unresolvedLink: '{page}의 {target}',
  unresolvedAmbiguous: '{candidates}에 모두 해당',
  wantedPages: '아직 없는 문서 ({count})',
  wantedBy: '{count}개 문서가 참조',

  editorOpenHere: '여기서 편집',
  editorNewPage: '새 문서',
  editorTitle: '브라우저 편집기',
  editorClose: '편집기 닫기',
  editorCancel: '취소',
  editorPassword: '비밀번호',
  editorPasswordHint:
    '{repo}에 쓰기 권한이 있는 GitHub 토큰입니다. 이 브라우저에만 보관되고 api.github.com으로만 전송됩니다.',
  editorRemember: '이 기기에 기억',
  editorUnlock: '잠금 해제',
  editorChecking: '확인 중…',
  editorSignOut: '로그아웃',
  editorAuthFailed: '비밀번호가 거부되었습니다. 토큰과 권한을 확인하세요.',
  editorNoPush: '{login}은(는) {repo}에 쓸 수 없습니다.',
  editorLoading: '문서를 불러오는 중…',
  editorLoadFailed: '문서를 불러오지 못했습니다: {message}',
  editorSaveFailed: '커밋하지 못했습니다: {message}',
  editorCommitted: '{path}을(를) 커밋했습니다. 다음 빌드가 끝나면 사이트에 반영됩니다.',
  editorCommitLink: '커밋 보기',
  editorFieldsTab: '필드',
  editorSourceTab: '소스',
  editorFieldsUnavailable: '이 프런트매터는 필드 편집기로 다루기 어려워 소스를 대신 표시합니다.',
  editorFieldTitle: '제목',
  editorFieldDescription: '설명',
  editorFieldOrder: '순서',
  editorFieldTags: '태그',
  editorFieldHidden: '탐색에서 숨기기',
  editorFieldAliases: '별칭',
  editorFieldUpdated: '수정일',
  editorFieldBody: '본문',
  editorFieldMessage: '커밋 메시지',
  editorMessageEdit: 'docs: {path} 편집',
  editorMessageCreate: 'docs: {path} 추가',
  editorMessageMove: 'docs: {from}을(를) {to}(으)로 이동',
  editorMessageDelete: 'docs: {path} 삭제',
  editorSave: '저장',
  editorCreate: '문서 만들기',
  editorPathLabel: '경로',
  editorPathHint:
    'guides/setup처럼 입력합니다. 폴더와 같은 이름으로 지으면(ailan/ 옆의 ailan) 그 문서가 그 폴더의 문서들을 이끕니다.',
  editorPathTaken: '{path}에 이미 문서가 있습니다.',
  editorNoChanges: '아직 바뀐 내용이 없습니다.',
  editorPathInvalid: '그 경로는 파일 이름으로 쓸 수 없습니다.',
  editorPathReserved: '그 이름은 사이트가 직접 사용합니다.',
  editorPathDraft: '“_”나 “.”로 시작하는 이름은 초안으로 취급되어 게시되지 않습니다.',
  editorMove: '이동 또는 이름 변경',
  editorDelete: '문서 삭제',
  editorDeleteConfirm: '{path}을(를) 삭제할까요? 삭제도 저장소에 커밋됩니다.',
};

const ZH: Strings = {
  search: '搜索…',
  searchDialog: '搜索文档',
  searchPlaceholder: '搜索文献…',
  searchQuery: '搜索词',
  searchHint: '可搜索标题、章节和页面内容。',
  searchEmpty: '未找到“{query}”的相关内容',
  searchError: '搜索服务暂时不可用，请刷新页面后重试。',
  searchResults: '共 {count} 个结果',
  searchNavigateHint: '上下导航',
  searchSelectHint: '确认选择',
  searchCloseHint: '关闭',

  sourceRepository: '源代码仓库',
  collapseSidebar: '收起侧边栏',
  expandSidebar: '展开侧边栏',
  collapseSection: '收起 {name}',
  expandSection: '展开 {name}',
  toggleMenu: '切换菜单',
  closeMenu: '关闭菜单',
  skipToContent: '跳至正文',
  navigation: '导航',
  breadcrumb: '面包屑',
  goBack: '后退',
  goForward: '前进',
  switchToLight: '切换至浅色模式',
  switchToDark: '切换至深色模式',

  newTab: '新建标签',
  newTabTitle: '新标签页',
  closeTab: '关闭标签',
  tabs: '标签栏',
  tabActions: '标签操作',
  closeOtherTabs: '关闭其他标签',
  closeTabsToRight: '关闭右侧标签',

  onThisPage: '本页目录',
  pageNavigation: '页面导航',
  previous: '上一页',
  next: '下一页',
  tags: '标签',
  linkedFromOne: '被 {count} 个页面引用',
  linkedFromMany: '被 {count} 个页面引用',
  connectedToOne: '与 {count} 个页面关联',
  connectedToMany: '与 {count} 个页面关联',
  lastUpdated: '最后更新于 {date}',
  editThisPage: '编辑本页',
  copy: '复制',
  copied: '已复制',
  linkToSection: '复制章节链接：{title}',
  includedFrom: '引用自 ',
  diagram: '图表',

  pdfOpen: '打开 {name}',
  pdfOpenShort: '打开',
  pdfLoading: '正在打开文档…',
  pdfError: '无法显示该文档。',
  pdfDocument: '{name} — 文档查看器',
  pdfPageOf: '第 {page} 页 / 共 {pages} 页',
  pdfPrevious: '上一页',
  pdfNext: '下一页',
  pdfZoomIn: '放大',
  pdfZoomOut: '缩小',
  pdfDownload: '下载',
  pdfFullscreen: '全屏',
  pdfExitFullscreen: '退出全屏',

  pageMoved: '页面已迁移',
  pageMovedBody: '正在将您跳转到新位置。若未自动跳转，请点击下方链接。',
  continueTo: '继续前往 {title}',

  notFound: '找不到页面',
  notFoundBody: '您访问的页面不存在或已被移走。',
  notFoundHint: '请尝试使用侧边栏导航查找所需内容。',
  goHome: '返回首页',

  error: '出错了',
  errorBody: '页面加载失败，刷新一下或许能解决。',
  criticalError: '严重错误',
  criticalErrorBody: '页面完全无法加载，请尝试刷新。',
  tryAgain: '重试',

  graph: '页面关系图',
  graphDescription: '展示本维基中各页面之间的链接结构。',
  graphLabel: '{pages} 个页面，{links} 条链接的关系图',
  graphEmpty: '暂无页面可绘制关系图。',
  graphSummary: '共 {pages} 个页面，{links} 条链接，其中 {connected} 个页面至少与其他页面相连。',
  graphHint: '悬停节点可高亮其相邻节点，点击可打开页面，拖动可平移视角，滚动或双指可缩放。',
  graphZoomIn: '放大',
  graphZoomOut: '缩小',
  graphResetView: '重置视图',
  unresolvedLinks: '断链（{count}）',
  unresolvedLink: '{page} 中的 {target}',
  unresolvedAmbiguous: '匹配到 {candidates} 个候选',
  wantedPages: '待建页面（{count}）',
  wantedBy: '被 {count} 个页面引用',

  editorOpenHere: '在此编辑',
  editorNewPage: '新建页面',
  editorTitle: '浏览器编辑器',
  editorClose: '关闭编辑器',
  editorCancel: '取消',
  editorPassword: '密码',
  editorPasswordHint:
    '对 {repo} 有写权限的 GitHub Token。它只保存在本浏览器中，且只发送给 api.github.com。',
  editorRemember: '在此设备上记住',
  editorUnlock: '解锁',
  editorChecking: '验证中…',
  editorSignOut: '退出',
  editorAuthFailed: '密码被拒绝，请检查 Token 及其权限。',
  editorNoPush: '{login} 无权写入 {repo}。',
  editorLoading: '正在载入页面…',
  editorLoadFailed: '页面载入失败：{message}',
  editorSaveFailed: '提交失败：{message}',
  editorCommitted: '已提交 {path}。网站会在下一次构建完成后更新。',
  editorCommitLink: '查看提交',
  editorFieldsTab: '字段',
  editorSourceTab: '源码',
  editorFieldsUnavailable: '该页面的 frontmatter 过于复杂，已改为显示源码。',
  editorFieldTitle: '标题',
  editorFieldDescription: '描述',
  editorFieldOrder: '排序',
  editorFieldTags: '标签',
  editorFieldHidden: '从导航中隐藏',
  editorFieldAliases: '别名',
  editorFieldUpdated: '更新日期',
  editorFieldBody: '正文',
  editorFieldMessage: '提交信息',
  editorMessageEdit: 'docs: 编辑 {path}',
  editorMessageCreate: 'docs: 新增 {path}',
  editorMessageMove: 'docs: 移动 {from} 到 {to}',
  editorMessageDelete: 'docs: 删除 {path}',
  editorSave: '保存',
  editorCreate: '创建页面',
  editorPathLabel: '路径',
  editorPathHint:
    '例如 guides/setup。与某个目录同名时（目录 ailan/ 旁的 ailan），该页面会成为那个目录下页面的父页面。',
  editorPathTaken: '{path} 已有页面存在。',
  editorNoChanges: '还没有任何改动。',
  editorPathInvalid: '该路径不能用作文件名。',
  editorPathReserved: '该名称由站点自身占用。',
  editorPathDraft: '以“_”或“.”开头的名称属于草稿，永远不会被发布。',
  editorMove: '移动/重命名',
  editorDelete: '删除页面',
  editorDeleteConfirm: '确定删除 {path}？删除同样会提交到仓库。',
};

/**
 * Every language the interface is translated into.
 *
 * Keyed by primary subtag. A wiki in a language not listed here writes its own
 * words through `global.strings` rather than waiting for a translation to be
 * contributed — see {@link resolveStrings}.
 */
const TABLES: Record<string, Strings> = {
  en: EN,
  ko: KO,
  zh: ZH,
};

/**
 * Chooses the interface language and applies any per-wiki wording.
 *
 * `lang` is a BCP 47 tag, so it may carry a region — `ko-KR` and `ko` want the
 * same table. Anything unrecognised falls back to English, which is wrong but
 * usable, unlike a half-resolved interface.
 *
 * @param lang - BCP 47 tag from `global.lang`
 * @param overrides - Individual replacements from `global.strings`
 * @returns A complete set of strings
 *
 * @example
 * ```typescript
 * resolveStrings('ko-KR').onThisPage; // '이 페이지의 목차'
 * resolveStrings('de', { search: 'Suchen…' }).search; // 'Suchen…'
 * ```
 */
export function resolveStrings(lang?: string, overrides?: Partial<Strings>): Strings {
  const tag = (lang || 'en').toLowerCase();
  const table = TABLES[tag] || TABLES[tag.split('-')[0]] || EN;

  return overrides ? { ...table, ...overrides } : table;
}

export { EN as DEFAULT_STRINGS };
export { format } from './format';
