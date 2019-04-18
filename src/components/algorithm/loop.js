/*
  Evan MacHale - N00150552
  18.04.19
  loop.js
*/

import * as THREE from 'three';
import {
  generateLookupsLoop,
  newFace,
  getEdge,
  createNewUv,
  midpoint
} from './structure-query-functions.js';

class SubdivisionModifier {
  constructor(subdivisions, adjacent_weight, edge_point_weight, connecting_edges_weight) {
    this.subdivisions = (subdivisions === undefined) ? 1 : subdivisions;
    this.adjacent_weight = adjacent_weight;
    this.edge_point_weight = edge_point_weight;
    this.connecting_edges_weight = connecting_edges_weight;
  }
}

SubdivisionModifier.prototype.modify = function(geometry) {
  geometry = geometry.clone();
	geometry.mergeVertices();
  const iterations = this.subdivisions;
  for (let i = 0; i < iterations; i++) {
    this.subdivide(geometry);
  }
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	return geometry;
}

SubdivisionModifier.prototype.subdivide = function(geometry) {
  const sourceVertices = geometry.vertices;
  const sourceFaces = geometry.faces;
  const sourceUvs = geometry.faceVertexUvs[0];
  let newVertices, newFaces, newUvs = [];
  const vertexHolder = new THREE.Vector3();
  const hasUvs = sourceUvs !== undefined && sourceUvs.length > 0;
  const sourceVerticesRelationships = new Array(sourceVertices.length);
  const sourceEdges = {};
  generateLookupsLoop(sourceVertices, sourceFaces, sourceVerticesRelationships, sourceEdges);
  const newEdgeVertices = [];
  let oppositePoint;
  let newEdgePoint;
  const adjacentVertexWeight = this.adjacent_weight;
  const edgeVertexWeight = this.edge_point_weight;
  let currentEdge;
  let face;
  let connectedFaces;
  const faceVertices = ['a','b','c'];
  
  for (let i in sourceEdges) {
    currentEdge = sourceEdges[i];
    newEdgePoint = new THREE.Vector3();
    connectedFaces = currentEdge.faces.length;
    newEdgePoint.addVectors(currentEdge.a, currentEdge.b).multiplyScalar(edgeVertexWeight);
    vertexHolder.set(0, 0, 0);
    for (let j = 0; j < connectedFaces; j ++) {
      face = currentEdge.faces[j];
      for (let k = 0; k < 3; k ++) {
        oppositePoint = sourceVertices[face[faceVertices[k]]]; // a, b, c
        if (oppositePoint !== currentEdge.a && oppositePoint !== currentEdge.b) break;
      }
      vertexHolder.add(oppositePoint);
    }
    vertexHolder.multiplyScalar(adjacentVertexWeight);
    newEdgePoint.add(vertexHolder);
    currentEdge.newEdgePoint = newEdgeVertices.length;
    newEdgeVertices.push(newEdgePoint);
  }

  let connectingEdge, connectingPoint, connectingEdges;
  let oldVertex, newSourceVertex;
  const newSourceVertices = [];
  let beta, sourceVertexWeight, connectingVertexWeight;

  for (let i = 0; i < sourceVertices.length; i++) {
    oldVertex = sourceVertices[i];
    connectingEdges = sourceVerticesRelationships[i].edges;
    const numberOfConnectingEdges = this.connecting_edges_weight;
    beta = 3 / (8 * numberOfConnectingEdges);
    connectingVertexWeight = beta;
    sourceVertexWeight = 1 - numberOfConnectingEdges * beta;
    newSourceVertex = oldVertex.clone().multiplyScalar(sourceVertexWeight);
    vertexHolder.set(0, 0, 0);
    for (let j = 0; j < numberOfConnectingEdges; j++) {
      connectingEdge = connectingEdges[j];
      connectingPoint = connectingEdge.a !== oldVertex ? connectingEdge.a : connectingEdge.b;
      vertexHolder.add(connectingPoint);
    }
    vertexHolder.multiplyScalar(connectingVertexWeight);
    newSourceVertex.add(vertexHolder);
    newSourceVertices.push(newSourceVertex);
  } // End for loop.

  newVertices = newSourceVertices.concat(newEdgeVertices);
  const sl = newSourceVertices.length;
  let edge1, edge2, edge3;
  newFaces = [];
  let uv, x0, x1, x2;
	let x3 = new THREE.Vector2();
	let x4 = new THREE.Vector2();
	let x5 = new THREE.Vector2();
  
  for (let i = 0; i < sourceFaces.length; i++) {
    face = sourceFaces[i];
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
  geometry.vertices = newVertices;
  geometry.faces = newFaces;
  if (hasUvs) geometry.faceVertexUvs[0] = newUvs;
}

export default SubdivisionModifier;