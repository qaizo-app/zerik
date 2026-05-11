// Парсер inline-маркеров {{accent:слово}} {{em:слово}} {{votes_count}} {{user_name}}
// в RN-совместимый массив сегментов. Каждый сегмент — { kind, text } где kind
// один из 'plain' | 'accent' | 'em' | 'votes_count' | 'user_name'.
//
// Неизвестный маркер ({{xyz:что-то}}) не оставляет на экране сырые скобки —
// разметка вырезается, содержимое остаётся как plain. В DEV пишется warning,
// чтобы опечатки в авторстве контента ловились на раннем этапе.

const TOKEN_RE = /\{\{([a-zA-Z_]+)(?::([^}]+))?\}\}/g;
const STYLED = new Set(['accent', 'em']);
const DYNAMIC = new Set(['votes_count', 'user_name']);

export function parseInline(text) {
  if (typeof text !== 'string' || text.length === 0) return [{ kind: 'plain', text: '' }];

  const out = [];
  let lastIndex = 0;
  let match;

  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push({ kind: 'plain', text: text.slice(lastIndex, match.index) });
    }
    const name = match[1];
    const value = match[2];

    if (STYLED.has(name) && value !== undefined) {
      out.push({ kind: name, text: value });
    } else if (DYNAMIC.has(name) && value === undefined) {
      out.push({ kind: name, text: '' });
    } else {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`[inlineMarkers] Unknown marker {{${name}${value !== undefined ? ':' + value : ''}}} — falling back to plain text`);
      }
      out.push({ kind: 'plain', text: value !== undefined ? value : '' });
    }
    lastIndex = TOKEN_RE.lastIndex;
  }

  if (lastIndex < text.length) {
    out.push({ kind: 'plain', text: text.slice(lastIndex) });
  }

  return out;
}

// Подстановка динамических placeholders ({{votes_count}}, {{user_name}})
// перед рендером. Возвращает обновлённый массив сегментов.
export function fillDynamic(segments, dynamic = {}) {
  return segments.map(seg => {
    if (seg.kind === 'votes_count') {
      return { kind: 'plain', text: dynamic.votesCount != null ? String(dynamic.votesCount) : '—' };
    }
    if (seg.kind === 'user_name') {
      return { kind: 'plain', text: dynamic.userName || '' };
    }
    return seg;
  });
}
