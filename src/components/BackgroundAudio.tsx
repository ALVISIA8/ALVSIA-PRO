import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export const BackgroundAudio = ({ videoId }: { videoId: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Attempt autoplay on first interaction anywhere
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  return (
    <div className="fixed bottom-10 right-8 z-[100] flex items-center gap-3">
      {/* Hidden YouTube Embed */}
      <div className="hidden pointer-events-none absolute -left-[9999px]">
        <iframe
          ref={playerRef}
          width="100"
          height="100"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${hasInteracted ? 1 : 0}&loop=1&playlist=${videoId}&mute=${isMuted ? 1 : 0}&controls=0`}
          title="Neural Background Audio"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Visual Controller */}
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/80 border border-zinc-800 rounded-lg backdrop-blur-xl group hover:border-blue-500/50 transition-all cursor-pointer"
             onClick={() => setIsMuted(!isMuted)}>
          <div className="flex items-center gap-2">
            {isMuted ? (
              <VolumeX className="w-3 h-3 text-red-500" />
            ) : (
              <Volume2 className="w-3 h-3 text-blue-400 animate-pulse" />
            )}
            <div className="flex gap-0.5 items-end h-3">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-[2px] bg-blue-500/50 rounded-full transition-all duration-300",
                    !isMuted && isPlaying ? "animate-bounce" : "h-1"
                  )}
                  style={{ 
                    animationDuration: `${0.5 + i * 0.15}s`,
                    height: !isMuted && isPlaying ? `${Math.random() * 10 + 4}px` : '4px'
                  }}
                />
              ))}
            </div>
          </div>
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-2 group-hover:text-blue-400 transition-colors">
            {isMuted ? "Audio_Muted" : "Neural_Stream"}
          </span>
        </div>
        
        {!hasInteracted && (
           <div className="text-[8px] text-blue-500/50 font-bold uppercase tracking-tighter animate-pulse">
              Click anywhere to initialize audio
           </div>
        )}
      </div>
    </div>
  );
};
