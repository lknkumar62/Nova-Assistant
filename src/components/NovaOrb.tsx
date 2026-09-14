import React, { useEffect, useRef } from 'react';

type NovaOrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface NovaOrbProps {
  state?: NovaOrbState;
  size?: number;
  className?: string;
}

/**
 * NOVA home orb: a lightweight canvas animation inspired by the supplied
 * quantum-orb artwork. It is intentionally original and does not embed
 * copyrighted/reference artwork.
 */
export const NovaOrb: React.FC<NovaOrbProps> = ({
  state = 'idle',
  size = 320,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      const pxW = Math.round(w * dpr);
      const pxH = Math.round(h * dpr);
      if (canvas.width !== pxW || canvas.height !== pxH) {
        canvas.width = pxW;
        canvas.height = pxH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.31;
      const active = stateRef.current !== 'idle';
      const speed = stateRef.current === 'thinking' ? 0.018 : active ? 0.011 : 0.005;
      t += speed;

      const glow = ctx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r * 2.05);
      glow.addColorStop(0, 'rgba(110,220,255,.30)');
      glow.addColorStop(.28, 'rgba(30,150,255,.14)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.05, 0, Math.PI * 2);
      ctx.fill();

      for (let ring = 0; ring < 7; ring++) {
        const rr = r * (0.72 + ring * 0.16);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * (ring % 2 ? -1 : 1) + ring * .7);
        ctx.scale(1, .30 + (ring % 3) * .045);
        ctx.strokeStyle = `rgba(90,205,255,${0.16 - ring * .014})`;
        ctx.lineWidth = ring === 0 ? 1.8 : 1;
        ctx.beginPath();
        ctx.arc(0, 0, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const particles = stateRef.current === 'thinking' ? 170 : 125;
      for (let i = 0; i < particles; i++) {
        const a = (i / particles) * Math.PI * 2 + t * (i % 2 ? 1 : -1);
        const wobble = Math.sin(t * 3 + i * 1.7) * r * .10;
        const rr = r * (0.74 + ((i * 37) % 100) / 100 * .72) + wobble;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr * .38;
        const s = i % 17 === 0 ? 2.0 : 0.8 + (i % 3) * .35;
        ctx.fillStyle = `rgba(150,225,255,${0.28 + (i % 5) * .10})`;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
      }

      const core = ctx.createRadialGradient(cx - r * .15, cy - r * .18, 2, cx, cy, r * .78);
      core.addColorStop(0, 'rgba(235,255,255,.98)');
      core.addColorStop(.10, 'rgba(105,230,255,.96)');
      core.addColorStop(.35, 'rgba(20,125,255,.80)');
      core.addColorStop(.72, 'rgba(4,25,80,.68)');
      core.addColorStop(1, 'rgba(0,5,20,.08)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, r * .70, 0, Math.PI * 2);
      ctx.fill();

      const point = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * .22);
      point.addColorStop(0, 'rgba(255,255,255,1)');
      point.addColorStop(.2, 'rgba(155,245,255,.95)');
      point.addColorStop(1, 'rgba(40,180,255,0)');
      ctx.fillStyle = point;
      ctx.beginPath();
      ctx.arc(cx, cy, r * .22, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size, maxWidth: '90vw', maxHeight: '90vw' }}
      aria-label="NOVA assistant orb"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default NovaOrb;
