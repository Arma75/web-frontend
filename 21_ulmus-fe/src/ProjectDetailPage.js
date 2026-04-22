import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, { 
  ReactFlowProvider, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  useOnSelectionChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import StarBackground from './pages/StarBackground';
import { 
  ArrowLeft, Settings, Plus, RotateCcw, RotateCw, 
  Trash2, Download, X, Layers, Database, ChevronRight,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen
} from 'lucide-react';
import RelationNode from './components/nodes/RelationNode';

const nodeTypes = {
  relation: RelationNode,
};

const ColumnDetailModal = ({ isOpen, onClose, onSave }) => {
  const [colName, setColName] = useState("");
  if (!isOpen) return null;
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, color: '#BFFF00' }}>Add Attribute</h3>
          <button onClick={onClose} style={styles.iconBtn}><X color="#fff" /></button>
        </div>
        <div style={styles.modalBody}>
          <label style={styles.label}>Column Name</label>
          <input style={styles.modalInput} value={colName} onChange={(e) => setColName(e.target.value)} placeholder="e.g. user_email" />
          <div style={styles.row}>
            <div style={{ flex: 1 }}><label style={styles.label}>Type</label><select style={styles.modalSelect}><option>VARCHAR</option><option>BIGINT</option></select></div>
            <div style={{ flex: 1 }}><label style={styles.label}>Length</label><input style={styles.modalInput} defaultValue="255" /></div>
          </div>
        </div>
        <button style={styles.saveBtn} onClick={() => { onSave(colName); setColName(""); onClose(); }}>Add to Relation</button>
      </div>
    </div>
  );
};

const ProjectDetailContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 패널 상태
  const [leftWidth, setLeftWidth] = useState(260);
  const [rightWidth, setRightWidth] = useState(300);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  
  const nodeIdRef = useRef(0);

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNode(nodes.length > 0 ? nodes[0] : null);
    },
  });

  const onAddRelation = useCallback(() => {
    const id = `${++nodeIdRef.current}`;
    const newNode = {
      id,
      data: { label: `TABLE_${id}`, columns: [] },
      type: 'relation',
      position: { x: 400, y: 200 },
    //   style: { background: 'rgba(15, 15, 15, 0.9)', color: '#fff', border: '1px solid rgba(191, 255, 0, 0.5)', borderRadius: '12px', width: 160 },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onAddColumn = (colName) => {
    if (!selectedNode || !colName) return;
    setNodes((nds) => nds.map((node) => {
      if (node.id === selectedNode.id) {
        const updatedNode = { ...node, data: { ...node.data, columns: [...(node.data.columns || []), colName] } };
        setSelectedNode(updatedNode);
        return updatedNode;
      }
      return node;
    }));
  };

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#BFFF00' } }, eds));
  }, [setEdges]);

  // Resizable 드래그 로직
  const startResizing = (direction) => (e) => {
    const startX = e.clientX;
    const startWidth = direction === 'left' ? leftWidth : rightWidth;

    const onMouseMove = (moveEvent) => {
      const delta = direction === 'left' ? moveEvent.clientX - startX : startX - moveEvent.clientX;
      const newWidth = startWidth + delta;
      if (newWidth > 150 && newWidth < 600) {
        direction === 'left' ? setLeftWidth(newWidth) : setRightWidth(newWidth);
      }
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div style={styles.wrapper}>
      <StarBackground />
      
      <header style={styles.topNav}>
        <button style={styles.iconBtn} onClick={() => window.history.back()}><ArrowLeft size={24} color="#BFFF00" /></button>
        <h2 style={styles.projectTitle}>Project: Ulmus Expansion</h2>
        <button style={styles.iconBtn}><Settings size={24} color="#BFFF00" /></button>
      </header>

      <main style={styles.mainContainer}>
        {/* LEFT PANEL */}
        <aside style={{ ...styles.sidePanel, width: isLeftCollapsed ? '40px' : leftWidth }}>
          {!isLeftCollapsed && (
            <div style={styles.panelBody}>
              <div style={styles.panelHeader}><Database size={18} /> <span>Project Options</span></div>
              <label style={styles.label}>Base Package</label>
              <input style={styles.panelInput} defaultValue="com.attickok.ulmus" />
            </div>
          )}
          <button style={styles.collapseBtn} onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}>
            {isLeftCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
          {!isLeftCollapsed && <div style={styles.resizerRight} onMouseDown={startResizing('left')} />}
        </aside>

        {/* CENTER: Canvas */}
        <section style={styles.canvasArea}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView style={{ background: 'transparent' }}>
            <Background color="#BFFF00" gap={40} size={1} opacity={0.05} />
          </ReactFlow>
          
          {/* 복구된 통합형 가변 툴바 */}
          <div style={styles.bottomToolbarContainer}>
            <div style={{...styles.unifiedToolbar, paddingRight: selectedNode ? '15px' : '8px'}}>
              <button style={styles.circleBtnPrimary} onClick={onAddRelation}><Plus size={22} /></button>
              <div style={styles.divider} />
              <button style={styles.circleBtn}><RotateCcw size={18} /></button>
              <button style={styles.circleBtn}><RotateCw size={18} /></button>
              
              {/* 선택 시 튀어나오는 액션 */}
              <div style={{ ...styles.innerActionContainer, width: selectedNode ? '100px' : '0px', opacity: selectedNode ? 1 : 0, marginLeft: selectedNode ? '10px' : '0px' }}>
                <div style={styles.divider} />
                <button title="Delete" style={styles.circleBtnDelete}><Trash2 size={18} /></button>
                <button title="Download" style={styles.circleBtnWhite}><Download size={18} /></button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside style={{ ...styles.sidePanel, width: isRightCollapsed ? '40px' : rightWidth }}>
          {!isRightCollapsed && <div style={styles.resizerLeft} onMouseDown={startResizing('right')} />}
          <button style={{...styles.collapseBtn, left: '-40px'}} onClick={() => setIsRightCollapsed(!isRightCollapsed)}>
            {isRightCollapsed ? <PanelRightOpen size={16} /> : <PanelRightClose size={16} />}
          </button>
          {!isRightCollapsed && (
            <div style={styles.panelBody}>
              {selectedNode ? (
                <>
                  <div style={styles.panelHeader}><Layers size={18} /> <span>{selectedNode.data.label}</span></div>
                  <label style={styles.label}>Table Name</label>
                  <input style={styles.panelInput} defaultValue={selectedNode.data.label} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <span style={styles.label}>Attributes</span>
                    <Plus size={14} style={{ cursor: 'pointer', color: '#BFFF00' }} onClick={() => setIsModalOpen(true)} />
                  </div>
                  <div style={styles.attrList}>
                    {selectedNode.data.columns?.map((col, idx) => (
                      <div key={idx} style={styles.attrItem}><span>{col}</span><ChevronRight size={14} opacity={0.3} /></div>
                    ))}
                  </div>
                </>
              ) : <div style={styles.emptyState}>No selection</div>}
            </div>
          )}
        </aside>
      </main>

      <ColumnDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={onAddColumn} />
    </div>
  );
};

const ProjectDetailPage = () => <ReactFlowProvider><ProjectDetailContent /></ReactFlowProvider>;

const styles = {
  wrapper: { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#000', color: '#fff' },
  topNav: { height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', background: 'rgba(0,0,0,0.5)', zIndex: 10 },
  projectTitle: { fontSize: '16px', color: '#fff', opacity: 0.8 },
  mainContainer: { flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' },
  sidePanel: { background: 'rgba(15, 15, 15, 0.85)', backdropFilter: 'blur(15px)', position: 'relative', transition: 'width 0.1s ease-out', zIndex: 20 },
  resizerRight: { position: 'absolute', right: 0, top: 0, width: '4px', height: '100%', cursor: 'col-resize', background: 'rgba(191, 255, 0, 0.1)' },
  resizerLeft: { position: 'absolute', left: 0, top: 0, width: '4px', height: '100%', cursor: 'col-resize', background: 'rgba(191, 255, 0, 0.1)' },
  collapseBtn: { position: 'absolute', top: '10px', right: '-30px', width: '30px', height: '30px', background: 'rgba(15, 15, 15, 0.8)', border: 'none', color: '#BFFF00', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '0 4px 4px 0' },
  panelHeader: { padding: '20px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#BFFF00', fontSize: '14px' },
  panelBody: { padding: '0 20px', width: '100%', overflow: 'hidden' },
  canvasArea: { flex: 1, position: 'relative', zIndex: 1 },
  label: { fontSize: '10px', color: '#666', marginBottom: '8px', display: 'block', letterSpacing: '1px' },
  panelInput: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px', color: '#fff', marginBottom: '15px', outline: 'none' },
  attrList: { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' },
  attrItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', fontSize: '13px' },
  bottomToolbarContainer: { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)' },
  unifiedToolbar: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 15px', background: 'rgba(30, 30, 30, 0.9)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  circleBtnPrimary: { width: '40px', height: '40px', borderRadius: '50%', background: '#BFFF00', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  circleBtn: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  circleBtnDelete: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255, 75, 75, 0.15)', color: '#ff4b4b', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  circleBtnWhite: { width: '36px', height: '36px', borderRadius: '50%', background: '#fff', color: '#000', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  divider: { width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' },
  innerActionContainer: { display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  emptyState: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '12px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalContent: { background: '#111', width: '360px', padding: '25px', borderRadius: '15px', border: '1px solid rgba(191, 255, 0, 0.3)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  modalBody: { display: 'flex', flexDirection: 'column', gap: '15px' },
  modalInput: { background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none' },
  modalSelect: { background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: '#fff' },
  row: { display: 'flex', gap: '10px' },
  saveBtn: { width: '100%', background: '#BFFF00', border: 'none', padding: '15px', borderRadius: '8px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer' }
};

export default ProjectDetailPage;