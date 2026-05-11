import React, { memo } from 'react';

/**
 * React Flow 커스텀 노드 — ERD 테이블 박스 (최소 표현).
 */
const mockErdData1 = {
  id: 'erd1',
  label: 'Users', // RelationNode2.js의 data.label에 해당하는 필드
  comment: '사용자 정보 테이블',
  columns: [
    { columnName: 'user_id', comment: '사용자 고유 ID', type: 'INT', length: 11, isPrimaryKey: true, isUnique: true, isNullable: false, isAutoIncrement: true, defaultValue: null, isDefaultValueFunction: false },
    { columnName: 'username', comment: '사용자 이름', type: 'VARCHAR', length: 50, isPrimaryKey: false, isUnique: true, isNullable: false, isAutoIncrement: false, defaultValue: '', isDefaultValueFunction: false },
    { columnName: 'email', comment: '사용자 이메일', type: 'VARCHAR', length: 100, isPrimaryKey: false, isUnique: true, isNullable: false, isAutoIncrement: false, defaultValue: '', isDefaultValueFunction: false },
    { columnName: 'created_at', comment: '생성일', type: 'TIMESTAMP', length: null, isPrimaryKey: false, isUnique: false, isNullable: true, isAutoIncrement: false, defaultValue: 'NOW()', isDefaultValueFunction: true },
  ],
  // RelationNode2.js에는 columns만 있었지만, 관계 정보도 필요하므로 추가했습니다.
  relations: [
    { targetNodeId: 'erd2', relationType: '1:N', foreignKeyColumn: 'user_id', referenceColumn: 'posts.user_id', comment: 'User owns many Posts' },
    { targetNodeId: 'erd3', relationType: '1:1', foreignKeyColumn: 'user_id', referenceColumn: 'user_profiles.user_id', comment: 'Each User has one Profile' }
  ]
};

function EntityErdNode({ data, selected }) {
  data = mockErdData1;
  
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
