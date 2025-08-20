'use client';

import { useState, useEffect, useRef } from "react";

type State = 'neutral' | 'truth' | 'lie';

export default function LieDetector() {
    const [state, setState] = useState<State>('neutral');
    const [isPressed, setIsPressed] = useState(false);
    const truthAudioRef = useRef<HTMLAudioElement>(null);
    const lieAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return;

            if (event.code === 'Enter' && !isPressed) {
                setState('truth');
                setIsPressed(true);

                if (truthAudioRef.current) {
                    truthAudioRef.current.currentTime = 0;
                    truthAudioRef.current.play().catch(err => console.log("Truth audio blocked:", err));
                }
            } else if (event.code === 'Space' && !isPressed) {
                event.preventDefault();
                setState('lie');
                setIsPressed(true);

                if (lieAudioRef.current) {
                    lieAudioRef.current.currentTime = 0;
                    lieAudioRef.current.play().catch(err => console.log("Lie audio blocked:", err));
                }
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'Enter' || event.code === 'Space') {
                setState('neutral');
                setIsPressed(false);
                if (truthAudioRef.current) {
                    truthAudioRef.current.pause();
                    truthAudioRef.current.currentTime = 0;
                }
                if (lieAudioRef.current) {
                    lieAudioRef.current.pause();
                    lieAudioRef.current.currentTime = 0;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isPressed]);

    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background image */}
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/bg.jpg')" }}
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Audio elements */}
            <audio ref={truthAudioRef} preload="auto">
                <source src="/truth.mp3" type="audio/mpeg" />
            </audio>
            <audio ref={lieAudioRef} preload="auto">
                <source src="/lie.mp3" type="audio/mpeg" />
            </audio>

            {/* Lens */}
            <div className="relative">
                <div
                    className={`
                        w-96 h-96 rounded-full border-8 
                        flex items-center justify-center
                        transition-all duration-300 
                        ${state === 'truth' ? "border-green-500 shadow-[0_0_50px_20px_rgba(34,197,94,0.7)]" : ""}
                        ${state === 'lie' ? "border-red-500 shadow-[0_0_50px_20px_rgba(239,68,68,0.7)]" : ""}
                        ${state === 'neutral' ? "border-gray-700 shadow-[0_0_40px_rgba(0,0,0,0.6)]" : ""}
    
                    `}
                    style={{
                        background: "radial-gradient(circle at 30% 30%, #111 0%, #000 70%)"
                    }}
                >
                    {/* Inner glassy lens */}
                    <div className={`
                        w-64 h-64 rounded-full flex items-center justify-center 
                        transition-all duration-300
                        ${state === 'truth' ? "bg-green-900/40 animate-pulse" : ""}
                        ${state === 'lie' ? "bg-red-900/40 animate-pulse" : ""}
                        ${state === 'neutral' ? "bg-gray-800/40" : ""}
                    `}>
                        <h2 className={`
                            text-6xl font-black 
                            ${state === 'truth' ? "text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.9)]" : ""}
                            ${state === 'lie' ? "text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]" : ""}
                            ${state === 'neutral' ? "text-gray-400" : ""}
                        `}>
                            {state === 'truth' ? "TRUTH" : state === 'lie' ? "LIE" : ""}
                        </h2>
                    </div>

                    {/* Extra concentric rings */}
                    <div className="absolute inset-2 rounded-full border-2 border-gray-600/30" />
                    <div className="absolute inset-8 rounded-full border border-gray-500/20" />
                </div>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

            `}</style>
        </div>
    );
}
