import { ReactFlow, useEdgesState, useNodesState, useReactFlow, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { stratify, tree } from 'd3-hierarchy';
import { useEffect, useState, type JSX } from 'react';

/**
 * Represents a slot in the playlist system.
 *
 * @property {number} id - The unique identifier for the slot.
 * @property {string} name - The name of the slot.
 * @property {number} default_next_slot_id - The identifier of the default next slot.
 */
export type Slot = {
  id: number;
  name: string;
  default_next_slot_id: number;
};

/**
 * Computes the layout for a sequence of slots and returns the nodes and edges
 * required for visualization in a tree structure.
 *
 * @param sequence - An array of `Slot` objects representing the sequence to be laid out.
 *                   Each slot may have a `default_next_slot_id` indicating its parent in the hierarchy.
 * @param containerWidth - The width of the container in which the layout will be rendered.
 *                         This is used to calculate the spacing between nodes.
 * @returns An object containing:
 *          - `nodes`: An array of node objects, each with an `id`, `data` (containing the label),
 *                     and `position` (x and y coordinates).
 *          - `edges`: An array of edge objects, each with an `id`, `source`, `target`, and `animated` flag.
 *
 * The function uses a hierarchical layout algorithm to compute the positions of nodes
 * and their connections based on the parent-child relationships defined in the sequence.
 * Nodes are spaced horizontally based on the container width and vertically with a fixed height.
 */
const computeLayout = (sequence: Slot[], containerWidth: number) => {
  if (!sequence || sequence.length === 0) return { nodes: [], edges: [] };

  const hierarchy = stratify<Slot>()
    .id((node) => String(node.id))
    .parentId((node) => (node.default_next_slot_id ? String(node.default_next_slot_id) : null));

  const root = hierarchy(sequence);

  const nodeWidth = Math.max(150, containerWidth / (sequence.length + 1));
  const nodeHeight = 100;

  const layout = tree<Slot>().nodeSize([nodeWidth, nodeHeight])(root);

  const nodes = layout.descendants().map((node) => ({
    id: String(node.id),
    data: { label: node.data.name },
    position: { x: node.x, y: -node.y },
  }));

  const edges = sequence
    .filter((item) => item.default_next_slot_id)
    .map((item) => ({
      id: `e${item.id}-${item.default_next_slot_id}`,
      source: String(item.id),
      target: String(item.default_next_slot_id),
      animated: true,
    }));

  return { nodes, edges };
};


/**
 * WorkflowGraph is a React component that renders a workflow graph using ReactFlow.
 * It dynamically adjusts the graph layout based on the provided sequence of slots
 * and the current window dimensions.
 *
 * @param {Object} props - The component props.
 * @param {Slot[]} props.sequence - An array of slots representing the workflow sequence.
 *
 * @returns {JSX.Element} A ReactFlow component displaying the workflow graph.
 *
 * @remarks
 * - The component listens to window resize events to update the graph dimensions.
 * - It uses `useReactFlow` to fit the graph view within the available space.
 * - Nodes and edges are computed using the `computeLayout` function based on the sequence and width.
 *
 * @dependencies
 * - ReactFlow: Used for rendering the graph.
 * - useNodesState, useEdgesState: Hooks for managing nodes and edges state.
 * - computeLayout: A utility function to calculate the graph layout.
 *
 * @example
 * ```tsx
 * const sequence = [
 *   { id: '1', type: 'start', data: { label: 'Start' } },
 *   { id: '2', type: 'process', data: { label: 'Process' } },
 *   { id: '3', type: 'end', data: { label: 'End' } },
 * ];
 *
 * <WorkflowGraph sequence={sequence} />
 * ```
 */
const WorkflowGraph = ({ sequence, onNodeClick }: { sequence: Slot[], onNodeClick: (event: any, target: any) => void }): JSX.Element => {
  const { fitView } = useReactFlow();
  const [{ nodes, edges }, setGraph] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [nodesState, setNodes] = useNodesState(nodes);
  const [edgesState, setEdges] = useEdgesState(edges);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const layoutedGraph = computeLayout(sequence, dimensions.width);
    setGraph(layoutedGraph);
    setNodes(layoutedGraph.nodes);
    setEdges(layoutedGraph.edges);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [sequence, dimensions, fitView, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodesState}
      edges={edgesState}
      onNodeClick={onNodeClick}
      fitView
      onPaneClick={(event) => {
        onNodeClick(event, null)
      }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnScroll
      zoomOnScroll
    />
  );
};

export { WorkflowGraph };
