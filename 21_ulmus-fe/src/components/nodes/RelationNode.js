import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Key, Link2 } from 'lucide-react';

const RelationNode = ({ data, selected }) => {
  return (
    // 1. 최상위 컨테이너 (여기는 overflow가 없어야 Handle이 보입니다)
    <div style={{ position: 'relative' }}>
      
      {/* 2. 실제 디자인 몸체 (기존 article) */}
      <article style={{
        ...nodeStyles.container,
        opacity: selected ? 1 : 0.9,
        border: selected ? '2px solid #BFFF00' : '1px solid rgba(191, 255, 0, 0.4)',
        boxShadow: selected 
          ? '0 0 30px rgba(191, 255, 0, 0.6), inset 0 0 10px rgba(191, 255, 0, 0.3)' 
          : '0 0 15px rgba(191, 255, 0, 0.2)',
        transform: selected ? 'scale(1.05)' : 'scale(1)',
      }}>
        {/* Header */}
        <div style={{
          ...nodeStyles.header,
          background: selected ? '#BFFF00' : 'rgba(191, 255, 0, 0.15)',
        }}>
          {/* <Database size={14} color={selected ? "#000" : "#BFFF00"} /> */}
          <span style={{
            ...nodeStyles.tableName,
            color: selected ? '#000' : '#BFFF00',
          }}>{data.label}</span>
        </div>

        {/* Body */}
        <div style={nodeStyles.body}>
          {data.columns?.length > 0 ? (
            data.columns.map((col, i) => (
              <div key={i} style={nodeStyles.columnItem}>
                <div style={nodeStyles.colLeft}>
                  {col.pk && <Key size={10} color="#BFFF00" style={{marginRight: '6px'}} />}
                  <span style={{ color: col.pk ? '#BFFF00' : '#E0E0E0' }}>
                    {typeof col === 'string' ? col : col.name}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={nodeStyles.emptyText}>STANDBY</div>
          )}
        </div>
      </article>

      {/* 3. Handle을 article 밖으로 이동 (z-index 영향 없이 완벽하게 노출) */}
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ ...nodeStyles.handle, top: '-5px' }} // 살짝 위로 돌출
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ ...nodeStyles.handle, bottom: '-5px' }} // 살짝 아래로 돌출
      />
    </div>
  );
};

const nodeStyles = {
  container: {
    background: 'rgba(15, 15, 15, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    minWidth: '190px',
    overflow: 'hidden', // 내부 요소 자르기 유지
    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  header: { padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' },
  tableName: { fontSize: '13px', fontWeight: '800', textTransform: 'uppercase' },
  body: { padding: '14px' },
  columnItem: { fontSize: '12px', display: 'flex', alignItems: 'center', padding: '2px 0' },
  colLeft: { display: 'flex', alignItems: 'center' },
  emptyText: { fontSize: '10px', color: '#444', textAlign: 'center' },
  // Handle 디자인: 더 강조된 별 모양 느낌
  handle: { 
    background: '#BFFF00', 
    width: '12px', 
    height: '12px', 
    border: '2px solid #000',
    boxShadow: '0 0 8px #BFFF00',
    zIndex: 10, // 가장 위로
  }
};

export default RelationNode;