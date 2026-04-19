import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  ReactFlowProvider, // 1. Provider 임포트
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  useOnSelectionChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import StarBackground from './StarBackground';
import { ArrowLeft, Settings, Plus, RotateCcw, RotateCw, Trash2, Download } from 'lucide-react';

// --- 실제 로직이 들어가는 내부 컴포넌트 ---
const ProjectDetailContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 이제 ReactFlowProvider 안에서 동작하므로 에러가 발생하지 않습니다.
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedCount(nodes.length + edges.length);
    },
  });

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#BFFF00' } }, eds));
  }, [setEdges]);

  return (
    <div style={styles.wrapper}>
      <StarBackground />
      
      {/* --- 상단 헤더 --- */}
      <header style={styles.topNav}>
        <div style={styles.navLeft}>
          <button style={styles.iconBtn} onClick={() => window.history.back()}>
            <ArrowLeft size={20} color="#BFFF00" />
          </button>
          <span style={styles.breadcrumb}>Dashboard / </span>
        </div>
        <div style={styles.navCenter}>
          <h2 style={styles.projectTitle}>My Cosmic Project</h2>
        </div>
        <div style={styles.navRight}>
          <button style={styles.iconBtn} onClick={() => setIsSettingsOpen(true)}>
            <Settings size={20} color="#BFFF00" />
          </button>
        </div>
      </header>

      {/* --- 메인 캔버스 --- */}
      <div style={styles.canvasContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          minZoom={0.1}
          maxZoom={4}
          fitView
          style={{ background: 'transparent' }}
        >
          <Background color="#BFFF00" gap={40} size={1} opacity={0.1} />
          <Controls />
        </ReactFlow>
      </div>

      {/* --- 하단 플로팅 툴바 & 액션 버튼 --- */}
      <div style={styles.bottomDock}>
        <div style={styles.toolbar}>
          <button title="Undo" style={styles.toolBtn}><RotateCcw size={18} /></button>
          <button title="Redo" style={styles.toolBtn}><RotateCw size={18} /></button>
          <div style={styles.divider} />
          <button style={styles.addBtn}>
            <Plus size={20} style={{ marginRight: '8px' }} /> Relation
          </button>
        </div>

        <div style={{
          ...styles.actionPop,
          transform: selectedCount > 0 ? 'translateY(0)' : 'translateY(100px)',
          opacity: selectedCount > 0 ? 1 : 0
        }}>
          <button style={styles.deleteBtn}><Trash2 size={18} /></button>
          <button style={styles.downloadBtn}><Download size={18} /></button>
        </div>
      </div>
    </div>
  );
};

// --- 외부로 내보낼 컴포넌트: Provider로 감싸줌 ---
const ProjectDetailPage = () => {
  return (
    <ReactFlowProvider>
      <ProjectDetailContent />
    </ReactFlowProvider>
  );
};

const styles = {
  wrapper: { width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' },
  topNav: {
    position: 'absolute', top: '20px', left: '20px', right: '20px', height: '60px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 20px', zIndex: 100, background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)', border: '1px solid rgba(191, 255, 0, 0.2)', borderRadius: '12px'
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  breadcrumb: { color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
  navCenter: { position: 'absolute', left: '50%', transform: 'translateX(-50%)' },
  projectTitle: { color: '#fff', fontSize: '18px', fontWeight: '600', letterSpacing: '1px' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  
  canvasContainer: { width: '100%', height: '100%' },

  bottomDock: {
    position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', zIndex: 100
  },
  toolbar: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px',
    background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  toolBtn: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '8px' },
  divider: { width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' },
  addBtn: {
    background: '#BFFF00', color: '#000', border: 'none', padding: '8px 16px',
    borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center'
  },

  actionPop: {
    display: 'flex', gap: '10px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  deleteBtn: { background: '#ff4444', border: 'none', color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer' },
  downloadBtn: { background: '#fff', border: 'none', color: '#000', padding: '12px', borderRadius: '50%', cursor: 'pointer' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #BFFF00', width: '400px', textAlign: 'center' },
  saveBtn: { marginTop: '20px', padding: '10px 30px', background: '#BFFF00', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default ProjectDetailPage;