const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const os = require('os')

const TARGET_THEME_ID = 'ii-theme-generated'

function getColorsPath() {
  const cfg = vscode.workspace.getConfiguration('ii-theme').get('colorsPath')
  if (cfg && cfg.trim()) return cfg.trim()
  return path.join(os.homedir(), '.local', 'state', 'quickshell', 'user', 'generated', 'colors.json')
}

function hexFromArgb(argb) {
  const r = (argb >> 16) & 0xff
  const g = (argb >> 8) & 0xff
  const b = argb & 0xff
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function normalizeColor(val) {
  if (typeof val === 'number') return hexFromArgb(val)
  if (typeof val === 'string' && val.startsWith('#')) return val
  return val
}

function loadColors(colorsPath) {
  const raw = fs.readFileSync(colorsPath, 'utf8')
  const data = JSON.parse(raw)

  const scheme = data.schemes?.dark ?? data.scheme ?? data
  const palette = data.palettes ?? {}

  function c(key) {
    const v = scheme[key]
    return v !== undefined ? normalizeColor(v) : undefined
  }

  function p(family, tone) {
    const fam = palette[family]
    if (!fam) return undefined
    const entry = fam[tone] ?? fam[String(tone)]
    return entry !== undefined ? normalizeColor(entry) : undefined
  }

  return { c, p, scheme, palette }
}

function buildTheme(colorsPath) {
  const { c, p } = loadColors(colorsPath)

  const bg = c('background') ?? c('surface') ?? '#1c1c1e'
  const fg = c('onBackground') ?? c('onSurface') ?? '#e6e1e5'
  const primary = c('primary') ?? '#d0bcff'
  const onPrimary = c('onPrimary') ?? '#381e72'
  const primaryContainer = c('primaryContainer') ?? '#4f378b'
  const secondary = c('secondary') ?? '#ccc2dc'
  const tertiary = c('tertiary') ?? '#efb8c8'
  const error = c('error') ?? '#f2b8b5'
  const surface = c('surface') ?? bg
  const surfaceVariant = c('surfaceVariant') ?? '#49454f'
  const outline = c('outline') ?? '#938f99'
  const outlineVariant = c('outlineVariant') ?? '#49454f'
  const inverseSurface = c('inverseSurface') ?? '#e6e1e5'
  const inverseOnSurface = c('inverseOnSurface') ?? '#313033'
  const surfaceContainer = c('surfaceContainer') ?? c('surfaceContainerLow') ?? '#211f26'
  const surfaceContainerHigh = c('surfaceContainerHigh') ?? '#2b2930'
  const surfaceContainerHighest = c('surfaceContainerHighest') ?? '#36343b'

  const lineHighlight = surfaceVariant + '55'
  const selection = primary + '44'

  return {
    name: TARGET_THEME_ID,
    type: 'dark',
    colors: {
      'editor.background': bg,
      'editor.foreground': fg,
      'editor.lineHighlightBackground': lineHighlight,
      'editor.selectionBackground': selection,
      'editor.selectionHighlightBackground': primary + '33',
      'editor.wordHighlightBackground': secondary + '33',
      'editor.wordHighlightStrongBackground': secondary + '55',
      'editor.findMatchBackground': tertiary + '55',
      'editor.findMatchHighlightBackground': tertiary + '33',
      'editor.hoverHighlightBackground': primary + '22',
      'editor.inactiveSelectionBackground': selection + '88',
      'editorCursor.foreground': primary,
      'editorLineNumber.foreground': outline,
      'editorLineNumber.activeForeground': fg,
      'editorIndentGuide.background1': outlineVariant + '55',
      'editorIndentGuide.activeBackground1': outline,
      'editorWhitespace.foreground': outlineVariant,
      'editorRuler.foreground': outlineVariant,
      'editorBracketMatch.background': primary + '33',
      'editorBracketMatch.border': primary,
      'editorGutter.background': bg,
      'editorError.foreground': error,
      'editorWarning.foreground': tertiary,

      'activityBar.background': surface,
      'activityBar.foreground': fg,
      'activityBar.inactiveForeground': outline,
      'activityBar.border': outlineVariant + '44',
      'activityBarBadge.background': primary,
      'activityBarBadge.foreground': onPrimary,

      'sideBar.background': surfaceContainer,
      'sideBar.foreground': fg,
      'sideBar.border': outlineVariant + '44',
      'sideBarTitle.foreground': fg,
      'sideBarSectionHeader.background': surfaceContainerHigh,
      'sideBarSectionHeader.foreground': fg,

      'list.activeSelectionBackground': primaryContainer,
      'list.activeSelectionForeground': fg,
      'list.inactiveSelectionBackground': surfaceVariant + '66',
      'list.hoverBackground': surfaceVariant + '44',
      'list.focusBackground': primaryContainer + 'bb',
      'list.highlightForeground': primary,

      'titleBar.activeBackground': surface,
      'titleBar.activeForeground': fg,
      'titleBar.inactiveBackground': surface,
      'titleBar.inactiveForeground': outline,
      'titleBar.border': outlineVariant + '44',

      'statusBar.background': primary,
      'statusBar.foreground': onPrimary,
      'statusBar.noFolderBackground': secondary,
      'statusBar.debuggingBackground': error,
      'statusBar.border': 'transparent',
      'statusBarItem.hoverBackground': onPrimary + '33',
      'statusBarItem.remoteBackground': primaryContainer,
      'statusBarItem.remoteForeground': fg,

      'tab.activeBackground': surfaceContainerHigh,
      'tab.activeForeground': fg,
      'tab.inactiveBackground': surfaceContainer,
      'tab.inactiveForeground': outline,
      'tab.activeBorder': primary,
      'tab.border': outlineVariant + '33',
      'tab.hoverBackground': surfaceVariant + '44',
      'editorGroupHeader.tabsBackground': surfaceContainer,

      'panel.background': surfaceContainer,
      'panel.border': outlineVariant + '44',
      'panelTitle.activeForeground': primary,
      'panelTitle.inactiveForeground': outline,
      'panelTitle.activeBorder': primary,

      'terminal.background': bg,
      'terminal.foreground': fg,
      'terminal.selectionBackground': selection,
      'terminal.ansiBlack': surfaceContainerHighest,
      'terminal.ansiRed': error,
      'terminal.ansiGreen': c('tertiary') ?? '#b5ccb8',
      'terminal.ansiYellow': tertiary,
      'terminal.ansiBlue': primary,
      'terminal.ansiMagenta': c('secondary') ?? secondary,
      'terminal.ansiCyan': c('tertiary') ?? tertiary,
      'terminal.ansiWhite': fg,
      'terminal.ansiBrightBlack': outline,
      'terminal.ansiBrightRed': error,
      'terminal.ansiBrightGreen': c('tertiary') ?? '#b5ccb8',
      'terminal.ansiBrightYellow': tertiary,
      'terminal.ansiBrightBlue': primary,
      'terminal.ansiBrightMagenta': secondary,
      'terminal.ansiBrightCyan': tertiary,
      'terminal.ansiBrightWhite': inverseOnSurface,
      'terminalCursor.foreground': primary,

      'input.background': surfaceContainerHigh,
      'input.foreground': fg,
      'input.border': outline + '88',
      'input.placeholderForeground': outline,
      'inputOption.activeBorder': primary,
      'inputOption.activeBackground': primaryContainer + '88',
      'inputValidation.errorBorder': error,
      'inputValidation.warningBorder': tertiary,

      'button.background': primary,
      'button.foreground': onPrimary,
      'button.hoverBackground': primaryContainer,
      'button.secondaryBackground': surfaceVariant,
      'button.secondaryForeground': fg,

      'badge.background': primary,
      'badge.foreground': onPrimary,

      'scrollbarSlider.background': outline + '55',
      'scrollbarSlider.hoverBackground': outline + '88',
      'scrollbarSlider.activeBackground': primary + '88',

      'progressBar.background': primary,

      'dropdown.background': surfaceContainerHigh,
      'dropdown.foreground': fg,
      'dropdown.border': outline + '88',

      'pickerGroup.foreground': primary,
      'quickInput.background': surfaceContainerHigh,
      'quickInput.foreground': fg,
      'quickInputHighlight.background': primary + '33',
      'quickInputList.focusBackground': primaryContainer,

      'focusBorder': primary + 'bb',
      'foreground': fg,
      'selection.background': selection,
      'widget.shadow': '#00000055',

      'breadcrumb.foreground': outline,
      'breadcrumb.activeSelectionForeground': fg,
      'breadcrumb.focusForeground': primary,
      'breadcrumbPicker.background': surfaceContainerHigh,

      'menu.background': surfaceContainerHigh,
      'menu.foreground': fg,
      'menu.selectionBackground': primaryContainer,
      'menu.selectionForeground': fg,
      'menu.separatorBackground': outlineVariant,
      'menu.border': outlineVariant + '55',
      'menubar.selectionBackground': surfaceVariant + '66',
      'menubar.selectionForeground': fg,

      'notifications.background': surfaceContainerHigh,
      'notifications.foreground': fg,
      'notifications.border': outlineVariant + '55',
      'notificationCenterHeader.background': surfaceContainerHighest,
      'notificationCenterHeader.foreground': fg,
      'notificationLink.foreground': primary,

      'extensionButton.prominentBackground': primary,
      'extensionButton.prominentForeground': onPrimary,

      'gitDecoration.addedResourceForeground': c('tertiary') ?? '#b5ccb8',
      'gitDecoration.modifiedResourceForeground': primary,
      'gitDecoration.deletedResourceForeground': error,
      'gitDecoration.untrackedResourceForeground': secondary,
      'gitDecoration.ignoredResourceForeground': outline,
      'gitDecoration.conflictingResourceForeground': tertiary,

      'charts.foreground': fg,
      'charts.lines': outline,
      'charts.red': error,
      'charts.blue': primary,
      'charts.yellow': tertiary,
      'charts.orange': secondary,
      'charts.green': c('tertiary') ?? '#b5ccb8',
      'charts.purple': secondary,
    },
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: outline, fontStyle: 'italic' } },
      { scope: ['string', 'string.quoted'], settings: { foreground: c('tertiary') ?? tertiary } },
      { scope: ['string.template', 'string.interpolated'], settings: { foreground: c('tertiary') ?? tertiary } },
      { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: tertiary } },
      { scope: ['keyword', 'keyword.control', 'keyword.operator.new', 'storage.modifier'], settings: { foreground: primary } },
      { scope: ['storage.type', 'keyword.type'], settings: { foreground: primary, fontStyle: 'italic' } },
      { scope: ['entity.name.type', 'entity.name.class', 'entity.name.interface', 'support.class'], settings: { foreground: secondary } },
      { scope: ['entity.name.function', 'meta.function-call', 'support.function'], settings: { foreground: primary } },
      { scope: ['variable', 'variable.other'], settings: { foreground: fg } },
      { scope: ['variable.language'], settings: { foreground: primary, fontStyle: 'italic' } },
      { scope: ['variable.parameter'], settings: { foreground: tertiary, fontStyle: 'italic' } },
      { scope: ['entity.name.tag', 'meta.tag'], settings: { foreground: primary } },
      { scope: ['entity.other.attribute-name'], settings: { foreground: secondary } },
      { scope: ['support.type.property-name', 'meta.property-name'], settings: { foreground: secondary } },
      { scope: ['meta.property-value', 'support.constant.property-value'], settings: { foreground: c('tertiary') ?? tertiary } },
      { scope: ['punctuation.definition.tag', 'punctuation.separator', 'punctuation.terminator'], settings: { foreground: outline } },
      { scope: ['operator', 'keyword.operator'], settings: { foreground: fg } },
      { scope: ['import', 'meta.import', 'keyword.control.import', 'keyword.other.import'], settings: { foreground: primary } },
      { scope: ['invalid', 'invalid.illegal'], settings: { foreground: error, fontStyle: 'underline' } },
      { scope: ['markup.heading'], settings: { foreground: primary, fontStyle: 'bold' } },
      { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
      { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
      { scope: ['markup.underline'], settings: { fontStyle: 'underline' } },
      { scope: ['markup.strikethrough'], settings: { fontStyle: 'strikethrough' } },
      { scope: ['markup.inline.raw', 'markup.raw'], settings: { foreground: c('tertiary') ?? tertiary } },
      { scope: ['markup.quote'], settings: { foreground: outline, fontStyle: 'italic' } },
      { scope: ['meta.diff.range'], settings: { foreground: primary } },
      { scope: ['markup.inserted'], settings: { foreground: c('tertiary') ?? '#b5ccb8' } },
      { scope: ['markup.deleted'], settings: { foreground: error } },
      { scope: ['markup.changed'], settings: { foreground: tertiary } },
    ]
  }
}

async function applyTheme(context, colorsPath) {
  let theme
  try {
    theme = buildTheme(colorsPath)
  } catch (e) {
    vscode.window.showErrorMessage(`ii-theme: Failed to parse colors.json — ${e.message}`)
    return
  }

  const storagePath = context.globalStorageUri.fsPath
  fs.mkdirSync(storagePath, { recursive: true })
  const themeFile = path.join(storagePath, 'ii-generated-theme.json')
  fs.writeFileSync(themeFile, JSON.stringify(theme, null, 2))

  const themeContrib = {
    label: 'illogical-impulse (Generated)',
    uiTheme: 'vs-dark',
    path: themeFile
  }

  const pkgPath = path.join(context.extensionPath, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  pkg.contributes = pkg.contributes ?? {}
  pkg.contributes.themes = [themeContrib]
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))

  const current = vscode.workspace.getConfiguration('workbench').get('colorTheme')
  if (current === 'illogical-impulse (Generated)') {
    await vscode.commands.executeCommand('workbench.action.reloadWindow')
  } else {
    await vscode.workspace.getConfiguration('workbench').update('colorTheme', 'illogical-impulse (Generated)', vscode.ConfigurationTarget.Global)
  }
}

function activate(context) {
  const colorsPath = getColorsPath()

  context.subscriptions.push(
    vscode.commands.registerCommand('ii-theme.reload', () => applyTheme(context, getColorsPath()))
  )

  if (!fs.existsSync(colorsPath)) {
    vscode.window.showWarningMessage(
      `ii-theme: colors.json not found at ${colorsPath}. Is illogical-impulse installed and a wallpaper set?`
    )
    return
  }

  applyTheme(context, colorsPath)

  const watchEnabled = vscode.workspace.getConfiguration('ii-theme').get('watchFile')
  if (watchEnabled) {
    const watcher = fs.watch(colorsPath, (event) => {
      if (event === 'change') applyTheme(context, colorsPath)
    })
    context.subscriptions.push({ dispose: () => watcher.close() })
  }
}

function deactivate() {}

module.exports = { activate, deactivate }
