import React, { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Key, Link2 } from 'lucide-react';
import ColumnRow from './ColumnRow';


const mockErdData1 = {
  id: 'erd3',
  label: 'UserProfiles',
  comment: '사용자 추가 정보 테이블',
  columns: [
    { label: 'profile_id', comment: '프로필 고유 ID', type: 'INT', length: 11, isPrimaryKey: true, isForeignKey: true, isUnique: true, isNullable: false, isAutoIncrement: true, defaultValue: null, isDefaultValueFunction: false },
    { label: 'user_id', comment: '사용자 ID (FK, Unique)', type: 'INT', length: 11, isPrimaryKey: false, isForeignKey: false, isUnique: true, isNullable: false, isAutoIncrement: false, defaultValue: null, isDefaultValueFunction: false },
    { label: 'bio', comment: '자기소개', type: 'TEXT', length: null, isPrimaryKey: false, isUnique: false, isForeignKey: false, sNullable: true, isAutoIncrement: false, defaultValue: '', isDefaultValueFunction: false },
    { label: 'avatar_url', comment: '아바타 URL', type: 'VARCHAR', length: 255, isPrimaryKey: false, isForeignKey: true, isUnique: false, isNullable: true, isAutoIncrement: false, defaultValue: null, isDefaultValueFunction: false },
  ],
  relations: [
    { targetNodeId: 'erd1', relationType: '1:1', foreignKeyColumn: 'user_id', referenceColumn: 'users.user_id', comment: 'Profile belongs to one User' }
  ]
};

// --- Helper Component for Column Row ---
const RelationNode = ({ data, selected }) => {
  console.log(data);
  // data = mockErdData1;
  // data.label = 'UserProfiles';
  // data.comment = '사용자 추가 정보 테이블';
  // console.log(data);
      // console.log(showType);
  return (
    // ERD Node container
    <article className={selected? 'erd-node-container selected' : "erd-node-container"} 
      style={{
        ...styles.erdNodeContainer,
      }}
    >
      {/* Header */}
      <section className={selected? 'erd-node-header-container selected' : "erd-node-header-container"} 
        style={{
          ...styles.erdNodeHeaderContainer,
          border: selected? '1px solid rgba(191,255,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: selected? `0 0 0 1px rgba(191,255,0,0.15)` : '0 20px 50px rgba(0,0,0,0.45)',
          background: selected? '#BFFF00' : 'rgba(191, 255, 0, 0.15)',
        }}
      >
        <div className={selected? 'erd-node-header selected' : "erd-node-header"} 
          style={{
            ...styles.erdNodeHeader,
            background: selected? '#BFFF00' : 'rgba(191, 255, 0, 0.15)',
          }}
        >
          {/* <Database size={14} color={selected ? "#000" : "#BFFF00"} /> */}
          {/* <span style={{
            color: selected ? '#000' : '#BFFF00',
          }}>{data.showType == 1? data.label : data.comment}</span> */}
          <span style={{color: selected ? '#000' : '#BFFF00'}}>{data.label}</span>
          <span style={{color: selected ? '#000' : '#BFFF00'}}>{data.comment}</span>
        </div>
      </section>

      {/* Body */}
      <section className={selected? 'erd-node-body-container selected' : "erd-node-body-container"}
        style={{
          ...styles.erdNodeBodyContainer,
          border: selected? '1px solid rgba(191,255,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: selected? `0 0 0 1px rgba(191,255,0,0.15)` : '0 20px 50px rgba(0,0,0,0.45)',
        }}
      >
        {(data.columns || []).map((col) => {
          return (
            <ColumnRow key={col.label} column={col} showType={data.showType} />
          );
        })}
      </section>
    </article>
  );
};

const styles = {
  erdNodeContainer: {
    minWidth: '220px',
    background: 'transparent',
    overflow: 'visible',
  },
  erdNodeHeaderContainer: {
    borderRadius: '20px 20px 0 0',
    overflow: 'hidden',
    backdropFilter: 'blur(4px)',
  },
  erdNodeHeader: {
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: '#BFFF00',
    fontWeight: 700,
    fontSize: '13px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
  },
  erdNodeBodyContainer: {
    borderRadius: '0 0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(4px)',
  },

  erdColumnRow: {
    position: 'relative',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    color: '#fff',
    fontSize: '14px',
  },
  erdHandle: {
    width: 8,
    height: 8,
    background: '#BFFF00',
    border: 'none',
  },

  resizerHandle: {
    width: 8,
    height: 8,
    borderRadius: '2px',
  },
  resizerLine: {
    borderWidth: 1,
    borderStyle: 'dashed',
  }
};
export default RelationNode;