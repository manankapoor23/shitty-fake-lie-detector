'use client';

import { useState, useEffect } from "react";

export default function LieDetector() {
    const [state, setState] = useState<'neutral' | 'truth' | 'lie'>('neutral');
    const [displayText, setDisplayText] = useState('');
    const [showText, setShowText] = useState(false);
    const [variant, setVariant] = useState<'neutral' | 'truth' | 'lie'>('neutral');

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'Enter') {
                setState('truth');
                setVariant('truth');
                setDisplayText('Truth');
                setShowText(true);

                setTimeout(() => {
                    setState('neutral');
                    setVariant('neutral');
                    setShowText(false);
                }, 2000);
            } else if (event.code === 'Space') {
                event.preventDefault();
                setState('lie');
                setVariant('lie');
                setDisplayText('Lie');
                setShowText(true);

                setTimeout(() => {
                    setState('neutral');
                    setVariant('neutral');
                    setShowText(false);
                }, 2000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const getCircleColors = () => {
        switch (variant) {
            case 'truth':
                return {
                    border: 'border-green-400/60',
                    bg: 'bg-green-500/20',
                    shadow: 'shadow-green-500/30',
                    text: 'text-green-400',
                    glow: 'drop-shadow-[0_0_30px_rgba(34,197,94,0.8)]'
                };
            case 'lie':
                return {
                    border: 'border-red-400/60',
                    bg: 'bg-red-500/20',
                    shadow: 'shadow-red-500/30',
                    text: 'text-red-400',
                    glow: 'drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]'
                };
            default:
                return {
                    border: 'border-gray-400/40',
                    bg: 'bg-gray-500/10',
                    shadow: 'shadow-gray-500/20',
                    text: 'text-gray-400',
                    glow: ''
                };
        }
    };

    const colors = getCircleColors();

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
            {/* Animated grid background */}
            <div
                className="absolute inset-0 opacity-20 animate-grid"
                style={{
                    backgroundImage: 'repeating-linear-gradient(100deg, #64748B 0%, #64748B 1px, transparent 1px, transparent 4%)'
                }}
            />

            {/* Main circle container */}
            <div className="relative">
                {/* Outer circle */}
                <div
                    className={`absolute inset-0 w-96 h-96 rounded-full border-2 ${colors.border} ${colors.bg} ${colors.shadow} shadow-2xl transition-all duration-500 ${
                        showText ? 'animate-pulse-fast' : 'animate-spin-slow'
                    }`}
                />

                {/* Middle circle */}
                <div
                    className={`absolute inset-2 w-92 h-92 rounded-full border border-opacity-40 ${colors.border} transition-all duration-500 ${
                        showText ? 'animate-pulse-medium' : 'animate-spin-reverse'
                    }`}
                />

                {/* Inner circle */}
                <div
                    className={`absolute inset-4 w-88 h-88 rounded-full border border-opacity-20 ${colors.border} transition-all duration-500 ${
                        showText ? 'animate-pulse-slow' : 'animate-spin-slower'
                    }`}
                />

                {/* Center content */}
                <div className="w-96 h-96 flex items-center justify-center relative z-10">
                    {showText ? (
                        <div
                            className={`text-center transition-all duration-300 ${
                                showText ? 'scale-110 opacity-100' : 'scale-100 opacity-0'
                            }`}
                        >
                            <h2 className={`text-8xl md:text-9xl font-black tracking-wider ${colors.text} ${colors.glow}`}>
                                {displayText.toUpperCase()}
                            </h2>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h1 className="text-5xl font-bold tracking-tight text-white mb-4 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent"></h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}