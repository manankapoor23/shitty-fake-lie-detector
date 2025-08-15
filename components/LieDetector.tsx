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
            if (event.repeat) return; // Ignore repeat events

            if (event.code === 'Enter' && !isPressed) {
                setState('truth');
                setIsPressed(true);
                truthAudioRef.current?.play();
            } else if (event.code === 'Space' && !isPressed) {
                event.preventDefault();
                setState('lie');
                setIsPressed(true);
                lieAudioRef.current?.play();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'Enter' || event.code === 'Space') {
                setState('neutral');
                setIsPressed(false);
                // Stop and reset audio
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

    const getStyles = () => {
        switch (state) {
            case 'truth':
                return {
                    border: 'border-green-400',
                    bg: 'bg-green-500/20',
                    text: 'text-green-400',
                    glow: 'drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]',
                    label: 'TRUTH'
                };
            case 'lie':
                return {
                    border: 'border-red-400',
                    bg: 'bg-red-500/20',
                    text: 'text-red-400',
                    glow: 'drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]',
                    label: 'LIE'
                };
            default:
                return {
                    border: 'border-gray-400/40',
                    bg: 'bg-gray-500/10',
                    text: 'text-gray-400',
                    glow: '',
                    label: ''
                };
        }
    };

    const styles = getStyles();

    return (
        <div className="relative h-screen w-full bg-black flex items-center justify-center">
            {/* Audio elements */}
            <audio ref={truthAudioRef} preload="auto" loop>
                <source src="/truth.mp3" type="audio/mpeg" />
            </audio>
            <audio ref={lieAudioRef} preload="auto" loop>
                <source src="/lie.mp3" type="audio/mpeg" />
            </audio>

            {/* Main circle */}
            <div className="relative">
                <div className={`w-96 h-96 rounded-full border-2 ${styles.border} ${styles.bg} transition-all duration-300 animate-spin-slow`} />

                {/* Center content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        {state !== 'neutral' ? (
                            <h2 className={`text-7xl font-black ${styles.text} ${styles.glow}`}>
                                {styles.label}
                            </h2>
                        ) : (
                            <>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Instructions */}
            {/*<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">*/}
            {/*    <div className="bg-black/50 backdrop-blur rounded-lg px-6 py-3 border border-gray-700/50">*/}
            {/*        <p className="text-white text-sm">*/}
            {/*            <kbd className="px-2 py-1 bg-white/10 rounded mr-2">ENTER</kbd>*/}
            {/*            Truth*/}
            {/*            <span className="mx-4">•</span>*/}
            {/*            <kbd className="px-2 py-1 bg-white/10 rounded mr-2">SPACE</kbd>*/}
            {/*            Lie*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
}