/*
  Evan MacHale - N00150552
  18.04.19
  Three.js
*/

import * as THREE from 'three';

/*
  Catmull-Clark
*/
export const generateLookupsCat = (sourceVertices, sourceFaces, oldVerticesRelationships, sourceEdges) => {
  for (let i = 0; i < sourceVertices.length; i++) {
    oldVerticesRelationships[i] = {vertex:sourceVertices[i], edges:[]};
  }
  for (let i = 0; i < sourceFaces.length; i++) {
    processEdgeCat(sourceFaces[i].a, sourceFaces[i].b, sourceVertices, sourceEdges, sourceFaces[i], oldVerticesRelationships);
    processEdgeCat(sourceFaces[i].b, sourceFaces[i].c, sourceVertices, sourceEdges, sourceFaces[i], oldVerticesRelationships);
    processEdgeCat(sourceFaces[i].c, sourceFaces[i].a, sourceVertices, sourceEdges, sourceFaces[i], oldVerticesRelationships);
  }
}

export const processEdgeCat = (v1, v2, sourceVertices, sourceEdges, currentFace, metaVertices) => {
  const vertexIndexA = Math.min(v1, v2);
  const vertexIndexB = Math.max(v1, v2);
  const key = vertexIndexA + "_" + vertexIndexB;
  let edge;
  if (key in sourceEdges) {
    edge = sourceEdges[key];
  } else {
    const vertexA = sourceVertices[vertexIndexA];
    const vertexB = sourceVertices[vertexIndexB];
    edge = {
      a: vertexA,
      b: vertexB,
      edgePoint: null,
      midPoint: null,
      faces: []
    };
    sourceEdges[key] = edge;
  }
  const triangle = new THREE.Triangle(sourceVertices[currentFace.a], sourceVertices[currentFace.b], sourceVertices[currentFace.c]);
  let facePoint = new THREE.Vector3();
  triangle.getMidpoint(facePoint);
  edge.faces.push({currentFace, facePoint});
  metaVertices[v1].edges.push(edge);
}

export const getFacePoint = (a,b,c,sourceEdges,facePoints) => {
  const vertexIndexA = Math.min(a, b);
  const vertexIndexB = Math.max(a, b);
  const key = vertexIndexA + "_" + vertexIndexB;
  const currentEdge = sourceEdges[key];
  for (let i = 0; i < currentEdge.faces.length; i++) {
    const currentFace = currentEdge.faces[i].currentFace;
    if (currentFace.a === a && currentFace.b === b && currentFace.c === c) {
      const matchedFacePoint = currentEdge.faces[i].facePoint
      for (let i = 0; i < facePoints.length; i++) {
        if (matchedFacePoint.equals(facePoints[i])) {
          return i;
        }
      }
    }
  }
}

export const getEdgePoint = (a, b, sourceEdges, edgePoints) => {
  const vertexIndexA = Math.min(a, b);
  const vertexIndexB = Math.max(a, b);
  const key = vertexIndexA + "_" + vertexIndexB;
  const matchedEdgePoint = sourceEdges[key].edgePoint;
  for (let i = 0; i < edgePoints.length; i++) {
    if (matchedEdgePoint.equals(edgePoints[i])) {
      return i;
    }
  }
}

export const createNewFace = (newFaces, a, b, c, d, materialIndex) => {
  newFaces.push(new THREE.Face3(
    a, b, d, undefined, undefined, materialIndex
  ));
  newFaces.push(new THREE.Face3(
    a, c, d, undefined, undefined, materialIndex
  ));
}

/*
  loop
*/
export const generateLookupsLoop = (oldVertices, oldFaces, metaVertices, sourceEges) => {
  for (let i = 0; i < oldVertices.length; i++) {
    metaVertices[i] = {edges:[]};
  }
  for (let i = 0; i < oldFaces.length; i++) {
    processEdgeLoop(oldFaces[i].a, oldFaces[i].b, oldVertices, sourceEges, oldFaces[i], metaVertices);
    processEdgeLoop(oldFaces[i].b, oldFaces[i].c, oldVertices, sourceEges, oldFaces[i], metaVertices);
    processEdgeLoop(oldFaces[i].c, oldFaces[i].a, oldVertices, sourceEges, oldFaces[i], metaVertices);
  }
}

export const processEdgeLoop = (v1, v2, oldVertices, sourceEdges, currentFace, metaVertices) => {
  const vertexIndexA = Math.min(v1, v2);
  const vertexIndexB = Math.max(v1, v2);
  const key = vertexIndexA + "_" + vertexIndexB;
  let edge;
  if (key in sourceEdges) {
    edge = sourceEdges[key];
  } else {
    const vertexA = oldVertices[vertexIndexA];
    const vertexB = oldVertices[vertexIndexB];
    edge = {
      a: vertexA,
      b: vertexB,
      newEdgePoint: null,
      faces: []
    };
    sourceEdges[key] = edge;
  }
  edge.faces.push(currentFace);
  metaVertices[v1].edges.push(edge);
  metaVertices[v2].edges.push(edge);
}

export const newFace = (newFaces, a, b, c, materialIndex) => newFaces.push(new THREE.Face3(a, b, c, undefined, undefined, materialIndex));

export const getEdge = (a, b, sourceEdges) => {
  const vertexIndexA = Math.min(a, b);
  const vertexIndexB = Math.max(a, b);
  const key = vertexIndexA + "_" + vertexIndexB;
  return sourceEdges[key];
}

/*
  UVs
*/
export const createNewUv = (newUvs, a, b, c) => {
  newUvs.push( [ a.clone(), b.clone(), c.clone() ] );
}

export const midpoint = (a, b) => (Math.abs(b - a) / 2) + Math.min(a, b);
