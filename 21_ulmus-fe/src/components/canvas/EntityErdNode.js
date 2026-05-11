import React, { memo } from 'react';

/**
 * React Flow 커스텀 노드 — ERD 테이블 박스 (최소 표현).
 */
function EntityErdNode({ data, selected }) {
  const columns = data.columns?.length ? data.columns : ['id'];

  return (
    <article
      style={{
        minWidth: 200,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: selected
          ? '0 0 0 2px rgba(191, 255, 0, 0.6), 0 20px 50px rgba(0,0,0,0.45)'
          : '0 20px 50px rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(15,15,15,0.92)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <header
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: selected ? '#BFFF00' : 'rgba(191, 255, 0, 0.12)',
          color: selected ? '#000' : '#BFFF00',
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {data.label ?? 'TABLE'}
      </header>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        {columns.map((col) => (
          <li
            key={typeof col === 'string' ? col : col.name ?? col.id}
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              color: '#e2e8f0',
              fontSize: 12,
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {typeof col === 'string' ? col : col.name}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default memo(EntityErdNode);
