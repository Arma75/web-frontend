import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const ColumnRow = ({ column, showType }) => {
    console.log(column);
    console.log(showType);
  const isValidConnection = useCallback((connection) => {
    return connection.source !== connection.target;
  }, []);

  return (
    <div
      key={column.label}
      style={styles.erdColumnRow}
    >
      {/* LEFT HANDLE */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${column.label}-left`}
        isValidConnection={isValidConnection}
        style={{ ...styles.erdHandle, left: '-4px' }}
      />

      {/* RIGHT HANDLE */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${column.label}-right`}
        isValidConnection={isValidConnection}
        style={{ ...styles.erdHandle, right: '-4px' }}
      />
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flexStart",
        alignItems: "center",
      }}>
        {(showType == 0 || showType == 2) && (
          <div style={{width: '200px'}}>
            {/* PK mark */}
            {column.isPrimaryKey && <span style={{marginRight: '6px'}}>🔑</span>}
            {/* FK mark */}
            {column.isForeignKey && <span style={{marginRight: '6px'}}>🔗</span>}
            {column.isReferenceKey && <span style={{marginRight: '6px'}}>📌</span>}
            {/* COLUMN NAME */}
            <span>{column.label}</span>
          </div>
        )}
        {(showType == 1 || showType == 2) && (
          <div style={{width: '200px'}}>
            <span>{column.comment}</span>
          </div>
        )}
        {/* <div style={{width: '200px'}}>
          <span>{column.defaultValue}</span>
        </div> */}
        <div style={{width: '200px', display: 'flex', justifyContent: 'flex-end'}}>
          <span>{column.type}</span>
          {column.length && (
            <span>({column.length})</span>
          )}
        </div>
      </div>
    </div>
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
};

export default ColumnRow;