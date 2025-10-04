import { useState, useCallback, useEffect } from 'react';

export type SoundType = 'mechanical' | 'gaming' | 'click';

const SOUND_MAP: Record<SoundType, string> = {
    mechanical: '/computer-keyboard-single-keystroke-gfx-sounds-2-2-00-00.mp3',
    gaming: '/gaming-keyboard-single-keystroke-gfx-sounds-2-2-00-00.mp3',
    click: '/ui-mechanical-button-click-gfx-sounds-1-1-00-00.mp3',
};

export const useTypingSound = () => {
    const [isMuted, setIsMuted] = useState<boolean>(() => {
        const saved = localStorage.getItem('quiktype-muted');
        return saved ? JSON.parse(saved) : false;
    });

    const [selectedSound, setSelectedSound] = useState<SoundType>(() => {
        const saved = localStorage.getItem('quiktype-sound');
        return (saved as SoundType) || 'mechanical';
    });

    const [audioElements, setAudioElements] = useState<Record<SoundType, HTMLAudioElement | null>>({
        mechanical: null,
        gaming: null,
        click: null,
    });

    useEffect(() => {
        const elements: Record<string, HTMLAudioElement> = {};
        Object.entries(SOUND_MAP).forEach(([key, file]) => {
            const audio = new Audio(file);
            audio.volume = 0.5;
            elements[key] = audio;
        });
        setAudioElements(elements as Record<SoundType, HTMLAudioElement>);
    }, []);

    useEffect(() => {
        localStorage.setItem('quiktype-muted', JSON.stringify(isMuted));
    }, [isMuted]);

    useEffect(() => {
        localStorage.setItem('quiktype-sound', selectedSound);
    }, [selectedSound]);

    const playSound = useCallback(() => {
        if (isMuted || !audioElements[selectedSound]) return;

        const audio = audioElements[selectedSound];
        if (!audio) return;

        // Clone the audio node to allow overlapping sounds
        const soundClone = audio.cloneNode() as HTMLAudioElement;
        soundClone.volume = 0.5;
        soundClone.play().catch((e) => console.error("Error playing sound:", e));
    }, [isMuted, audioElements, selectedSound]);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => !prev);
    }, []);

    return { playSound, isMuted, toggleMute, selectedSound, setSelectedSound };
};
