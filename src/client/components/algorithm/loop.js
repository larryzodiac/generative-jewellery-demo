// ------------------------------------------------- //
// Evan MacHale - N00150552
// 20.01.19
// Three.js
// Loop Subdivision
// ------------------------------------------------- //

import * as THREE from 'three';
import {
  generateLookupsLoop,
  newFace,
  getEdge,
  createNewUv,
  midpoint,
} from './structure-query-functions.js';

// ------------------------------------------------- //

class SubdivisionModifier {
  constructor(subdivisions, adjacent_weight, edge_point_weight, connecting_edges_weight) {
    this.subdivisions = (subdivisions === undefined) ? 1 : subdivisions;
    this.adjacent_weight = adjacent_weight;
    this.edge_point_weight = edge_point_weight;
    this.connecting_edges_weight = connecting_edges_weight;
  }
}

// ------------------------------------------------- //

SubdivisionModifier.prototype.modify = function (geometry) {
  geometry = geometry.clone();
  geometry.mergeVertices();
  const iterations = this.subdivisions;
  for (let i = 0; i < iterations; i++) {
    this.subdivide(geometry);
  }
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
  return geometry;
};

// ------------------------------------------------- //

// The big boy function that executes our algorithm.
SubdivisionModifier.prototype.subdivide = function (geometry) {
  const sourceVertices = geometry.vertices;
  const sourceFaces = geometry.faces;
  const sourceUvs = geometry.faceVertexUvs[0];

  let newVertices; let newFaces; const
    newUvs = [];

  const vertexHolder = new THREE.Vector3();

  // ------------------------------------------------- //
  // Step 0
  // Sort out our data structure for referencing points.
  // ------------------------------------------------- //

  const hasUvs = sourceUvs !== undefined && sourceUvs.length > 0;
  const sourceVerticesRelationships = new Array(sourceVertices.length);
  const sourceEdges = {};
  generateLookupsLoop(sourceVertices, sourceFaces, sourceVerticesRelationships, sourceEdges);

  // ------------------------------------------------- //
  // Step 1
  // For each edge, create a new Edge Vertex, then position it.
  // ------------------------------------------------- //

  const newEdgeVertices = [];
  let oppositePoint;
  let newEdgePoint;

  const adjacentVertexWeight = this.adjacent_weight;
  const edgeVertexWeight = this.edge_point_weight;

  // Keep track of edge/faces of edge.
  let currentEdge;
  let face;
  let connectedFaces; // Always be 2.
  // Faces held in geometry object have three vectors of key a, b or c.
  const faceVertices = ['a', 'b', 'c'];

  // For each edge create new edge point.
  for (const i in sourceEdges) {
    currentEdge = sourceEdges[i];
    newEdgePoint = new THREE.Vector3();
    connectedFaces = currentEdge.faces.length;
    // Average of points on the edge
    newEdgePoint.addVectors(currentEdge.a, currentEdge.b).multiplyScalar(edgeVertexWeight);
    vertexHolder.set(0, 0, 0);
    // For both faces, for every point on given face, find the third point.
    for (let j = 0; j < connectedFaces; j++) {
      face = currentEdge.faces[j];
      for (let k = 0; k < 3; k++) {
        oppositePoint = sourceVertices[face[faceVertices[k]]]; // a, b, c
        if (oppositePoint !== currentEdge.a && oppositePoint !== currentEdge.b) break;
      }
      vertexHolder.add(oppositePoint);
    }
    // Average of two opposite points
    vertexHolder.multiplyScalar(adjacentVertexWeight);
    // Combine values of edge and opposite points to find new point.
    newEdgePoint.add(vertexHolder);
    // Keeps count of creation order.
    currentEdge.newEdgePoint = newEdgeVertices.length;
    newEdgeVertices.push(newEdgePoint); // List of edge points.
  } // End for loop.

  // ------------------------------------------------- //
  // Step 2
  // Reposition each source vertex.
  // ------------------------------------------------- //

  // Keep track of every connecting variable to our given point.
  let connectingEdge; let connectingPoint; let
    connectingEdges;
  // We iterate through sourceVertices + push new vertices to array.
  let oldVertex; let
    newSourceVertex;
  // List of new positions for old vertices.
  const newSourceVertices = [];

  let beta; let sourceVertexWeight; let
    connectingVertexWeight; // Algorithm weights

  for (let i = 0; i < sourceVertices.length; i++) {
    oldVertex = sourceVertices[i];
    // find all connecting edges (using lookupTable)
    connectingEdges = sourceVerticesRelationships[i].edges;
    const numberOfConnectingEdges = this.connecting_edges_weight;
    // Loop's original beta formula
    // beta = 1 / n * ( 5/8 - Math.pow( 3/8 + 1/4 * Math.cos( 2 * Math. PI / n ), 2) );
    beta = 3 / (8 * numberOfConnectingEdges);
    connectingVertexWeight = beta;
    sourceVertexWeight = 1 - numberOfConnectingEdges * beta;
    // Apply weight to source vertex.
    newSourceVertex = oldVertex.clone().multiplyScalar(sourceVertexWeight); // 1 - nβ
    // For each edge, find each point that this point is related to.
    vertexHolder.set(0, 0, 0);
    for (let j = 0; j < numberOfConnectingEdges; j++) {
      connectingEdge = connectingEdges[j];
      connectingPoint = connectingEdge.a !== oldVertex ? connectingEdge.a : connectingEdge.b;
      vertexHolder.add(connectingPoint);
    }
    // Apply weight to connecting vertices.
    vertexHolder.multiplyScalar(connectingVertexWeight); // β
    newSourceVertex.add(vertexHolder);
    // List of new positions for old vertices.
    newSourceVertices.push(newSourceVertex);
  } // End for loop.

  // ------------------------------------------------- //
  // Step 3
  // Generate faces between source vertices + edge vertices.
  // ------------------------------------------------- //

  newVertices = newSourceVertices.concat(newEdgeVertices);
  const sl = newSourceVertices.length;

  let edge1; let edge2; let
    edge3;

  newFaces = [];
  let uv; let x0; let x1; let
    x2;
  const x3 = new THREE.Vector2();
  const x4 = new THREE.Vector2();
  const x5 = new THREE.Vector2();

  // For all old faces create four new faces inside it.
  // Four faces -> means three more edges, see above.
  for (let i = 0; i < sourceFaces.length; i++) {
    face = sourceFaces[i];
    // find the 3 new edges vertex of each old face
    edge1 = getEdge(face.a, face.b, sourceEdges).newEdgePoint + sl;
    edge2 = getEdge(face.b, face.c, sourceEdges).newEdgePoint + sl;
    edge3 = getEdge(face.c, face.a, sourceEdges).newEdgePoint + sl;
    // create 4 faces.
    newFace(newFaces, edge1, edge2, edge3);
    newFace(newFaces, face.a, edge1, edge3);
    newFace(newFaces, face.b, edge2, edge1);
    newFace(newFaces, face.c, edge3, edge2);
    // create 4 new uv's
    if (hasUvs) {
      uv = sourceUvs[i];
      x0 = uv[0];
      x1 = uv[1];
      x2 = uv[2];
      x3.set(midpoint(x0.x, x1.x), midpoint(x0.y, x1.y));
      x4.set(midpoint(x1.x, x2.x), midpoint(x1.y, x2.y));
      x5.set(midpoint(x0.x, x2.x), midpoint(x0.y, x2.y));
      createNewUv(newUvs, x3, x4, x5);
      createNewUv(newUvs, x0, x3, x5);
      createNewUv(newUvs, x1, x4, x3);
      createNewUv(newUvs, x2, x5, x4);
    }
  } // End for loop
  // Overwrite old arrays
  geometry.vertices = newVertices;
  geometry.faces = newFaces;
  if (hasUvs) geometry.faceVertexUvs[0] = newUvs;
  // console.log('done');
};

export default SubdivisionModifier;
