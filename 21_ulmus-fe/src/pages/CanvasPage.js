import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import RelationNode from '../components/nodes/RelationNode2';
import EntityErdNode from '../components/canvas/EntityErdNode';
import CanvasFloatingToolbar from '../components/canvas/CanvasFloatingToolbar';
import CanvasZoomHud from '../components/canvas/CanvasZoomHud';

const nodeTypes = { erd: RelationNode };

const nodeTypesWithShowType = {
  // 기존 'erd': RelationNode 를 사용한다면, RelationNode 컴포넌트 자체를 수정해야 합니다.
  // 여기서는 RelationNode3 컴포넌트를 사용한다고 가정하고, RelationNode3 컴포넌트 props로 showType 전달
  erd: ({ data, selected, showType }) => ( // RelationNode 컴포넌트 props 구조에 맞게 수정
    <RelationNode // RelationNode 컴포넌트 사용 시
      data={{ ...data, showType: showType }} // !!! showType을 data 객체에 포함하여 전달 !!!
      selected={selected}
      // dragging={dragging} // 필요한 다른 props도 전달
    />
  ),
  // entityErdNode: EntityErdNode, // EntityErdNode도 필요하다면 여기에 등록
};
const ZOOM_HUD_MS = 900;

function cloneFlowState(nodes, edges) {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
  };
}

/** ReactFlow 트리 안에서 선택 ID 동기화 */
function SelectionSync({ onChange }) {
  const handleSelection = useCallback(
    ({ nodes: selected }) => {
      onChange(selected.map((n) => n.id));
    },
    [onChange]
  );
  useOnSelectionChange({ onChange: handleSelection });
  return null;
}

function CanvasFlowBody() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [, setHistVersion] = useState(0);
  const [showType, setShowType] = useState(0); // showType 상태 (1, 2, 3)

  // F1 키 이벤트 핸들러
  // showType 변경 핸들러 수정
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'F1') {
      event.preventDefault();
      // 0 -> 1 -> 2 -> 0 순환 (나머지 연산자 사용)
      setShowType(prev => (prev + 1) % 3);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  const nodeTypes = useMemo(() => ({
    erd: (props) => (
      <RelationNode 
        {...props} 
        data={{ ...props.data, showType }} // 외부 scope의 showType을 직접 주입
      />
    )
  }), [showType]); // [showType]이 바뀔 때마다 이 객체가 갱신됨


  const idRef = useRef(0);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const historyPast = useRef([]);
  const historyFuture = useRef([]);
  const lastZoomRef = useRef(1);
  const zoomHudTimerRef = useRef(null);
  const [zoomHud, setZoomHud] = useState({ visible: false, percent: 100 });

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);
  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const bumpHist = useCallback(() => {
    setHistVersion((v) => v + 1);
  }, []);

  const pushPastFromRefs = useCallback(() => {
    historyPast.current.push(
      cloneFlowState(nodesRef.current, edgesRef.current)
    );
    historyFuture.current = [];
    bumpHist();
  }, [bumpHist]);

  const handleAddEntity = useCallback(() => {
    pushPastFromRefs();
    idRef.current += 1;
    const n = idRef.current;
    setNodes((curr) => {
      const i = curr.length;
      return [
        ...curr,
        {
          id: `erd-${n}`,
          type: 'erd',
          position: {
            x: 80 + (i % 5) * 200,
            y: 80 + Math.floor(i / 5) * 140,
          },
          data: {
            label: 'UserProfiles',
            comment: '사용자 추가 정보 테이블',
            columns: [
              { label: 'profile_id', comment: '프로필 고유 ID', type: 'INT', length: 11, isPrimaryKey: true, isForeignKey: true, isUnique: true, isNullable: false, isAutoIncrement: true, defaultValue: null, isDefaultValueFunction: false },
              { label: 'user_id', comment: '사용자 ID (FK, Unique)', type: 'INT', length: 11, isPrimaryKey: false, isForeignKey: false, isUnique: true, isNullable: false, isAutoIncrement: false, defaultValue: null, isDefaultValueFunction: false },
              { label: 'bio', comment: '자기소개', type: 'TEXT', length: null, isPrimaryKey: false, isUnique: false, isForeignKey: false, sNullable: true, isAutoIncrement: false, defaultValue: '', isDefaultValueFunction: false },
              { label: 'avatar_url', comment: '아바타 URL', type: 'VARCHAR', length: 255, isPrimaryKey: false, isForeignKey: true, isUnique: false, isNullable: true, isAutoIncrement: false, defaultValue: null, isDefaultValueFunction: false },
            ],
          }
        },
      ];
    });
  }, [setNodes, pushPastFromRefs]);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) return;
    pushPastFromRefs();
    const idSet = new Set(selectedIds);
    setNodes((nds) => nds.filter((node) => !idSet.has(node.id)));
    setEdges((eds) =>
      eds.filter(
        (e) => !idSet.has(e.source) && !idSet.has(e.target)
      )
    );
    setSelectedIds([]);
  }, [selectedIds, setNodes, setEdges, pushPastFromRefs]);

  const handleUndo = useCallback(() => {
    if (historyPast.current.length === 0) return;
    const current = cloneFlowState(nodesRef.current, edgesRef.current);
    const prev = historyPast.current.pop();
    historyFuture.current.push(current);
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setSelectedIds([]);
    bumpHist();
  }, [setNodes, setEdges, bumpHist]);

  const handleRedo = useCallback(() => {
    if (historyFuture.current.length === 0) return;
    const current = cloneFlowState(nodesRef.current, edgesRef.current);
    const next = historyFuture.current.pop();
    historyPast.current.push(current);
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedIds([]);
    bumpHist();
  }, [setNodes, setEdges, bumpHist]);

  const handleMove = useCallback((_, viewport) => {
    const z = viewport.zoom;
    if (Math.abs(z - lastZoomRef.current) < 0.0005) return;
    lastZoomRef.current = z;
    const percent = Math.min(500, Math.max(5, Math.round(z * 100)));
    setZoomHud({ visible: true, percent });
    if (zoomHudTimerRef.current) clearTimeout(zoomHudTimerRef.current);
    zoomHudTimerRef.current = setTimeout(() => {
      setZoomHud((prev) => ({ ...prev, visible: false }));
      zoomHudTimerRef.current = null;
    }, ZOOM_HUD_MS);
  }, []);

  useEffect(
    () => () => {
      if (zoomHudTimerRef.current) clearTimeout(zoomHudTimerRef.current);
    },
    []
  );

  const canUndo = historyPast.current.length > 0;
  const canRedo = historyFuture.current.length > 0;
  const canDelete = selectedIds.length > 0;

  return (
    <div
      className="canvas-page-flow-temp"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at top, #111827 0%, #050816 45%, #020308 100%)',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onMove={handleMove}
        fitView
        minZoom={0.15}
        maxZoom={2}
        style={{ width: '100%', height: '100%' }}
      >
        <Background
          id="canvas-grid"
          variant={BackgroundVariant.Lines}
          gap={24}
          size={1}
          color="rgba(255, 255, 255, 0.1)"
          lineWidth={1}
        />
        <SelectionSync onChange={setSelectedIds} />
      </ReactFlow>
      <CanvasZoomHud visible={zoomHud.visible} percent={zoomHud.percent} />
      <CanvasFloatingToolbar
        onAddClick={handleAddEntity}
        onDeleteClick={handleDelete}
        onUndoClick={handleUndo}
        onRedoClick={handleRedo}
        canDelete={canDelete}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
}

export default function CanvasPage() {
  return (
    <ReactFlowProvider>
      <CanvasFlowBody />
    </ReactFlowProvider>
  );
}
