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
    
    // Create earth material with default colors
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233aa, // blue base color
      shininess: 5,
      specular: new THREE.Color(0x111111)
    });
    
    // Create a procedural texture with continents
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Fill with blue for oceans
    context.fillStyle = '#1a66aa';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a gradient for water depth
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#134b7c');  // darker blue at poles
    gradient.addColorStop(0.5, '#1a66aa'); // mid blue at equator
    gradient.addColorStop(1, '#134b7c');  // darker blue at poles
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add continents
    context.fillStyle = '#3d8e33';  // green for land
    
    // North America
    context.beginPath();
    context.moveTo(250, 160);
    context.lineTo(300, 120);
    context.lineTo(350, 150);
    context.lineTo(320, 220);
    context.lineTo(250, 260);
    context.fill();
    
    // South America
    context.beginPath();
    context.moveTo(300, 280);
    context.lineTo(350, 300);
    context.lineTo(330, 400);
    context.lineTo(270, 350);
    context.fill();
    
    // Europe and Africa
    context.beginPath();
    context.moveTo(500, 150);
    context.lineTo(550, 130);
    context.lineTo(580, 170);
    context.lineTo(570, 300);
    context.lineTo(520, 330);
    context.lineTo(480, 280);
    context.lineTo(480, 200);
    context.fill();
    
    // Asia and Australia
    context.beginPath();
    context.moveTo(600, 170);
    context.lineTo(700, 150);
    context.lineTo(750, 200);
    context.lineTo(720, 250);
    context.lineTo(650, 280);
    context.lineTo(600, 240);
    context.fill();
    
    context.beginPath();
    context.moveTo(750, 320);
    context.lineTo(800, 330);
    context.lineTo(780, 370);
    context.lineTo(740, 360);
    context.fill();
    
    // Add polar ice caps
    context.fillStyle = '#ffffff';
    context.beginPath();
    context.arc(canvas.width / 2, 30, 120, 0, Math.PI * 2);
    context.fill();
    
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height - 30, 120, 0, Math.PI * 2);
    context.fill();
    
    // Add some texture/noise to continents
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      // Sample the pixel to see if it's land
      const pixel = context.getImageData(x, y, 1, 1).data;
      
      // If it's green (land), add some variation
      if (pixel[0] < 100 && pixel[1] > 120 && pixel[2] < 100) {
        context.fillStyle = Math.random() > 0.5 ? '#2e7d32' : '#4caf50'; // different greens
        context.beginPath();
        context.arc(x, y, Math.random() * 5 + 1, 0, Math.PI * 2);
        context.fill();
      }
    }
    
    const canvasTexture = new THREE.CanvasTexture(canvas);
    earthMaterial.map = canvasTexture;
    earthMaterial.needsUpdate = true;
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    // Add directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
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
      canvasTexture.dispose();
    };
  }, []);
  
  return (
    <div className="cube-container">
      <canvas ref={canvasRef} />
    </div>
  );
} 