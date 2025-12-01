"use client"

import React, { useEffect, useRef, useState } from 'react';

const GlobalReach = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Globe properties
        const centerX = canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        // Continent outlines (simplified coordinates)
        const continents = [
            // North America
            [
                { lat: 60, lng: -150 }, { lat: 70, lng: -140 }, { lat: 75, lng: -100 },
                { lat: 70, lng: -60 }, { lat: 60, lng: -50 }, { lat: 50, lng: -60 },
                { lat: 40, lng: -70 }, { lat: 30, lng: -80 }, { lat: 25, lng: -100 },
                { lat: 20, lng: -110 }, { lat: 30, lng: -120 }, { lat: 40, lng: -130 },
                { lat: 50, lng: -140 }, { lat: 60, lng: -150 }
            ],
            // South America
            [
                { lat: 10, lng: -80 }, { lat: 5, lng: -70 }, { lat: -10, lng: -60 },
                { lat: -20, lng: -50 }, { lat: -30, lng: -55 }, { lat: -40, lng: -60 },
                { lat: -50, lng: -70 }, { lat: -45, lng: -75 }, { lat: -30, lng: -80 },
                { lat: -10, lng: -85 }, { lat: 0, lng: -85 }, { lat: 10, lng: -80 }
            ],
            // Europe
            [
                { lat: 70, lng: -10 }, { lat: 70, lng: 30 }, { lat: 60, lng: 40 },
                { lat: 50, lng: 45 }, { lat: 40, lng: 40 }, { lat: 35, lng: 30 },
                { lat: 35, lng: 10 }, { lat: 40, lng: 0 }, { lat: 50, lng: -5 },
                { lat: 60, lng: -10 }, { lat: 70, lng: -10 }
            ],
            // Africa
            [
                { lat: 35, lng: 10 }, { lat: 35, lng: 40 }, { lat: 20, lng: 50 },
                { lat: 0, lng: 45 }, { lat: -20, lng: 40 }, { lat: -35, lng: 30 },
                { lat: -35, lng: 20 }, { lat: -20, lng: 15 }, { lat: 0, lng: 10 },
                { lat: 20, lng: 5 }, { lat: 35, lng: 10 }
            ],
            // Asia
            [
                { lat: 70, lng: 30 }, { lat: 75, lng: 60 }, { lat: 70, lng: 100 },
                { lat: 60, lng: 140 }, { lat: 50, lng: 150 }, { lat: 40, lng: 140 },
                { lat: 30, lng: 120 }, { lat: 20, lng: 100 }, { lat: 10, lng: 90 },
                { lat: 20, lng: 70 }, { lat: 30, lng: 60 }, { lat: 40, lng: 50 },
                { lat: 50, lng: 40 }, { lat: 60, lng: 40 }, { lat: 70, lng: 30 }
            ],
            // Australia
            [
                { lat: -10, lng: 110 }, { lat: -15, lng: 130 }, { lat: -25, lng: 140 },
                { lat: -35, lng: 145 }, { lat: -40, lng: 140 }, { lat: -35, lng: 120 },
                { lat: -25, lng: 115 }, { lat: -15, lng: 110 }, { lat: -10, lng: 110 }
            ]
        ];
        // Dots representing global locations
        const dots: Array<{
            x: number;
            y: number;
            z: number;
            originalX: number;
            originalY: number;
            originalZ: number;
            pulse: number;
            pulseSpeed: number;
            visible: boolean;
        }> = [];

        // Create dots for major cities/regions
        const locations = [
            { lat: 40.7128, lng: -74.0060 }, // New York
            { lat: 51.5074, lng: -0.1278 },  // London
            { lat: 35.6762, lng: 139.6503 }, // Tokyo
            { lat: -33.8688, lng: 151.2093 }, // Sydney
            { lat: 55.7558, lng: 37.6176 },  // Moscow
            { lat: 19.4326, lng: -99.1332 }, // Mexico City
            { lat: -23.5505, lng: -46.6333 }, // São Paulo
            { lat: 28.6139, lng: 77.2090 },  // Delhi
            { lat: 31.2304, lng: 121.4737 }, // Shanghai
            { lat: 1.3521, lng: 103.8198 },  // Singapore
            { lat: -26.2041, lng: 28.0473 }, // Johannesburg
            { lat: 25.2048, lng: 55.2708 },  // Dubai
            { lat: 52.5200, lng: 13.4050 },  // Berlin
            { lat: 48.8566, lng: 2.3522 },   // Paris
            { lat: 37.7749, lng: -122.4194 }, // San Francisco
            { lat: 43.6532, lng: -79.3832 }, // Toronto
            { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
            { lat: 59.9139, lng: 10.7522 },  // Oslo
            { lat: 41.9028, lng: 12.4964 },  // Rome
            { lat: 39.9042, lng: 116.4074 }, // Beijing
        ];

        // Convert lat/lng to 3D coordinates
        locations.forEach((location, index) => {
            const lat = (location.lat * Math.PI) / 180;
            const lng = (location.lng * Math.PI) / 180;

            const x = radius * Math.cos(lat) * Math.cos(lng);
            const y = radius * Math.sin(lat);
            const z = radius * Math.cos(lat) * Math.sin(lng);

            dots.push({
                x,
                y,
                z,
                originalX: x,
                originalY: y,
                originalZ: z,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02,
                visible: z > 0
            });
        });

        // Convert continent coordinates to 3D
        const continent3D = continents.map(continent =>
            continent.map(point => {
                const lat = (point.lat * Math.PI) / 180;
                const lng = (point.lng * Math.PI) / 180;

                return {
                    x: radius * Math.cos(lat) * Math.cos(lng),
                    y: radius * Math.sin(lat),
                    z: radius * Math.cos(lat) * Math.sin(lng),
                    originalX: radius * Math.cos(lat) * Math.cos(lng),
                    originalY: radius * Math.sin(lat),
                    originalZ: radius * Math.cos(lat) * Math.sin(lng)
                };
            })
        );

        // Animation variables
        let rotation = 0;
        const rotationSpeed = 0.005;

        // Connection lines between dots
        const connections: Array<{ from: number; to: number; progress: number; speed: number }> = [];

        // Create some random connections
        for (let i = 0; i < 8; i++) {
            const from = Math.floor(Math.random() * dots.length);
            let to = Math.floor(Math.random() * dots.length);
            while (to === from) {
                to = Math.floor(Math.random() * dots.length);
            }
            connections.push({
                from,
                to,
                progress: Math.random(),
                speed: 0.005 + Math.random() * 0.01
            });
        }

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            // Update rotation
            rotation += rotationSpeed;

            // Update dots
            dots.forEach((dot, index) => {
                // Rotate around Y axis
                const cosRotation = Math.cos(rotation);
                const sinRotation = Math.sin(rotation);

                dot.x = dot.originalX * cosRotation - dot.originalZ * sinRotation;
                dot.z = dot.originalX * sinRotation + dot.originalZ * cosRotation;
                dot.y = dot.originalY;

                // Update visibility (front hemisphere)
                dot.visible = dot.z > 0;

                // Update pulse
                dot.pulse += dot.pulseSpeed;
            });

            // Update continent coordinates
            continent3D.forEach(continent => {
                continent.forEach(point => {
                    const cosRotation = Math.cos(rotation);
                    const sinRotation = Math.sin(rotation);

                    point.x = point.originalX * cosRotation - point.originalZ * sinRotation;
                    point.z = point.originalX * sinRotation + point.originalZ * cosRotation;
                    point.y = point.originalY;
                });
            });

            // Draw continents
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';

            continent3D.forEach(continent => {
                ctx.beginPath();
                let firstPoint = true;

                continent.forEach(point => {
                    if (point.z > 0) { // Only draw visible parts
                        const screenX = centerX + point.x;
                        const screenY = centerY - point.y;

                        if (firstPoint) {
                            ctx.moveTo(screenX, screenY);
                            firstPoint = false;
                        } else {
                            ctx.lineTo(screenX, screenY);
                        }
                    }
                });

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });

            // Draw globe wireframe
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1;

            // Draw latitude lines
            for (let lat = -80; lat <= 80; lat += 20) {
                ctx.beginPath();
                for (let lng = 0; lng <= 360; lng += 5) {
                    const latRad = (lat * Math.PI) / 180;
                    const lngRad = (lng * Math.PI) / 180;

                    const x = radius * Math.cos(latRad) * Math.cos(lngRad);
                    const y = radius * Math.sin(latRad);
                    const z = radius * Math.cos(latRad) * Math.sin(lngRad);

                    // Rotate
                    const rotatedX = x * Math.cos(rotation) - z * Math.sin(rotation);
                    const rotatedZ = x * Math.sin(rotation) + z * Math.cos(rotation);

                    if (rotatedZ > 0) {
                        const screenX = centerX + rotatedX;
                        const screenY = centerY - y;

                        if (lng === 0) {
                            ctx.moveTo(screenX, screenY);
                        } else {
                            ctx.lineTo(screenX, screenY);
                        }
                    }
                }
                ctx.stroke();
            }

            // Draw longitude lines
            for (let lng = 0; lng < 360; lng += 30) {
                ctx.beginPath();
                for (let lat = -90; lat <= 90; lat += 5) {
                    const latRad = (lat * Math.PI) / 180;
                    const lngRad = (lng * Math.PI) / 180;

                    const x = radius * Math.cos(latRad) * Math.cos(lngRad);
                    const y = radius * Math.sin(latRad);
                    const z = radius * Math.cos(latRad) * Math.sin(lngRad);

                    // Rotate
                    const rotatedX = x * Math.cos(rotation) - z * Math.sin(rotation);
                    const rotatedZ = x * Math.sin(rotation) + z * Math.cos(rotation);

                    if (rotatedZ > 0) {
                        const screenX = centerX + rotatedX;
                        const screenY = centerY - y;

                        if (lat === -90) {
                            ctx.moveTo(screenX, screenY);
                        } else {
                            ctx.lineTo(screenX, screenY);
                        }
                    }
                }
                ctx.stroke();
            }

            // Draw connections
            connections.forEach(connection => {
                const fromDot = dots[connection.from];
                const toDot = dots[connection.to];

                if (fromDot.visible && toDot.visible) {
                    const fromX = centerX + fromDot.x;
                    const fromY = centerY - fromDot.y;
                    const toX = centerX + toDot.x;
                    const toY = centerY - toDot.y;

                    // Draw connection line
                    const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(fromX, fromY);
                    ctx.lineTo(toX, toY);
                    ctx.stroke();

                    // Draw animated pulse along the line
                    const pulseX = fromX + (toX - fromX) * connection.progress;
                    const pulseY = fromY + (toY - fromY) * connection.progress;

                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.beginPath();
                    ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Update connection progress
                    connection.progress += connection.speed;
                    if (connection.progress > 1) {
                        connection.progress = 0;
                    }
                }
            });

            // Draw dots
            dots.forEach(dot => {
                if (dot.visible) {
                    const screenX = centerX + dot.x;
                    const screenY = centerY - dot.y;

                    // Pulsing effect
                    const pulseSize = 3 + Math.sin(dot.pulse) * 1.5;
                    const pulseOpacity = 0.6 + Math.sin(dot.pulse) * 0.4;

                    // Outer glow
                    const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, pulseSize * 2);
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${pulseOpacity})`);
                    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, pulseSize * 2, 0, Math.PI * 2);
                    ctx.fill();

                    // Inner dot
                    ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isVisible]);

    const stats = [
        {
            number: "500+",
            label: "Tiendas",
            sublabel: "Registradas"
        },
        {
            number: "10k+",
            label: "Usuarios",
            sublabel: "Activos"
        },
        {
            number: "2k+",
            label: "Trabajadores",
            sublabel: "Verificados"
        },
        {
            number: "24/7",
            label: "Soporte",
            sublabel: "Disponible"
        }
    ];

    return (
        <section id="global" className="py-20 bg-[#0a0a0a] relative overflow-hidden" ref={ref}>
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
                    }`}>
                    {/* Left Content */}
                    <div className="space-y-8">
                        <div>
                            <p className="text-white font-semibold text-lg mb-4">Alcance Global</p>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                Conectando Servicios
                                <br />
                                <span className="text-gray-400">En Todo el Mundo</span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Nuestra plataforma rompe fronteras, conectando a proveedores de servicios con clientes en múltiples países. Únete a nuestra red global en expansión.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="text-2xl lg:text-3xl font-bold text-white">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-300 font-medium">
                                        {stat.label}
                                    </div>
                                    {stat.sublabel && (
                                        <div className="text-gray-400 text-sm">
                                            {stat.sublabel}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Globe */}
                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-[500px] lg:h-[600px]"
                            style={{ background: 'transparent' }}
                        />

                        {/* Floating particles */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 3}s`,
                                        animationDuration: `${2 + Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GlobalReach;
