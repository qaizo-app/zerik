// Парсер inline-маркеров {{accent:слово}} {{em:слово}} {{votes_count}} {{user_name}}
// в RN-совместимый массив сегментов. Каждый сегмент — { kind, text } где kind
// один из 'plain' | 'accent' | 'em' | 'votes_count' | 'user_name'.

const TOKEN_RE = /\{\{(accent|em):([^}]+)\}\}|\{\{(votes_count|user_name)\}\}/g;

export function parseInline(text) {
  if (typeof text !== 'string' || text.length === 0) return [{ kind: 'plain', text: '' }];

  const out = [];
  let lastIndex = 0;
  let match;

  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push({ kind: 'plain', text: text.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      out.push({ kind: match[1], text: match[2] });
    } else if (match[3]) {
      out.push({ kind: match[3], text: '' });
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
