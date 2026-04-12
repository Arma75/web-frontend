import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  addEdge, Background, Controls, applyNodeChanges, applyEdgeChanges, 
  Handle, Position, BackgroundVariant 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- [커스텀 노드 디자인] ---
const TableNode = ({ data }) => (
  <div style={styles.nodeContainer}>
    {/* 상단 핸들 (Target & Source 겸용을 위해 2개를 겹치거나 타입을 유연하게 설정) */}
    <Handle type="target" position={Position.Top} id="t" style={styles.handleStyle} />
    <Handle type="source" position={Position.Top} id="t-s" style={{ ...styles.handleStyle, opacity: 0 }} />

    {/* 하단 핸들 */}
    <Handle type="target" position={Position.Bottom} id="b" style={styles.handleStyle} />
    <Handle type="source" position={Position.Bottom} id="b-s" style={{ ...styles.handleStyle, opacity: 0 }} />

    {/* 좌측 핸들 */}
    <Handle type="target" position={Position.Left} id="l" style={styles.handleStyle} />
    <Handle type="source" position={Position.Left} id="l-s" style={{ ...styles.handleStyle, opacity: 0 }} />

    {/* 우측 핸들 */}
    <Handle type="target" position={Position.Right} id="r" style={styles.handleStyle} />
    <Handle type="source" position={Position.Right} id="r-s" style={{ ...styles.handleStyle, opacity: 0 }} />
    <div style={styles.nodeHeader}>
      <div>{data.label}</div>
      {data.tableComment && (
        <div style={{ fontSize: '10px', fontWeight: 'normal', opacity: 0.8, marginTop: '2px' }}>
          {data.tableComment}
        </div>
      )}
    </div>
    {/* <div style={styles.nodeHeader}>{data.label}</div> */}
    <div style={styles.nodeBody}>
      {data.columns?.map((col, i) => (
        <div key={i} style={styles.nodeRow}>
          <span style={{...styles.nodeColName, fontWeight: col.isPk ? 'bold' : 'normal'}}>
            {col.isPk ? '🔑 ' : ''}{col.name}
          </span>
          <span style={styles.nodeColType}>
            {col.type.toLowerCase()}
            {/* 길이 혹은 정밀도가 있다면 표시 */}
            {['VARCHAR', 'CHAR'].includes(col.type) && col.length ? `(${col.length})` : ''}
            {['NUMERIC', 'DECIMAL'].includes(col.type) && col.precision ? `(${col.precision}${col.scale ? `,${col.scale}` : ''})` : ''}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const nodeTypes = { tableNode: TableNode };

// PostgreSQL 주요 타입
const PG_TYPES = [
  'BIGINT', 'INTEGER', 'SMALLINT', 'VARCHAR', 'CHAR', 'TEXT', 
  'NUMERIC', 'DECIMAL', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'TIMESTAMPTZ', 
  'UUID', 'JSONB', 'BYTEA'
];

function Sketchbook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState(null); 
  const [newTable, setNewTable] = useState({
    tableName: '',
    tableComment: '', // 추가
    columns: [{ 
      name: 'id', type: 'BIGINT', length: '', precision: '', scale: '', comment: 'PK', 
      isPk: true, isUnique: false, isNullable: false, isAutoInc: true, 
      defaultValue: '', isDefaultFunc: false 
    }]
  });
  // [추가] 드래그 앤 드롭 상태 관리
  const [draggedIdx, setDraggedIdx] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:8080/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject(res.data);
        if (res.data.schemaJson) {
          const schema = JSON.parse(res.data.schemaJson);
          setNodes(schema.nodes || []);
          setEdges(schema.edges || []);
        }
      } catch (e) { console.error("Load Error:", e); }
    };
    fetchDetail();
  }, [id]);

  // [추가] 컬럼 삭제 함수
  const deleteColumn = (index) => {
    if (newTable.columns.length <= 1) return alert("최소 한 개의 컬럼은 존재해야 합니다.");
    const updated = newTable.columns.filter((_, i) => i !== index);
    setNewTable({ ...newTable, columns: updated });
  };

  const onDragStart = (idx) => setDraggedIdx(idx);
  const onDragOver = (e) => e.preventDefault(); // 드롭 허용을 위해 필수

  // [수정] 드래그 중인 컬럼이 다른 컬럼 위로 진입했을 때 실시간으로 순서 변경
  const onDragEnter = (targetIdx) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return;

    const updated = [...newTable.columns];
    const draggedItem = updated[draggedIdx];
    
    updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, draggedItem);
    
    // 드래그 중인 인덱스 업데이트 (중요: 그래야 실시간으로 따라옴)
    setDraggedIdx(targetIdx);
    setNewTable({ ...newTable, columns: updated });
  };

  // [수정] 드래그 종료 시 상태 초기화
  const onDragEnd = () => {
    setDraggedIdx(null);
  };

  const onDrop = (idx) => {
    if (draggedIdx === null) return;
    const updated = [...newTable.columns];
    const draggedItem = updated[draggedIdx];
    
    updated.splice(draggedIdx, 1); // 원래 위치에서 제거
    updated.splice(idx, 0, draggedItem); // 새로운 위치에 삽입
    
    setNewTable({ ...newTable, columns: updated });
    setDraggedIdx(null);
  };

  const saveToServer = async (updatedNodes, updatedEdges) => {
    try {
      const token = localStorage.getItem('accessToken');
      const schemaData = { nodes: updatedNodes, edges: updatedEdges };
      await axios.patch(`http://localhost:8080/projects/${id}`, {
        schemaJson: JSON.stringify(schemaData)
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { console.error("Save Error:", e); }
  };

  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  // --- [수정: 에지 변화(삭제 포함) 시 서버 저장 추가] ---
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      const nextEdges = applyEdgeChanges(changes, eds);
      // 삭제(remove)나 다른 변화가 생겼을 때 서버에 동기화
      if (changes.some(c => c.type === 'remove')) {
        saveToServer(nodes, nextEdges);
      }
      return nextEdges;
    });
  }, [nodes]);
  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const nextEdges = addEdge(params, eds);
      saveToServer(nodes, nextEdges);
      return nextEdges;
    });
  }, [nodes, edges]);

  const onNodeDragStop = useCallback(() => saveToServer(nodes, edges), [nodes, edges]);

  const onNodeDoubleClickHandler = (event, node) => {
    setEditingNodeId(node.id);
    // JSON 방식을 사용하여 배열 내부의 객체들까지 완전히 새로운 복사본으로 만듭니다.
    // 이렇게 하면 모달에서 수정해도 'Update'를 누르기 전까지는 원본 노드에 영향을 주지 않습니다.
    const deepCopiedColumns = JSON.parse(JSON.stringify(node.data.columns));
    
    setNewTable({
      tableName: node.data.label,
      tableComment: node.data.tableComment || '',
      columns: deepCopiedColumns
    });
    setIsModalOpen(true);
  };

  const handleColumnChange = (index, field, value) => {
    const updated = [...newTable.columns];
    
    if (field === 'type') {
      const type = value;
      // 길이 비활성화 체크
      if (!['VARCHAR', 'CHAR'].includes(type)) updated[index]['length'] = '';
      // 자동증가 비활성화 체크
      if (!['BIGINT', 'INTEGER', 'SMALLINT'].includes(type)) updated[index]['isAutoInc'] = false;
      // 정밀도 비활성화 체크
      if (!['NUMERIC', 'DECIMAL'].includes(type)) {
        updated[index]['precision'] = '';
        updated[index]['scale'] = '';
      }
    }
    
    updated[index][field] = value;
    setNewTable({ ...newTable, columns: updated });
  };

  const saveSchema = () => {
    const { tableName, tableComment, columns } = newTable;
    const upperTableName = tableName.trim().toUpperCase();
    // 테이블명 규칙 정규식: 시작은 알파벳, 이후 알파벳/숫자/언더바만 허용
    const nameRegex = /^[A-Z][A-Z0-9_]*$/;

    // 1. 테이블명 검사
    if (!upperTableName) return alert("테이블 명을 입력하세요.");

    if (!nameRegex.test(upperTableName)) {
      return alert("테이블명은 반드시 영문자로 시작해야 하며, 영문·숫자·언더바(_)만 사용할 수 있습니다.");
    }

    // 2. 컬럼 유효성 세부 검사
    if (columns.length === 0) return alert("최소 한 개 이상의 컬럼이 필요합니다.");

    const colNames = columns.map(c => c.name.trim());
    
    // [수정] 컬럼명 빈 값 체크
    if (colNames.some(name => name === "")) {
      return alert("컬럼명은 빈 값일 수 없습니다.");
    }

    // [수정] 동일 테이블 내 컬럼명 중복 체크
    if (new Set(colNames).size !== colNames.length) {
      return alert("한 테이블 내에 중복된 컬럼명이 존재합니다.");
    }

    // [수정] PK 필수 체크
    if (!columns.some(c => c.isPk)) {
      return alert("최소 한 개 이상의 PK(기본키)를 지정해야 합니다.");
    }

    // 3. 테이블명 중복 체크 (신규 생성 시)
    if (!editingNodeId && nodes.some(n => n.data.label === upperTableName)) {
      return alert(`이미 '${upperTableName}' 테이블이 존재합니다.`);
    }

    let nextNodes = [];
    if (editingNodeId) {
      nextNodes = nodes.map(n => n.id === editingNodeId ? { ...n, data: { ...n.data, label: upperTableName, tableComment, columns } } : n);
    } else {
      let nextX = 100, nextY = 100;
      if (nodes.length > 0) {
        const maxXNode = nodes.reduce((p, c) => (p.position.x > c.position.x) ? p : c);
        nextX = maxXNode.position.x + 200; // 200 간격 유지
        nextY = maxXNode.position.y;
      }
      nextNodes = nodes.concat({
        id: `table_${Date.now()}`,
        type: 'tableNode',
        data: { label: upperTableName, tableComment, columns },
        position: { x: nextX, y: nextY },
      });
    }
    setNodes(nextNodes);
    saveToServer(nextNodes, edges);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNodeId(null);
    setNewTable({ tableName: '', tableComment: '', columns: [{ name: 'id', type: 'BIGINT', length: '', precision: '', scale: '', comment: 'PK', isPk: true, isUnique: false, isNullable: false, isAutoInc: true, defaultValue: '', isDefaultFunc: false }] });
  };

  const isValidConnection = useCallback(
    (connection) => {
      // 현재 연결하려는 시작점(source)과 끝점(target)의 ID를 가져옵니다.
      const { source, target } = connection;

      // 자기 자신으로의 연결 방지 (Self-connection)
      if (source === target) return false;

      // 이미 존재하는 에지(edge) 중에 동일한 노드 쌍이 있는지 확인합니다.
      // A -> B 뿐만 아니라 B -> A로 이미 연결된 경우도 포함합니다.
      const isAlreadyConnected = edges.some(
        (edge) =>
          (edge.source === source && edge.target === target) ||
          (edge.source === target && edge.target === source)
      );

      return !isAlreadyConnected; // 이미 연결되어 있다면 false를 반환하여 연결을 막음
    },
    [edges]
  );

  const deleteSelectedNodes = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected);
    if (selectedNodes.length === 0 || !window.confirm("삭제하시겠습니까?")) return;
    const nextNodes = nodes.filter(n => !n.selected);
    const nextEdges = edges.filter(e => !selectedNodes.find(n => n.id === e.source || n.id === e.target));
    setNodes(nextNodes); setEdges(nextEdges);
    saveToServer(nextNodes, nextEdges);
  }, [nodes, edges]);

  if (!project) return null;

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => navigate('/', { replace: true })} style={styles.backBtn}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
          <div style={{ marginLeft: '15px' }}><h2 style={styles.headerTitle}>{project.projectName}</h2><p style={styles.headerSub}>{project.description}</p></div>
        </div>
      </header>

      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeDoubleClick={onNodeDoubleClickHandler} onNodeDragStop={onNodeDragStop} nodeTypes={nodeTypes} fitView connectionMode="loose" proOptions={{ hideAttribution: true }} isValidConnection={isValidConnection}>
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d1d1" /><Controls />
        </ReactFlow>
        <div style={styles.actionGroup} onMouseDown={(e) => e.stopPropagation()}>
          {nodes.some(n => n.selected) && <button onClick={deleteSelectedNodes} style={styles.delBtn}>Delete Selected ({nodes.filter(n => n.selected).length})</button>}
          <button onClick={() => setIsModalOpen(true)} style={styles.fab}>+ Add Table</button>
        </div>
      </div>

      {isModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{margin:0, color:'#1e293b'}}>{editingNodeId ? 'Edit Table' : 'Create Table'}</h3>
              <button onClick={closeModal} style={styles.closeX}>✕</button>
            </div>
            
            <div style={styles.modalBody}>
              {/* 테이블명 & 코멘트 입력 그룹 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.inputLabel}>Table Name</label>
                  <input 
                    style={{...styles.mainInput, marginBottom: 0}} 
                    placeholder="e.g. USER_INFO" 
                    value={newTable.tableName} 
                    onChange={e => setNewTable({...newTable, tableName: e.target.value})} 
                  />
                </div>
                <div style={{ flex: 1.5 }}>
                  <label style={styles.inputLabel}>Table Comment</label>
                  <input 
                    style={{...styles.mainInput, marginBottom: 0}} 
                    placeholder="테이블에 대한 설명을 입력하세요" 
                    value={newTable.tableComment} 
                    onChange={e => setNewTable({...newTable, tableComment: e.target.value})} 
                  />
                </div>
              </div>
              
              <div style={styles.tableWrapper}>
                <table style={styles.modalTable}>
                  <thead>
                    <tr>
                      <th style={styles.th}>☰</th>
                      <th style={styles.th}>PK</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Option</th>
                      <th style={styles.th}>Null</th>
                      <th style={styles.th}>Uniq</th>
                      <th style={styles.th}>A.I</th>
                      <th style={styles.th}>Default</th>
                      <th style={styles.th}>Comment</th>
                      <th style={styles.th}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {newTable.columns.map((col, idx) => (
                      <tr 
                        key={idx}
                        draggable
                        onDragStart={() => onDragStart(idx)}
                        onDragOver={onDragOver}
                        onDragEnter={() => onDragEnter(idx)} // 진입 시 바로 순서 변경
                        onDragEnd={onDragEnd} // 드래그 끝나면 초기화
                        style={{
                          ...styles.tr,
                          cursor: 'grab',
                          // 드래그 중인 행은 그림자와 파란색 테두리로 강조
                          backgroundColor: draggedIdx === idx ? '#eff6ff' : 'transparent',
                          border: draggedIdx === idx ? '2px dashed #3b82f6' : 'none',
                          opacity: draggedIdx === idx ? 0.8 : 1,
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {/* 순서 변경 핸들러 아이콘 (추가) */}
                        <td style={{...styles.td, textAlign:'center', color: '#94a3b8', fontSize: '18px'}}>☰</td>

                        <td style={{...styles.td, textAlign:'center'}}><input type="checkbox" checked={col.isPk} onChange={e => handleColumnChange(idx, 'isPk', e.target.checked)} /></td>
                        <td style={styles.td}><input style={styles.tableIn} value={col.name} onChange={e => handleColumnChange(idx, 'name', e.target.value)} /></td>
                        <td style={styles.td}>
                          <select style={styles.tableIn} value={col.type} onChange={e => handleColumnChange(idx, 'type', e.target.value)}>
                            {PG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td style={styles.td}>
                          {['VARCHAR', 'CHAR'].includes(col.type) ? (
                            <input style={styles.tableIn} placeholder="Len" value={col.length} onChange={e => handleColumnChange(idx, 'length', e.target.value)} />
                          ) : ['NUMERIC', 'DECIMAL'].includes(col.type) ? (
                            <div style={{display:'flex', gap:'4px'}}>
                              <input style={styles.tableIn} placeholder="P" value={col.precision} onChange={e => handleColumnChange(idx, 'precision', e.target.value)} />
                              <input style={styles.tableIn} placeholder="S" value={col.scale} onChange={e => handleColumnChange(idx, 'scale', e.target.value)} />
                            </div>
                          ) : <span style={{color:'#cbd5e1', fontSize:'11px'}}>N/A</span>}
                        </td>
                        <td style={{...styles.td, textAlign:'center'}}><input type="checkbox" checked={col.isNullable} onChange={e => handleColumnChange(idx, 'isNullable', e.target.checked)} /></td>
                        <td style={{...styles.td, textAlign:'center'}}><input type="checkbox" checked={col.isUnique} onChange={e => handleColumnChange(idx, 'isUnique', e.target.checked)} /></td>
                        <td style={{...styles.td, textAlign:'center'}}>
                          <input type="checkbox" checked={col.isAutoInc} disabled={!['BIGINT', 'INTEGER', 'SMALLINT'].includes(col.type)} onChange={e => handleColumnChange(idx, 'isAutoInc', e.target.checked)} />
                        </td>
                        <td style={styles.td}>
                          <div style={{display:'flex', alignItems:'center', gap:'4px'}}>
                            <input style={styles.tableIn} placeholder="Def" value={col.defaultValue} onChange={e => handleColumnChange(idx, 'defaultValue', e.target.value)} />
                            <label style={{fontSize:'10px', color:'#94a3b8', cursor:'pointer'}}><input type="checkbox" checked={col.isDefaultFunc} onChange={e => handleColumnChange(idx, 'isDefaultFunc', e.target.checked)} />Fx</label>
                          </div>
                        </td>
                        <td style={styles.td}><input style={styles.tableIn} value={col.comment} onChange={e => handleColumnChange(idx, 'comment', e.target.value)} /></td>

                        {/* [수정] 삭제 버튼 디자인 */}
                        <td style={{...styles.td, textAlign:'center'}}>
                          <button 
                            onClick={() => deleteColumn(idx)} 
                            style={styles.delColBtn}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setNewTable({...newTable, columns: [...newTable.columns, { name: '', type: 'VARCHAR', length: '255', precision: '', scale: '', comment: '', isPk: false, isUnique: false, isNullable: true, isAutoInc: false, defaultValue: '', isDefaultFunc: false }]})} style={styles.subBtn}>+ Add New Column</button>
            </div>

            <div style={styles.footer}>
              <button onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
              <button onClick={saveSchema} style={styles.confirmBtn}>{editingNodeId ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9', fontFamily: '-apple-system, sans-serif' },
  header: { height: '64px', padding: '0 32px', display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0' },
  backBtn: { width: '36px', height: '36px', border: 'none', borderRadius: '8px', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color:'#64748b' },
  headerTitle: { margin: 0, fontSize: '1.1rem', fontWeight: '800', color:'#1e293b' },
  headerSub: { margin: 0, fontSize: '0.8rem', color: '#94a3b8' },
  actionGroup: { position: 'absolute', right: '32px', bottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px', zIndex: 1000 },
  fab: { padding: '12px 28px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(59,130,246,0.3)' },
  delBtn: { padding: '12px 28px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
  nodeContainer: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', minWidth: '180px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' },
  nodeHeader: { background: '#3b82f6', color: '#fff', padding: '10px', fontWeight: 'bold', fontSize: '13px', textAlign: 'center' },
  nodeBody: { padding: '10px' },
  nodeRow: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderBottom: '1px solid #f1f5f9', padding: '6px 0' },
  nodeColType: { color: '#10b981', fontWeight: '600' },
  // --- 모달 핵심 디자인 ---
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' },
  modal: { width: '1100px', backgroundColor: '#fff', borderRadius: '20px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow:'hidden' },
  modalHeader: { padding: '20px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeX: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8' },
  modalBody: { padding: '24px 32px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  mainInput: { width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '10px', outline: 'none', fontSize: '15px', marginBottom: '20px' },
  tableWrapper: { flex: 1, overflow: 'auto', border: '1px solid #f1f5f9', borderRadius: '12px', marginBottom: '16px' },
  modalTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
  th: { position: 'sticky', top: 0, backgroundColor: '#f8fafc', color: '#64748b', padding: '12px 8px', textAlign: 'left', fontWeight: '700', borderBottom: '2px solid #f1f5f9', zIndex: 1 },
  td: { padding: '8px', borderBottom: '1px solid #f1f5f9' },
  tableIn: { width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', outline: 'none' },
  subBtn: { padding: '14px', border: '2px dashed #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', borderRadius: '12px', fontWeight: 'bold' },
  footer: { padding: '20px 32px', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' },
  confirmBtn: { padding: '12px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', color:'#64748b' },
  delColBtn: {
    background: 'transparent',
    border: 'none',
    color: '#f87171', // 부드러운 레드
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  // 추가적인 스타일 팁: tr에 hover 시 배경색 변화 추가
  tr: { 
    transition: 'background-color 0.2s',
    borderBottom: '1px solid #f1f5f9'
  },
  handleStyle: {
    width: '8px',
    height: '8px',
    background: '#3b82f6',
    border: '2px solid #fff',
  },
  nodeComment: {
    fontSize: '10px', 
    fontWeight: 'normal', 
    opacity: 0.8, 
    marginTop: '2px',
    borderTop: '1px solid rgba(255,255,255,0.2)',
    paddingTop: '2px'
  }
};

export default Sketchbook;