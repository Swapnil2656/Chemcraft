'use client';

import { useEffect, useRef, useState } from 'react';

interface Molecule {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  element: string;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const ChemicalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const moleculesRef = useRef<Molecule[]>([]);
  const [mounted, setMounted] = useState(false);

  // Chemistry-themed elements with their colors
  const elements = [
    { symbol: 'H', color: '#FF6B6B', size: 8 },   // Hydrogen - Red
    { symbol: 'He', color: '#4ECDC4', size: 12 }, // Helium - Teal
    { symbol: 'C', color: '#45B7D1', size: 16 },  // Carbon - Blue
    { symbol: 'N', color: '#96CEB4', size: 14 },  // Nitrogen - Green
    { symbol: 'O', color: '#FFEAA7', size: 14 },  // Oxygen - Yellow
    { symbol: 'F', color: '#DDA0DD', size: 12 },  // Fluorine - Purple
    { symbol: 'Ne', color: '#FFB6C1', size: 16 }, // Neon - Pink
    { symbol: 'Na', color: '#FFA07A', size: 20 }, // Sodium - Orange
    { symbol: 'Mg', color: '#98FB98', size: 18 }, // Magnesium - Light Green
    { symbol: 'Al', color: '#F0E68C', size: 18 }, // Aluminum - Khaki
    { symbol: 'Si', color: '#DEB887', size: 16 }, // Silicon - Tan
    { symbol: 'P', color: '#F4A460', size: 15 },  // Phosphorus - Sandy Brown
    { symbol: 'S', color: '#FFFF00', size: 16 },  // Sulfur - Yellow
    { symbol: 'Cl', color: '#00FF7F', size: 14 }, // Chlorine - Spring Green
    { symbol: 'Ar', color: '#E6E6FA', size: 18 }, // Argon - Lavender
  ];

  // Initialize molecules
  const initializeMolecules = (width: number, height: number): Molecule[] => {
    const molecules: Molecule[] = [];
    const numMolecules = Math.min(25, Math.floor((width * height) / 15000)); // Adaptive count based on screen size
    
    for (let i = 0; i < numMolecules; i++) {
      const element = elements[Math.floor(Math.random() * elements.length)];
      molecules.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, // Slower movement
        vy: (Math.random() - 0.5) * 0.5,
        element: element.symbol,
        color: element.color,
        size: element.size,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
    return molecules;
  };

  // Draw a molecule with element symbol
  const drawMolecule = (ctx: CanvasRenderingContext2D, molecule: Molecule) => {
    ctx.save();
    ctx.translate(molecule.x, molecule.y);
    ctx.rotate(molecule.rotation);
    
    // Outer glow effect
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, molecule.size * 2);
    gradient.addColorStop(0, molecule.color + '40'); // 25% opacity
    gradient.addColorStop(0.5, molecule.color + '20'); // 12% opacity
    gradient.addColorStop(1, molecule.color + '00'); // 0% opacity
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, molecule.size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Main molecule circle
    ctx.fillStyle = molecule.color + '80'; // 50% opacity
    ctx.beginPath();
    ctx.arc(0, 0, molecule.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Element symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${molecule.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(molecule.element, 0, 0);
    
    // Inner highlight
    ctx.fillStyle = molecule.color + 'FF'; // Full opacity
    ctx.beginPath();
    ctx.arc(-molecule.size * 0.3, -molecule.size * 0.3, molecule.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  // Draw bonds between nearby molecules
  const drawBonds = (ctx: CanvasRenderingContext2D, molecules: Molecule[]) => {
    molecules.forEach((mol1, i) => {
      molecules.slice(i + 1).forEach((mol2) => {
        const dx = mol2.x - mol1.x;
        const dy = mol2.y - mol1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) { // Bond distance threshold
          const opacity = Math.max(0, (120 - distance) / 120);
          ctx.strokeStyle = `rgba(99, 179, 237, ${opacity * 0.3})`; // Soft blue bonds
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(mol1.x, mol1.y);
          ctx.lineTo(mol2.x, mol2.y);
          ctx.stroke();
        }
      });
    });
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas;
    
    // Clear canvas with gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0f172a'); // Dark slate
    bgGradient.addColorStop(0.5, '#1e293b'); // Slate
    bgGradient.addColorStop(1, '#334155'); // Light slate
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Update and draw molecules
    moleculesRef.current.forEach((molecule) => {
      // Update position
      molecule.x += molecule.vx;
      molecule.y += molecule.vy;
      molecule.rotation += molecule.rotationSpeed;
      
      // Bounce off edges
      if (molecule.x < 0 || molecule.x > width) molecule.vx *= -1;
      if (molecule.y < 0 || molecule.y > height) molecule.vy *= -1;
      
      // Keep within bounds
      molecule.x = Math.max(0, Math.min(width, molecule.x));
      molecule.y = Math.max(0, Math.min(height, molecule.y));
    });
    
    // Draw bonds first (behind molecules)
    drawBonds(ctx, moleculesRef.current);
    
    // Draw molecules
    moleculesRef.current.forEach(drawMolecule.bind(null, ctx));
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize molecules with new dimensions
      moleculesRef.current = initializeMolecules(canvas.width, canvas.height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Start animation
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 w-full h-full bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800"
    />
  );
};

export default ChemicalBackground;