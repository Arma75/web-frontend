import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Key, Link2 } from 'lucide-react';


const RelationNode = ({ data, selected }) => {
  console.log(data);
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
          <span style={{
            ...styles.tableName,
            color: selected ? '#000' : '#BFFF00',
          }}>{data.label}</span>
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
        {(data.columns || []).map((col, idx) => {
          const sourceId = `${data.id}-${col}-source`;
          const targetId = `${data.id}-${col}-target`;

          return (
            <div
              key={idx}
              style={styles.columnRow}
            >
              {/* LEFT TARGET */}
              <Handle
                type="target"
                position={Position.Left}
                id={targetId}
                style={{
                  ...styles.columnHandle,
                  left: -6,
                }}
              />

              {/* RIGHT SOURCE */}
              <Handle
                type="source"
                position={Position.Right}
                id={sourceId}
                style={{
                  ...styles.columnHandle,
                  right: -6,
                }}
              />

              {/* PK mark */}
              <Key size={8} color="#BFFF00" style={{marginRight: '6px'}} />
              {/* FK mark */}
              <Link2 size={8} color="#BFFF00" style={{marginRight: '6px'}} />
              {/* COLUMN NAME */}
              <span>{col}</span>
            </div>
          );
        })}
      </section>
    </article>
  );
};

const styles = {
  erdNodeContainer: {
    minWidth: '220px',
    background: 'rgba(15,15,15,0.9)',
    backdropFilter: 'blur(12px)',
    overflow: 'visible',
    boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
  },
  erdNodeHeaderContainer: {
    borderRadius: '20px 20px 0 0',
    overflow: 'hidden',
  },
  erdNodeHeader: {
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    color: '#BFFF00',
    fontWeight: 700,
    fontSize: '13px',
  },
  erdNodeBodyContainer: {
    borderRadius: '0 0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
  },

  canvasShell: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    background: 
    'radial-gradient(circle at top, #111827 0%, #050816 45%, #020308 100%)',
  },

  flowWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  gridGlow: {
    position: 'absolute',
    inset: 0,

    zIndex: 1,

    pointerEvents: 'none',

    background: `
      linear-gradient(
        rgba(191,255,0,0.08) 1px,
        transparent 1px
      ),

      linear-gradient(
        90deg,
        rgba(191,255,0,0.08) 1px,
        transparent 1px
      )
    `,

    backgroundSize: '32px 32px',

    filter: 'blur(2px)',

    opacity: 0.35,

    mixBlendMode: 'screen',
  },

  flow: {
    width: '100%',
    height: '100%',

    position: 'relative',
    zIndex: 2,

    background:
      'radial-gradient(circle at top, #111827 0%, #050816 45%, #020308 100%)',
  },

  topHeader: {
    position: 'absolute',
    top: 0,
    left: 0,

    width: '100%',
    height: '72px',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    pointerEvents: 'none',

    zIndex: 50,
  },

  headerInner: {
    pointerEvents: 'auto',
  },

  projectTitleInput: {
    background: 'transparent',
    border: 'none',
    outline: 'none',

    color: '#fff',

    fontSize: '20px',
    fontWeight: 600,

    textAlign: 'center',

    minWidth: '320px',
  },

  floatingPanel: {
    position: 'absolute',

    top: '96px',
    bottom: '24px',

    background: 'rgba(15,15,15,0.72)',

    backdropFilter: 'blur(12px)',

    border:
      '1px solid rgba(255,255,255,0.08)',

    borderRadius: '24px',

    overflow: 'hidden',

    zIndex: 30,
  },

  panelBody: {
    padding: '24px',
    height: '100%',
    overflowY: 'auto',
  },

  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',

    color: '#BFFF00',

    marginBottom: '24px',

    fontSize: '14px',
    fontWeight: 600,
  },

  label: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',

    marginBottom: '8px',

    display: 'block',

    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  panelInput: {
    width: '100%',

    background: 'rgba(255,255,255,0.05)',

    border:
      '1px solid rgba(255,255,255,0.08)',

    borderRadius: '12px',

    padding: '12px',

    color: '#fff',

    outline: 'none',

    marginBottom: '18px',
  },

  floatingToolbar: {
    position: 'absolute',

    bottom: '32px',
    left: '50%',

    transform: 'translateX(-50%)',

    display: 'flex',
    alignItems: 'center',
    gap: '12px',

    padding: '10px',

    borderRadius: '999em',

    background: 'rgba(20,20,20,0.82)',

    backdropFilter: 'blur(20px)',

    border:
      '1px solid rgba(255,255,255,0.08)',

    boxShadow:
      '0 12px 40px rgba(0,0,0,0.45)',

    zIndex: 60,
  },

  toolbarBtn: {
    width: '48px',
    height: '48px',

    borderRadius: '50%',

    border: 'none',

    background: 'rgba(255,255,255,0.05)',

    color: '#fff',

    cursor: 'pointer',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  toolbarPrimaryBtn: {
    width: '48px',
    height: '48px',

    borderRadius: '50%',

    border: 'none',

    background: '#BFFF00',

    color: '#000',

    cursor: 'pointer',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  toolbarDeleteBtn: {
    width: '48px',
    height: '48px',

    borderRadius: '50%',

    border: 'none',

    background: 'rgba(255,70,70,0.18)',

    color: '#ff6b6b',

    cursor: 'pointer',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  relationSelect: {
    background:
      'rgba(255,255,255,0.05)',

    border:
      '1px solid rgba(255,255,255,0.08)',

    color: '#fff',

    height: '48px',

    borderRadius: '999em',

    padding: '0 16px',

    outline: 'none',
  },

  nodeWrapper: {
    minWidth: '220px',

    background: 'rgba(15,15,15,0.9)',

    backdropFilter: 'blur(12px)',

    borderRadius: '18px',

    overflow: 'visible',

    boxShadow:
      '0 20px 50px rgba(0,0,0,0.45)',
  },

  nodeHeader: {
    padding: '14px 16px',

    borderBottom:
      '1px solid rgba(255,255,255,0.06)',

    color: '#BFFF00',

    fontWeight: 700,

    fontSize: '13px',
  },

  nodeColumns: {
    display: 'flex',
    flexDirection: 'column',
  },

  columnRow: {
    position: 'relative',

    padding: '12px 16px',

    borderBottom:
      '1px solid rgba(255,255,255,0.04)',

    color: '#fff',

    fontSize: '13px',
  },

  handle: {
    width: 8,
    height: 8,

    background: '#BFFF00',

    border: 'none',
  },

  columnHandle: {
    width: 8,
    height: 8,

    background: '#BFFF00',

    border: 'none',
  },

  resizerRight: {
    position: 'absolute',
    top: 0,
    right: 0,

    width: '6px',
    height: '100%',

    cursor: 'col-resize',
  },

  resizerLeft: {
    position: 'absolute',
    top: 0,
    left: 0,

    width: '6px',
    height: '100%',

    cursor: 'col-resize',
  },

  attrList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',

    marginTop: '12px',
  },

  attrItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    padding: '12px',

    background: 'rgba(255,255,255,0.03)',

    borderRadius: '12px',

    color: '#fff',
    fontSize: '13px',
  },

  emptyState: {
    width: '100%',
    height: '100%',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    color: 'rgba(255,255,255,0.3)',

    fontSize: '14px',
  },

  multiSelectBox: {
    height: '100%',

    display: 'flex',
    flexDirection: 'column',

    justifyContent: 'center',
    alignItems: 'center',

    gap: '16px',

    color: '#fff',
  },

  sqlBtn: {
    background: '#BFFF00',

    border: 'none',

    padding: '14px 18px',

    borderRadius: '14px',

    fontWeight: 700,

    cursor: 'pointer',
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,

    background: 'rgba(0,0,0,0.7)',

    backdropFilter: 'blur(10px)',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 999,
  },

  modalContent: {
    width: '360px',

    background: '#111',

    border:
      '1px solid rgba(191,255,0,0.2)',

    borderRadius: '24px',

    padding: '24px',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginBottom: '24px',
  },

  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  modalInput: {
    width: '100%',

    background: 'rgba(255,255,255,0.05)',

    border:
      '1px solid rgba(255,255,255,0.08)',

    borderRadius: '12px',

    padding: '12px',

    color: '#fff',

    outline: 'none',
  },

  saveBtn: {
    width: '100%',

    marginTop: '24px',

    border: 'none',

    borderRadius: '14px',

    background: '#BFFF00',

    padding: '14px',

    fontWeight: 700,

    cursor: 'pointer',
  },

  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};
export default RelationNode;