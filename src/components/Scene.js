/*
  Evan MacHale - N00150552
  18.04.19
  Three.js React Environment
*/

import React, { Component } from 'react';
import * as THREE from 'three';
import SubdivisionModifier from './algorithm/loop';
import { saveAs } from 'file-saver';
const exportSTL = require('threejs-export-stl');
const OrbitControls = require('three-orbit-controls')(THREE);

let scene, camera, renderer, controls;
let shape, smooth, geometry;

class Scene extends Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.getGeometry = this.getGeometry.bind(this);
    this.generateSubdivision = this.generateSubdivision.bind(this);
  }
  
  componentDidMount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffde03);
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
    camera.position.z = 3;
    camera.position.y = 1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    // Lights
  	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  	hemisphereLight.position.set(0, 100, 0);
  	scene.add(hemisphereLight);
    const hemiLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 10);
		scene.add(hemiLightHelper);
    // Create a DirectionalLight and turn on shadows for the light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(-0.5, 1.75, 0.5);
    directionalLight.position.multiplyScalar(50);
    directionalLight.castShadow = true; // default false
    scene.add(directionalLight);
    // Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    const dirLightHeper = new THREE.DirectionalLightHelper(directionalLight, 10);
		scene.add(dirLightHeper);
    /*
      Create Geometry here
    */
    const plane = this.getPlane(1000,1000);
    scene.add(plane);
    geometry = this.getGeometry(1);
    shape = this.generateSubdivision(geometry); // This will be our subdivide geometry call
    scene.add(shape);
    // Magic - Create our WebGL render instance.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableKeys = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.1;
    controls.maxDistance = 5;
    controls.minDistance = 2;
    controls.maxPolarAngle = 1.8; // 103.132°
    // Scalable canvas.
    window.addEventListener('resize', this.handleResize);
    //
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.shape = shape;
    this.mount.appendChild(this.renderer.domElement);
    this.start();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props !== prevProps) {
      // When radio shape changes -> remove + replace
      scene.remove(shape);
      shape.geometry.dispose();
      shape.material.dispose();
      //
      geometry = this.getGeometry(1);
      shape = this.generateSubdivision(geometry);
      shape.material.wireframe = this.props.wireframe
      scene.add(shape);
    }
    if (this.props.exportClicked !== prevProps.exportClicked) {
      this.export(shape.geometry);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize');
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.update);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  // Animation loop.
  update() {
    this.renderer.render(
      this.scene,
      this.camera
    )
    this.controls.update();
    this.frameId = window.requestAnimationFrame(this.update);
  }

  // Resize canvas
  handleResize () {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // Create a geometry for use in creating a mesh
  getGeometry(w,h) {
    let geometry;
    switch (this.props.geometry) {
      case 'Cone':
        geometry = new THREE.ConeGeometry(w, h);
        break;
      case 'Cube':
        geometry = new THREE.BoxGeometry(w, h);
        break;
      case 'Cylinder':
        geometry = new THREE.CylinderGeometry(w, h);
        break;
      case 'Dodecahedron':
        geometry = new THREE.DodecahedronGeometry(w, h);
        break;
      case 'Icosahedron':
        geometry = new THREE.IcosahedronGeometry(w, h);
        break;
      case 'Octahedron':
        geometry = new THREE.OctahedronGeometry(w, h);
        break;
      case 'Tetrahedron':
        geometry = new THREE.TetrahedronGeometry(w, h);
        break;
      case 'Torus':
        geometry = new THREE.TorusGeometry(w, h);
        break;
      default:
        geometry = new THREE.BoxGeometry(w, h);
    }
    return geometry;
  }

  // Create a plane that receives shadows (but does not cast them)
  getPlane(w,h) {
    const geometry = new THREE.PlaneBufferGeometry(w,h);
  	const material = new THREE.MeshPhongMaterial({side:THREE.DoubleSide});
    material.color.setHex(0xffde03);
  	const mesh = new THREE.Mesh(geometry,material);
    mesh.rotation.x = -1.5708;
    mesh.position.y = -2;
    mesh.receiveShadow = true;
  	return mesh;
  }

  // Pass geometry to be modified then return mesh to be added to the scene
  generateSubdivision(geometry) {
    // Invoke modifier
    const modifier = new SubdivisionModifier(
      this.props.subdivisions,
      this.props.adjacent_weight,
      this.props.edge_point_weight,
      this.props.connecting_edges_weight
    );
    // Create material
    const material = new THREE.MeshPhongMaterial({wireframe: this.props.wireframe});
    material.color.setHex(0xff0266);
    // Scaling
    const params = geometry.parameters;
    if ( params.scale ) {
      geometry.scale( params.scale, params.scale, params.scale );
    }
    // Smoothing
    smooth = modifier.modify(geometry);
    const mesh = new THREE.Mesh(smooth, material);
    mesh.scale.setScalar(params.meshScale ? params.meshScale : 1);
    mesh.name = `${this.props.geometry}`
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    return mesh;
  }

  export(geometry) {
    const buffer = exportSTL.fromGeometry(geometry);
    const blob = new Blob([buffer], { type: exportSTL.mimeType });
    saveAs(blob, 'shape.stl');
  }

  render() {
    return (
      <main
        className="canvas"
        ref={mount => {
          this.mount = mount
        }}
      />
    )
  }
}

export default Scene;