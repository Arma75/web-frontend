import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  memo,
} from 'react';

import { useParams } from 'react-router-dom';

import ReactFlow, {
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MarkerType,
  useOnSelectionChange,
} from 'reactflow';

import 'reactflow/dist/style.css';

import {
  Plus,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  X,
  Layers,
  Database,
  ChevronRight,
} from 'lucide-react';

import ulmusApi from './api/ulmusApi';
import RelationNode from './components/nodes/RelationNode2';

/* =========================================================
   RELATION NODE
========================================================= */


/* =========================================================
   NODE TYPES
========================================================= */

const nodeTypes = {
  relation: RelationNode,
};

/* =========================================================
   MODAL
========================================================= */

const ColumnDetailModal = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [colName, setColName] =
    useState('');

  if (!isOpen) return null;

  return (
    <div
      style={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        style={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h3
            style={{
              margin: 0,
              color: '#BFFF00',
            }}
          >
            Add Column
          </h3>

          <button
            onClick={onClose}
            style={styles.iconBtn}
          >
            <X color="#fff" />
          </button>
        </div>

        <div style={styles.modalBody}>
          <label style={styles.label}>
            Column Name
          </label>

          <input
            style={styles.modalInput}
            value={colName}
            onChange={(e) =>
              setColName(e.target.value)
            }
            placeholder="e.g. user_id"
          />
        </div>

        <button
          style={styles.saveBtn}
          onClick={() => {
            onSave(colName);
            setColName('');
            onClose();
          }}
        >
          Add Column
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   MAIN
========================================================= */

const ProjectDetailContent = () => {
  const { id } = useParams();

  const [nodes, setNodes, onNodesChange] =
    useNodesState([]);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState([]);

  const [selectedNode, setSelectedNode] =
    useState(null);

  const [selectedNodes, setSelectedNodes] =
    useState([]);

  const [projectName, setProjectName] =
    useState('UntitledProject');

  const [teamName, setTeamName] =
    useState('UlmusTeam');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [leftWidth, setLeftWidth] =
    useState(280);

  const [rightWidth, setRightWidth] =
    useState(320);

  const [relationType, setRelationType] =
    useState('1:N');

  const nodeIdRef = useRef(0);

  /* =========================================================
     LOAD
  ========================================================= */

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await ulmusApi.get(
          `/projects/${id}`
        );

        const project = response.data;

        if (project.name) {
          setProjectName(project.name);
        }

        if (project.schemaJson) {
          const {
            nodes: savedNodes,
            edges: savedEdges,
          } = JSON.parse(project.schemaJson);

          setNodes(savedNodes || []);
          setEdges(savedEdges || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProject();
  }, [id]);

  /* =========================================================
     SELECTION
  ========================================================= */

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNodes(nodes);
      setSelectedNode(nodes[0] || null);
    },
  });

  /* =========================================================
     CONNECT
  ========================================================= */

  const getRelationMarker = () => {
    switch (relationType) {
      case '1:1':
        return MarkerType.ArrowClosed;

      case '1:N':
        return MarkerType.Arrow;

      case 'N:N':
        return MarkerType.ArrowClosed;

      default:
        return MarkerType.Arrow;
    }
  };

  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,

        type: 'smoothstep',

        animated: false,

        style: {
          stroke: '#BFFF00',
          strokeWidth: 1.5,
        },

        markerEnd: {
          type: getRelationMarker(),
          color: '#BFFF00',
        },

        data: {
          relationType,
        },

        label: relationType,

        labelStyle: {
          fill: '#BFFF00',
          fontSize: 11,
        },
      };

      setEdges((eds) => addEdge(edge, eds));
    },

    [relationType]
  );

  /* =========================================================
     ADD TABLE
  ========================================================= */

  const onAddRelation = useCallback(() => {
    const id = `${++nodeIdRef.current}`;

    const newNode = {
      id,

      type: 'relation',

      position: {
        x: 400,
        y: 200,
      },

      data: {
        id,
        label: `TABLE_${id}`,
        columns: [
          'id',
          'created_at',
        ],
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  /* =========================================================
     ADD COLUMN
  ========================================================= */

  const onAddColumn = (colName) => {
    if (!selectedNode || !colName) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,

            data: {
              ...node.data,

              columns: [
                ...(node.data.columns || []),
                colName,
              ],
            },
          };
        }

        return node;
      })
    );
  };

  /* =========================================================
     RESIZE
  ========================================================= */

  const startResizing =
    (direction) => (e) => {
      const startX = e.clientX;

      const startWidth =
        direction === 'left'
          ? leftWidth
          : rightWidth;

      const onMouseMove = (moveEvent) => {
        const delta =
          direction === 'left'
            ? moveEvent.clientX - startX
            : startX - moveEvent.clientX;

        const newWidth = startWidth + delta;

        if (newWidth > 260 && newWidth < 600) {
          direction === 'left'
            ? setLeftWidth(newWidth)
            : setRightWidth(newWidth);
        }
      };

      const onMouseUp = () => {
        document.removeEventListener(
          'mousemove',
          onMouseMove
        );

        document.removeEventListener(
          'mouseup',
          onMouseUp
        );
      };

      document.addEventListener(
        'mousemove',
        onMouseMove
      );

      document.addEventListener(
        'mouseup',
        onMouseUp
      );
    };

  /* =========================================================
     DELETE
  ========================================================= */

  const onDeleteSelected = () => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.filter(
        (n) => n.id !== selectedNode.id
      )
    );

    setEdges((eds) =>
      eds.filter(
        (e) =>
          e.source !== selectedNode.id &&
          e.target !== selectedNode.id
      )
    );

    setSelectedNode(null);
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div style={styles.canvasShell}>
      {/* GRID GLOW */}
      <div style={styles.gridGlow} />

      {/* FLOW */}
      <div style={styles.flowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          onPaneClick={() => {
            setSelectedNode(null);
            setSelectedNodes([]);
          }}
          style={styles.flow}
        >
          <Background
            gap={32}
            size={1}
            color="rgba(255,255,255,0.08)"
          />
        </ReactFlow>
      </div>

      {/* HEADER */}
      <header style={styles.topHeader}>
        <div style={styles.headerInner}>
          <input
            value={projectName}
            onChange={(e) => {
              const filtered =
                e.target.value.replace(
                  /[^a-zA-Z0-9-_]/g,
                  ''
                );

              setProjectName(filtered);
            }}
            style={styles.projectTitleInput}
            placeholder="ProjectName"
          />
        </div>
      </header>

      {/* LEFT PANEL */}
      <aside
        style={{
          ...styles.floatingPanel,
          width: leftWidth,
          left: 24,
        }}
      >
        <div style={styles.panelBody}>
          <div style={styles.panelHeader}>
            <Database size={18} />
            <span>Project Info</span>
          </div>

          <label style={styles.label}>
            Team Name
          </label>

          <input
            style={styles.panelInput}
            value={teamName}
            onChange={(e) => {
              const filtered =
                e.target.value.replace(
                  /[^a-zA-Z0-9-_]/g,
                  ''
                );

              setTeamName(filtered);
            }}
          />

          <label style={styles.label}>
            Project Name
          </label>

          <input
            style={styles.panelInput}
            value={projectName}
            onChange={(e) => {
              const filtered =
                e.target.value.replace(
                  /[^a-zA-Z0-9-_]/g,
                  ''
                );

              setProjectName(filtered);
            }}
          />
        </div>

        <div
          style={styles.resizerRight}
          onMouseDown={startResizing('left')}
        />
      </aside>

      {/* RIGHT PANEL */}
      <aside
        style={{
          ...styles.floatingPanel,
          width: rightWidth,
          right: 24,
        }}
      >
        <div
          style={styles.resizerLeft}
          onMouseDown={startResizing('right')}
        />

        <div style={styles.panelBody}>
          {selectedNodes.length === 0 && (
            <div style={styles.emptyState}>
              Select a table
            </div>
          )}

          {selectedNodes.length === 1 &&
            selectedNode && (
              <>
                <div style={styles.panelHeader}>
                  <Layers size={18} />

                  <span>
                    {selectedNode.data.label}
                  </span>
                </div>

                <label style={styles.label}>
                  Table Name
                </label>

                <input
                  style={styles.panelInput}
                  value={selectedNode.data.label}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /[^a-zA-Z0-9-_]/g,
                        ''
                      );

                    setNodes((nds) =>
                      nds.map((n) =>
                        n.id === selectedNode.id
                          ? {
                              ...n,

                              data: {
                                ...n.data,
                                label: value,
                              },
                            }
                          : n
                      )
                    );
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                    marginTop: '20px',
                  }}
                >
                  <span style={styles.label}>
                    Columns
                  </span>

                  <Plus
                    size={16}
                    style={{
                      cursor: 'pointer',
                      color: '#BFFF00',
                    }}
                    onClick={() =>
                      setIsModalOpen(true)
                    }
                  />
                </div>

                <div style={styles.attrList}>
                  {selectedNode.data.columns?.map(
                    (col, idx) => (
                      <div
                        key={idx}
                        style={styles.attrItem}
                      >
                        <span>{col}</span>

                        <ChevronRight
                          size={14}
                          opacity={0.3}
                        />
                      </div>
                    )
                  )}
                </div>
              </>
            )}

          {selectedNodes.length > 1 && (
            <div style={styles.multiSelectBox}>
              <Download size={20} />

              <button style={styles.sqlBtn}>
                Download SQL
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* TOOLBAR */}
      <div style={styles.floatingToolbar}>
        <button
          style={styles.toolbarPrimaryBtn}
          onClick={onAddRelation}
        >
          <Plus size={20} />
        </button>

        <button style={styles.toolbarBtn}>
          <RotateCcw size={18} />
        </button>

        <button style={styles.toolbarBtn}>
          <RotateCw size={18} />
        </button>

        <select
          style={styles.relationSelect}
          value={relationType}
          onChange={(e) =>
            setRelationType(
              e.target.value
            )
          }
        >
          <option>1:1</option>
          <option>1:N</option>
          <option>N:N</option>
        </select>

        {selectedNode && (
          <button
            style={styles.toolbarDeleteBtn}
            onClick={onDeleteSelected}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* MODAL */}
      <ColumnDetailModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onSave={onAddColumn}
      />
    </div>
  );
};

/* =========================================================
   PAGE
========================================================= */

const ProjectDetailPage = () => {
  return (
    <ReactFlowProvider>
      <ProjectDetailContent />
    </ReactFlowProvider>
  );
};

/* =========================================================
   STYLES
========================================================= */

const styles = {
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

export default ProjectDetailPage;