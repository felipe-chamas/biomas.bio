'use client';

import { useEffect, useRef, useState } from 'react';

interface Hub {
  id: number;
  label: string;
  chunk_count: number;
  coherence: number;
}

interface HubVisualizerProps {
  activePath?: number[];
  className?: string;
}

export default function HubVisualizer({ activePath = [], className = '' }: HubVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [bridges, setBridges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hub data from API
  useEffect(() => {
    const fetchHubData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_TALOS_API_URL || 'http://localhost:8000/api';
        
        const [hubsRes, bridgesRes] = await Promise.all([
          fetch(`${apiUrl}/hubs`),
          fetch(`${apiUrl}/bridges`),
        ]);

        if (hubsRes.ok && bridgesRes.ok) {
          const hubsData = await hubsRes.json();
          const bridgesData = await bridgesRes.json();
          setHubs(hubsData);
          setBridges(bridgesData);
        }
      } catch (error) {
        console.error('Failed to load hub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHubData();
  }, []);

  // Draw visualization
  useEffect(() => {
    if (!canvasRef.current || hubs.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Position hubs in a circle
    const hubPositions: { [key: number]: { x: number; y: number } } = {};
    hubs.forEach((hub, index) => {
      const angle = (index / hubs.length) * 2 * Math.PI - Math.PI / 2;
      hubPositions[hub.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });

    // Draw bridges (connections)
    ctx.strokeStyle = '#1a472a';
    ctx.lineWidth = 1;
    bridges.forEach((bridge) => {
      const pos1 = hubPositions[bridge.hub1];
      const pos2 = hubPositions[bridge.hub2];
      if (pos1 && pos2) {
        ctx.beginPath();
        ctx.moveTo(pos1.x, pos1.y);
        ctx.lineTo(pos2.x, pos2.y);
        ctx.stroke();
      }
    });

    // Highlight active path
    if (activePath.length > 1) {
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3;
      for (let i = 0; i < activePath.length - 1; i++) {
        const pos1 = hubPositions[activePath[i]];
        const pos2 = hubPositions[activePath[i + 1]];
        if (pos1 && pos2) {
          ctx.beginPath();
          ctx.moveTo(pos1.x, pos1.y);
          ctx.lineTo(pos2.x, pos2.y);
          ctx.stroke();
        }
      }
    }

    // Draw hubs
    hubs.forEach((hub) => {
      const pos = hubPositions[hub.id];
      if (!pos) return;

      const isActive = activePath.includes(hub.id);
      const nodeRadius = isActive ? 8 : 5;

      // Hub circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = isActive ? '#f97316' : '#22c55e';
      ctx.fill();

      // Hub label (only for active path)
      if (isActive) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(hub.label.substring(0, 20), pos.x, pos.y - 12);
      }
    });

  }, [hubs, bridges, activePath]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 rounded ${className}`}>
        <p className="text-gray-500">Loading hub network...</p>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      
      {activePath.length > 0 && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-80 px-3 py-2 rounded text-xs">
          <span className="text-purple-400">Active Path: </span>
          <span className="text-orange-400">{activePath.length} hubs</span>
        </div>
      )}
      
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-3 py-2 rounded text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-gray-400">{hubs.length} hubs</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-0.5 bg-green-900"></div>
          <span className="text-gray-400">{bridges.length} bridges</span>
        </div>
      </div>
    </div>
  );
}
