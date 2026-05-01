import { useEffect, useRef } from 'react';

const MatrixBackground = ({ active = true }: { active?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 20);
    const drops = new Array(columns).fill(1);

    const charSet = "0123456789ABCDEFHIJKLMNOPQRSTUVWXYZあいうえおカキクケコサシスセソ";
    const chars = charSet.split("");

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#0a5ad1"; // Darker blue theme
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    if (!active) {
       ctx.clearRect(0, 0, width, height);
       return;
    }

    window.addEventListener('resize', handleResize);
    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-[0.08] z-[-1]"
    />
  );
};

export default MatrixBackground;
