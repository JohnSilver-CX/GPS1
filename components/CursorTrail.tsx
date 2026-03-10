import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'star' | 'circle';
  rotation: number;
  rotationSpeed: number;
}

const COLORS = ['#2563EB', '#FBBF24', '#16A34A', '#F43F5E', '#7C3AED', '#FFD700'];

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const lastEmitTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      mouse.current.active = true;
      
      const now = Date.now();
      // Throttle: Only create particles every 20ms to save CPU
      if (now - lastEmitTime.current > 20) {
        for (let i = 0; i < 2; i++) {
          createParticle();
        }
        lastEmitTime.current = now;
      }
    };

    const createParticle = () => {
      const size = Math.random() * 8 + 4;
      const type = Math.random() > 0.7 ? 'star' : 'circle';
      particles.current.push({
        x: mouse.current.x,
        y: mouse.current.y,
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedX: (Math.random() - 0.5) * 2.5,
        speedY: (Math.random() - 0.5) * 2.5 - 0.5,
        opacity: 1,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
      });
    };

    const drawStar = (context: CanvasRenderingContext2D, x: number, y: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = Math.PI / 2 * 3;
      let x_pos = x;
      let y_pos = y;
      let step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x_pos = x + Math.cos(rot) * outerRadius;
        y_pos = y + Math.sin(rot) * outerRadius;
        context.lineTo(x_pos, y_pos);
        rot += step;

        x_pos = x + Math.cos(rot) * innerRadius;
        y_pos = y + Math.sin(rot) * innerRadius;
        context.lineTo(x_pos, y_pos);
        rot += step;
      }
      context.lineTo(x, y - outerRadius);
      context.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 0.02;
        p.size *= 0.98;
        p.rotation += p.rotationSpeed;

        if (p.opacity <= 0 || p.size < 1) {
          particles.current.splice(i, 1);
          i--;
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        
        if (p.type === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        }
        
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

export default CursorTrail;