import React, { useEffect, useRef } from "react";

const CrazyBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId;
    let time = 0;

    // Create gradient background
    const createGradient = () => {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#0a0e27");
      gradient.addColorStop(0.5, "#1a0933");
      gradient.addColorStop(1, "#0a1428");
      return gradient;
    };

    // Draw moving lines
    const drawLines = () => {
      ctx.strokeStyle = "rgba(0, 255, 136, 0.1)";
      ctx.lineWidth = 1;

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (canvas.height / 5) * i + Math.sin(time * 0.002 + i) * 20);
        ctx.lineTo(
          canvas.width,
          (canvas.height / 5) * i + Math.sin(time * 0.002 + i + 1) * 20
        );
        ctx.stroke();
      }

      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(
          (canvas.width / 8) * i + Math.cos(time * 0.002 + i) * 20,
          0
        );
        ctx.lineTo(
          (canvas.width / 8) * i + Math.cos(time * 0.002 + i) * 20,
          canvas.height
        );
        ctx.stroke();
      }
    };

    // Draw orbiting dots
    const drawOrbits = () => {
      const orbitCount = 3;
      for (let orbit = 0; orbit < orbitCount; orbit++) {
        const radius = 100 + orbit * 80;
        const speed = 0.0005 - orbit * 0.0001;

        ctx.strokeStyle = `rgba(0, 255, ${136 + orbit * 30}, 0.2)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();

        const dotCount = 3 + orbit;
        for (let dot = 0; dot < dotCount; dot++) {
          const angle = (time * speed) + (Math.PI * 2 * dot) / dotCount;
          const x = canvas.width / 2 + Math.cos(angle) * radius;
          const y = canvas.height / 2 + Math.sin(angle) * radius;

          ctx.fillStyle = `rgba(0, 255, ${136 + orbit * 30}, 0.8)`;
          ctx.beginPath();
          ctx.arc(x, y, 3 + orbit, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = `rgba(0, 255, ${136 + orbit * 30}, 0.5)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, 6 + orbit * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    // Draw central rotating shape
    const drawCentralShape = () => {
      const size = 80;
      const rotation = time * 0.0008;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation);

      ctx.strokeStyle = "rgba(0, 255, 136, 0.6)";
      ctx.lineWidth = 2;

      // Draw rotating hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    };

    // Draw pulsing core
    const drawCore = () => {
      const pulse = Math.sin(time * 0.004) * 20 + 30;
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        pulse
      );
      gradient.addColorStop(0, "rgba(0, 255, 136, 0.6)");
      gradient.addColorStop(1, "rgba(0, 255, 136, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, pulse, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      // Clear with gradient
      ctx.fillStyle = createGradient();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw all effects
      drawLines();
      drawOrbits();
      drawCentralShape();
      drawCore();

      time++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    />
  );
};

export default CrazyBackground;
