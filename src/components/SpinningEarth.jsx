import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpinningEarth() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Set up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('blanchedalmond');
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(500, 500);
    renderer.setClearColor(0xf5e7cc); // blanchedalmond in hex
    
    // Create Earth sphere
    const earthGeometry = new THREE.SphereGeometry(1, 64, 32);
    
    // Create earth material with texture
    const textureLoader = new THREE.TextureLoader();
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('/textures/earth_daymap.jpg'),
      shininess: 15,
      specular: new THREE.Color(0x333333)
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // Add ambient light (increase intensity)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    // Add main directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add secondary light from opposite direction to illuminate dark side
    const secondaryLight = new THREE.DirectionalLight(0x6666ff, 0.5);
    secondaryLight.position.set(-5, -2, -5);
    scene.add(secondaryLight);
    
    // Add a point light to create highlights
    const highlightLight = new THREE.PointLight(0xffffcc, 0.6);
    highlightLight.position.set(3, 2, 3);
    scene.add(highlightLight);
    
    // Position camera
    camera.position.z = 2;
    
    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      
      // Rotate the Earth
      earth.rotation.y += 0.005;
      
      renderer.render(scene, camera);
    }
    
    // Start animation
    animate();
    
    // Clean up on unmount
    return () => {
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      earthMaterial.map.dispose();
    };
  }, []);
  
  return (
    <div className="cube-container">
      <canvas ref={canvasRef} />
    </div>
  );
} 