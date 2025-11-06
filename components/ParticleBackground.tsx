import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '../lib/utils';

type ParticleBackgroundProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function ParticleBackground({ className, ...props }: ParticleBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        let animationId: number;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);

        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);
        const geometry = new THREE.BufferGeometry();
        
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2000;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xFFD700,
            size: 1.5,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const handleMouseMove = (event: MouseEvent) => {
            mouse.current.x = event.clientX - window.innerWidth / 2;
            mouse.current.y = event.clientY - window.innerHeight / 2;
        };

        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        handleResize();

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Parallax effect
            camera.position.x += (mouse.current.x / 4 - camera.position.x) * 0.02;
            camera.position.y += (-mouse.current.y / 4 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            
            // Particle animation
            const time = Date.now() * 0.00005;
            particles.rotation.x = time * 0.25;
            particles.rotation.y = time * 0.5;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);

            scene.remove(particles);
            geometry.dispose();
            material.dispose();

            if (containerRef.current && renderer.domElement) {
                try {
                    containerRef.current.removeChild(renderer.domElement);
                } catch (e) {
                    // ignore
                }
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className={cn('pointer-events-none absolute inset-0 h-full w-full', className)} {...props} />;
}
