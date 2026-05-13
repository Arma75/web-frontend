import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const ColumnRow = ({ nodeLabel, column, showType }) => {
  const isValidConnection = useCallback((connection) => {
    return connection.source !== connection.target;
  }, []);

  return (
    <tr
      key={column.label}
      style={styles.erdColumnRow}
    >
      {showType == 0 && (
        <>
          <td className='erd-node-column-cell' style={{ ...styles.erdNodeColumnCell }}>
            {/* LEFT HANDLE */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${nodeLabel}-${column.label}-left`}
              isValidConnection={isValidConnection}
              style={{ ...styles.erdHandle, left: '-4px' }}
            />

            {/* PK mark */}
            {column.isPrimaryKey && <span style={{marginRight: '6px'}}>🔑</span>}
            {/* FK mark */}
            {column.isForeignKey && <span style={{marginRight: '6px'}}>🔗</span>}
            {/* {column.isReferenceKey && <span style={{marginRight: '6px'}}>📌</span>} */}

            {/* COLUMN NAME */}
            <span>{column.label}</span>
          </td>

          <td className='erd-node-column-cell' style={{ ...styles.erdNodeColumnCell, display: 'flex', justifyContent: 'flex-end', }}>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',}}>
              <span>{column.type}</span>
              {column.length && (
                <span>({column.length})</span>
              )}

              {/* RIGHT HANDLE */}
              <Handle
                type="source"
                position={Position.Right}
                id={`${nodeLabel}-${column.label}-right`}
                isValidConnection={isValidConnection}
                style={{ ...styles.erdHandle, right: '-4px' }}
              />
            </div>
          </td>
        </>
      )}

      {showType == 1 && (
        <>
          <td className='erd-node-column-cell' style={{ ...styles.erdNodeColumnCell }}>
            {/* LEFT HANDLE */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${nodeLabel}-${column.label}-left`}
              isValidConnection={isValidConnection}
              style={{ ...styles.erdHandle, left: '-4px' }}
            />

            {/* PK mark */}
            {column.isPrimaryKey && <span style={{marginRight: '6px'}}>🔑</span>}
            {/* FK mark */}
            {column.isForeignKey && <span style={{marginRight: '6px'}}>🔗</span>}
            {/* {column.isReferenceKey && <span style={{marginRight: '6px'}}>📌</span>} */}

            {/* COLUMN NAME */}
            <span>{column.comment || column.label}</span>
          </td>

          <td className='erd-node-column-cell' style={{ ...styles.erdNodeColumnCell, display: 'flex', justifyContent: 'flex-end', }}>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',}}>
              <span>{column.type}</span>
              {column.length && (
                <span>({column.length})</span>
              )}

              {/* RIGHT HANDLE */}
              <Handle
                type="source"
                position={Position.Right}
                id={`${nodeLabel}-${column.label}-right`}
                isValidConnection={isValidConnection}
                style={{ ...styles.erdHandle, right: '-4px' }}
              />
            </div>
          </td>
        </>
      )}

      {showType == 2 && (
        <>
          <td className='erd-node-column-cell' style={{ ...styles.erdNodeColumnCell }}>
            {/* LEFT HANDLE */}
            <Handle
              type="target"
              position={Position.Left}
              id={`${nodeLabel}-${column.label}-left`}
              isValidConnection={isValidConnection}
              style={{ ...styles.erdHandle, left: '-4px' }}
            />

            {/* PK mark */}
            {column.isPrimaryKey && <span style={{marginRight: '6px'}}>🔑</span>}
            {/* FK mark */}
            {column.isForeignKey && <span style={{marginRight: '6px'}}>🔗</span>}
            {/* {column.isReferenceKey && <span style={{marginRight: '6px'}}>📌</span>} */}

            {/* COLUMN NAME */}
            <span>{column.label}</span>
          </td>

          <td className='erd-node-column-cell' style={{ ...styles.erdNodeColumnCell }}>
            {/* COLUMN NAME */}
            <span>{column.comment}</span>
          </td>

          <td className='erd-node-column-cell' style={{ ...styles.erdNodeColumnCell, display: 'flex', justifyContent: 'flex-end', }}>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',}}>
              <span>{column.type}</span>
              {column.length && (
                <span>({column.length})</span>
              )}

              {/* RIGHT HANDLE */}
              <Handle
                type="source"
                position={Position.Right}
                id={`${nodeLabel}-${column.label}-right`}
                isValidConnection={isValidConnection}
                style={{ ...styles.erdHandle, right: '-4px' }}
              />
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

const styles = {
  erdNodeColumnCell: {
    padding: '16px',
    verticalAlign: 'middle',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
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