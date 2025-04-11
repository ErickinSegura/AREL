import { useState, useRef, useEffect } from 'react';

export const useSidebar = (defaultOpen = false) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const sidebarRef = useRef(null);
    const timerRef = useRef(null);

    const handleMouseEnter = () => {
        if (!isMobile) {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsOpen(true);
            }, 200);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsOpen(false);
            }, 200);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setIsOpen(false);
            } else {
                setIsMobile(false);
                setMobileMenuOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    return {
        isOpen,
        setIsOpen,
        isMobile,
        mobileMenuOpen,
        sidebarRef,
        handleMouseEnter,
        handleMouseLeave,
        toggleMobileMenu
    };
};