import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  ConnectionLineType,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { mockCellData, mockObjectData } from "./mockData";
import ObjectNode from "./ObjectNode";
import BlockNode from "./BlockNode";
import dagre from "dagre";
import { CellApi } from "../../api/cellApi";
import { ObjectApi } from "../../api/objectApi";
import { useAuthStore } from '../stores/authStore'

// const initialNodes = [
//   { id: "1", position: { x: 0, y: 0 }, type: "object", data: { label: "1" } },
//   { id: "2", position: { x: 0, y: 0 }, type: "block", data: { label: "2" } },
// ];
// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));

// const nodeWidth = 172;
// const nodeHeight = 36;

// const getLayoutedElements = async (direction = "TB") => {
//   const res = await initGraph();
//   const nodes = res[0];
//   const edges = res[1];
//   const isHorizontal = direction === "LR";
//   dagreGraph.setGraph({ rankdir: direction });

//   nodes.forEach((node) => {
//     dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
//   });

//   edges.forEach((edge) => {
//     dagreGraph.setEdge(edge.source, edge.target);
//   });

//   dagre.layout(dagreGraph);

//   nodes.forEach((node) => {
//     const nodeWithPosition = dagreGraph.node(node.id);
//     node.targetPosition = isHorizontal ? "left" : "top";
//     node.sourcePosition = isHorizontal ? "right" : "bottom";

//     // We are shifting the dagre node position (anchor=center center) to the top left
//     // so it matches the React Flow node anchor point (top left).
//     node.position = {
//       x: nodeWithPosition.x - nodeWidth / 2,
//       y: nodeWithPosition.y - nodeHeight / 2,
//     };

//     return node;
//   });
//   console.log(edges);


//   return { nodes, edges };
// };
// const initGraph = async () => {
//   try {
//     const objects = await ObjectApi.getObjects('ccb8ecf9-abc6-49b2-a2eb-5fea55d1f692');
//     if (!objects) throw new Error("Couldnt fetch objects");
//     const cellsToFetch = [];
//     const objectEdges = [];
//     const objectNodes = objects.map((object) => {
//       // get left cell ids to fetch
//       if(object.leftCol.cellIDs.length > 0) {
//         object.leftCol.cellIDs.forEach((cellID) => {
//           cellsToFetch.push(cellID);
//           objectEdges.push({
//             id: `${object._id}_${cellID}`,
//             from: object._id,
//             to: cellID,            type: 'smoothstep', 
//             animated: true
//           })
//         })
//       }
//       // get right cell ids to fetch
//       if(object.rightCol.cellIDs.length > 0) {
//         object.rightCol.cellIDs.forEach((cellID) => {
//           cellsToFetch.push(cellID);
//           objectEdges.push({
//             id: `${object._id}_${cellID}`,
//             from: object._id,
//             to: cellID,
//             type: 'smoothstep', 
//             animated: true
//           })
//         })
//       }

//       return {
//         id: object._id,
//         position: { x: 0, y: 0 },
//         // type: "object",
//         data: { label: object.title },
//       };
//     });

//     // fetch cells
//     const cells = await CellApi.getCellsByIds(cellsToFetch);
//     if(!cells) throw new Error("Couldnt fetch cells");

//     // add node for each cell

//     const cellNodes = cells.map((cell) => {
//       return {
//         id: cell._id,
//         position: { x: 0, y: 0 },
//         // type: "block",
//         data: { label: 'cell.title' },
//       };

//     });

//     return [[...objectNodes, ...cellNodes], objectEdges];


//   } catch (err) {
//     console.log(err);
//   }
// };
// ;
// const { nodes: layoutedNodes, edges: layoutedEdges } = {};


// function Graph() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
//     []
//   );
//   const onLayout = useCallback(
//     async (direction) => {
//       const { nodes: layoutedNodes, edges: layoutedEdges } =
//        await getLayoutedElements(direction);
//       console.log(edges);

//       setNodes([...layoutedNodes]);
//       setEdges([...layoutedEdges]);
//     },
//     [nodes, edges]
//   );

//   return (
//     <div style={{ width: "80vw", height: "80vh", margin: "0 auto" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         connectionLineType={ConnectionLineType.SmoothStep}
//         fitView
//       >
//         <Controls />
//         <MiniMap/>
        
//       </ReactFlow>

//       <div className="controls">
//         <button onClick={() => onLayout("TB")}>vertical layout</button>
//         <button onClick={() => onLayout("LR")}>horizontal layout</button>
//       </div>
//     </div>
//   );
// }

// export default Graph;
