"use client";
import Image, { StaticImageData } from "next/image";
import React, { useState, useEffect } from "react";

interface EventBoxProps {
    name: string;
    date: string;
    location: string;
    details: string;
    image: StaticImageData;
}

export const EventBox: React.FC<EventBoxProps> = ({ name, date, location, details, image }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const modal = document.getElementById('modal');
            if (modal && !modal.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                tabIndex={0}
                role="button"
                className="bg-white rounded-2xl shadow-md w-full max-w-[320px] h-[400px] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
                <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="w-full flex flex-col">
                    <div className="w-full h-40 overflow-hidden relative">
                        <Image 
                            src={image}
                            alt={name}
                            width={320}
                            height={200}
                            className="w-full h-full object-cover brightness-75"
                            priority
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h2 className="font-syne text-white text-2xl md:text-3xl font-bold text-center">{name}</h2>
                        </div>
                    </div>
                </div>
                <div className="w-[90%] bg-white border border-[#d1e7dd] rounded-xl p-4 mb-4 flex items-center gap-3 mt-10">
                    <span className="flex items-center">
                        <svg width="24" height="24" fill="none" stroke="#176a4a" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 9h18"/></svg>
                    </span>
                    <span className="font-syne text-gray-700 text-sm md:text-base font-medium text-center w-full">{date}</span>
                </div>
                <div className="w-[90%] bg-white border border-[#d1e7dd] rounded-xl p-4 mb-4 flex items-center gap-3">
                    <span className="flex items-center">
                        <svg width="24" height="24" fill="none" stroke="#176a4a" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z"/></svg>
                    </span>
                    <span className="font-syne text-gray-700 text-sm md:text-base font-medium text-center w-full">{location}</span>
                </div>
            </div>
            {isModalOpen && (
                <div
                    onClick={() => setIsModalOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        id="modal"
                        className="bg-white rounded-2xl p-6 md:p-8 max-w-[600px] w-[95%] md:w-[90%] max-h-[90vh] overflow-auto relative">
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsModalOpen(false);
                            }}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '8px',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                borderRadius: '50%',
                                transition: 'background-color 0.2s'
                            }}
                            className="hover:bg-[#e9f2eb]"
                        >
                            <span style={{
                                fontSize: '28px',
                                lineHeight: '28px',
                                height: '28px',
                                color: '#176a4a',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transform: 'translateY(-2px)'
                            }}>×</span>
                        </div>
                        <h2 className="font-syne text-iveyGreen text-2xl font-semibold mb-4">{name}</h2>
                        <div className="font-syne text-gray-700 mb-3">
                            <div className="flex items-center mb-2">
                                <svg width="20" height="20" fill="none" stroke="#176a4a" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
                                    <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 9h18"/>
                                </svg>
                                {date}
                            </div>
                            <div className="flex items-center mb-4">
                                <svg width="20" height="20" fill="none" stroke="#176a4a" strokeWidth="2" viewBox="0 0 24 24" className="mr-2">
                                    <path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z"/>
                                </svg>
                                {location}
                            </div>
                        </div>
                        <p className="font-syne text-gray-700 mb-6">{details}</p>
                        <button 
                            disabled
                            className="font-syne bg-iveyGreen text-white px-6 py-3 rounded-lg opacity-75 cursor-not-allowed"
                        >
                            Tickets Coming Soon
                        </button>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};