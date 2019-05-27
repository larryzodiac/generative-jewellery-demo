// ------------------------------------------------- //
// Evan MacHale - N00150552
// 26.01.19
// Three.js
// Functions used to setup an object to query our geometry.
// Taken from Threejs.org + rewritten.
// I don't have time as of the above date to merge functions
// Each algorithm has a slightly differnt JS object data structure
// ------------------------------------------------- //

import * as THREE from 'three';

// ------------------------------------------------- //

/*
  Catmull-Clark
*/
export const generateLookupsCat = (sourceVertices, sourceFaces, oldVerticesRelationships, sourceEdges) => {
  // for every vertex, add a new object w/ array of objects.
  for (let i = 0; i < sourceVertices.length; i++) {
    oldVerticesRelationships[i] = {vertex:sourceVertices[i], edges:[]};
  }
  for (let i = 0; i < sourceFaces.length; i++) {
    // Three edges of traingle.
    processEdgeCat(sourceFaces[i].a, sourceFaces[i].b, sourceVertices, sourceEdges, sourceFaces[i], oldVerticesRelationships);
    processEdgeCat(sourceFaces[i].b, sourceFaces[i].c, sourceVertices, sourceEdges, sourceFaces[i], oldVerticesRelationships);
    processEdgeCat(sourceFaces[i].c, sourceFaces[i].a, sourceVertices, sourceEdges, sourceFaces[i], oldVerticesRelationships);
  }
}

// processEdge puts all edge objects into metaVertices
// Each edge object holds vertices of the edge and the two faces.
export const processEdgeCat = (v1, v2, sourceVertices, sourceEdges, currentFace, metaVertices) => {
  const vertexIndexA = Math.min(v1, v2);
  const vertexIndexB = Math.max(v1, v2);
  const key = vertexIndexA + "_" + vertexIndexB;
  let edge;
  // If edge already exists... our edge var equals that edge.
  // Remember, each edge has two faces...
  // We cross-reference sourceEges with our current vertices.
  if (key in sourceEdges) { // key:value
    edge = sourceEdges[key];
  } else {
    const vertexA = sourceVertices[vertexIndexA];
    const vertexB = sourceVertices[vertexIndexB];
    edge = {
      a: vertexA, // pointer reference
      b: vertexB,
      edgePoint: null,
      midPoint: null,
      // aIndex: a, // numbered reference
      // bIndex: b,
      faces: [] // pointers to faces
    };
    // Give the edge the info
    sourceEdges[key] = edge;
  }
  // Setup facePoint
  const triangle = new THREE.Triangle(sourceVertices[currentFace.a], sourceVertices[currentFace.b], sourceVertices[currentFace.c]);
  let facePoint = new THREE.Vector3();
  triangle.getMidpoint(facePoint); // Result copied into facePoint.
  edge.faces.push({currentFace, facePoint});
  // edge.faces.push(currentFace);
  // For both points on the edge, give them the edge info.
  metaVertices[v1].edges.push(edge);
  // Below ends up with duplicates in metaVertices.edges
  // metaVertices[v2].edges.push(edge);
}

// Find an edge on the face using half edge lookup
// Then check faces points for a match on that edge
export const getFacePoint = (a,b,c,sourceEdges,facePoints) => {
  const vertexIndexA = Math.min(a, b);
  const vertexIndexB = Math.max(a, b);
  const key = vertexIndexA + "_" + vertexIndexB;
  const currentEdge = sourceEdges[key];
  for (let i = 0; i < currentEdge.faces.length; i++) {
    const currentFace = currentEdge.faces[i].currentFace;
    // if (currentFace.a === a && currentFace.b === b && currentFace.c === c) {
    //   return currentEdge.faces[i].facePoint;
    // }
    if (currentFace.a === a && currentFace.b === b && currentFace.c === c) {
      const matchedFacePoint = currentEdge.faces[i].facePoint
      // console.log(facePoints);
      // console.log(currentEdge.faces[i].facePoint);
      // console.log(facePoints.indexOf(currentEdge.faces[i].facePoint));
      // return facePoints.indexOf(currentEdge.faces[i].facePoint);
      for (let i = 0; i < facePoints.length; i++) {
        if (matchedFacePoint.equals(facePoints[i])) {
          // console.log(i);
          return i;
        }
      }
    }
  }
}

// Find an edge on the face
// Return it's edgePoint
export const getEdgePoint = (a, b, sourceEdges, edgePoints) => {
  const vertexIndexA = Math.min(a, b);
  const vertexIndexB = Math.max(a, b);
  const key = vertexIndexA + "_" + vertexIndexB;
  const matchedEdgePoint = sourceEdges[key].edgePoint;
  for (let i = 0; i < edgePoints.length; i++) {
    if (matchedEdgePoint.equals(edgePoints[i])) {
      // console.log(i);
      return i;
    }
  }
}

// THREE.Face4 depreciated
// Need to draw two triangles to emulate quad
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
  // for every vertex, add a new object w/ array of objects.
  for (let i = 0; i < oldVertices.length; i++) {
    metaVertices[i] = {edges:[]};
  }
  for (let i = 0; i < oldFaces.length; i++) {
    // Three edges of traingle.
    // ------------------------------------------------- //
    //    .a _ _ _ 1 _ _ _ .b
    //       \           /
    //       3 \       / 2          // Processing
    //           \   /
    //            .c
    // ------------------------------------------------- //
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
  // If edge already exists... our edge var equals that edge.
  // Remember, each edge has two faces...
  // We cross-reference sourceEges with our current vertices.
  if (key in sourceEdges) { // key:value
    edge = sourceEdges[key];
  } else {
    const vertexA = oldVertices[vertexIndexA];
    const vertexB = oldVertices[vertexIndexB];
    edge = {
      a: vertexA, // pointer reference
      b: vertexB,
      newEdgePoint: null,
      // aIndex: a, // numbered reference
      // bIndex: b,
      faces: [] // pointers to faces
    };
    // Give the edge the info
    sourceEdges[key] = edge;
  }
  // Then give the edge the current face
  // ------------------------------------------------- //
  //         /\
  //       /    \
  //     /   F1   \       // create edge object if not existing.
  //   .a - - - - .b      // push the faces to edge.
  //     \   F2   /       // Add edge to metaVertices for both points.
  //       \    /
  //         \/
  // ------------------------------------------------- //
  edge.faces.push(currentFace);
  // For both points on the edge, give them the edge info.
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
  // console.log(a);
  // console.log(b);
  // console.log(c);
  newUvs.push( [ a.clone(), b.clone(), c.clone() ] );
}

export const midpoint = (a, b) => (Math.abs(b - a) / 2) + Math.min(a, b);
