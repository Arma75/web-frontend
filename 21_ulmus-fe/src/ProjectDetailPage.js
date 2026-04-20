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
import StarBackground from './StarBackground';
import { ArrowLeft, Settings, Plus, RotateCcw, RotateCw, Trash2, Download } from 'lucide-react';

const ProjectDetailContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [projectTitle, setProjectTitle] = useState("New Cosmic Project");
  const nodeIdRef = useRef(0);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setIsSelected(nodes.length > 0 || edges.length > 0);
    },
  });

  const onAddRelation = useCallback(() => {
    const id = `${++nodeIdRef.current}`;
    const newNode = {
      id,
      data: { label: `Relation ${id}` },
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      style: { 
        background: 'rgba(10, 10, 10, 0.8)', 
        color: '#fff', 
        border: '1px solid rgba(191, 255, 0, 0.4)',
        borderRadius: '8px',
        padding: '10px',
        backdropFilter: 'blur(5px)',
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#BFFF00' } }, eds));
  }, [setEdges]);

  return (
    <div style={styles.wrapper}>
      <StarBackground />
      
      {/* --- 상단 영역 (투명) --- */}
      <header style={styles.topNav}>
        <button style={styles.iconBtn} onClick={() => window.history.back()}>
          <ArrowLeft size={24} color="#BFFF00" />
        </button>

        <div style={styles.navCenter}>
          {isEditingTitle ? (
            <input 
              autoFocus
              style={styles.titleInput}
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            />
          ) : (
            <h2 style={styles.projectTitle} onClick={() => setIsEditingTitle(true)}>
              {projectTitle}
            </h2>
          )}
        </div>

        <button style={styles.iconBtn}>
          <Settings size={24} color="#BFFF00" />
        </button>
      </header>

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
          <Background color="#BFFF00" gap={40} size={1} opacity={0.05} />
        </ReactFlow>
      </div>

      {/* --- 하단 통합형 원형 툴바 --- */}
      <div style={styles.bottomArea}>
        <div style={{
          ...styles.unifiedToolbar,
          paddingRight: isSelected ? '15px' : '8px' // 선택 시 우측 여백 조정
        }}>
          {/* 1. 메인 액션: 추가 */}
          <button title="Add Relation" style={styles.circleBtnPrimary} onClick={onAddRelation}>
            <Plus size={22} />
          </button>
          
          <div style={styles.divider} />

          {/* 2. 히스토리 액션 */}
          <button title="Undo" style={styles.circleBtn}><RotateCcw size={18} /></button>
          <button title="Redo" style={styles.circleBtn}><RotateCw size={18} /></button>

          {/* 3. 선택 시 내부에서 튀어나오는 액션 (삭제, 다운로드) */}
          <div style={{
            ...styles.innerActionContainer,
            width: isSelected ? '100px' : '0px',
            opacity: isSelected ? 1 : 0,
            marginLeft: isSelected ? '10px' : '0px'
          }}>
            <div style={styles.divider} />
            <button title="Delete" style={styles.circleBtnDelete}><Trash2 size={18} /></button>
            <button title="Download" style={styles.circleBtnWhite}><Download size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetailPage = () => (
  <ReactFlowProvider>
    <ProjectDetailContent />
  </ReactFlowProvider>
);

const styles = {
  wrapper: { width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' },
  topNav: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 40px', zIndex: 100
  },
  navCenter: { flex: 1, display: 'flex', justifyContent: 'center' },
  projectTitle: { 
    color: '#fff', fontSize: '20px', fontWeight: '500', cursor: 'text', // 포인터 커서 유지
    padding: '4px 12px'
  },
  titleInput: {
    background: 'transparent', border: 'none', borderBottom: '1.5px solid #BFFF00',
    color: '#fff', fontSize: '20px', textAlign: 'center', outline: 'none', padding: '4px 12px'
  },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '10px' },

  canvasContainer: { width: '100%', height: '100%' },

  bottomArea: {
    position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 100
  },
  unifiedToolbar: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px',
    background: 'rgba(25, 25, 25, 0.75)', backdropFilter: 'blur(20px)',
    borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  // 원형 버튼 공통
  circleBtnPrimary: { 
    width: '44px', height: '44px', borderRadius: '50%', background: '#BFFF00', 
    color: '#000', border: 'none', cursor: 'pointer', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', transition: 'transform 0.2s'
  },
  circleBtn: { 
    width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', 
    color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', opacity: 0.8
  },
  circleBtnDelete: {
    width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255, 75, 75, 0.2)', 
    color: '#ff4b4b', border: '1px solid rgba(255, 75, 75, 0.3)', cursor: 'pointer', 
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  circleBtnWhite: {
    width: '38px', height: '38px', borderRadius: '50%', background: '#fff', 
    color: '#000', border: 'none', cursor: 'pointer', display: 'flex', 
    justifyContent: 'center', alignItems: 'center'
  },
  divider: { width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' },
  
  innerActionContainer: {
    display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
};

export default ProjectDetailPage;