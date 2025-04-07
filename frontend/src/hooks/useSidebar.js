import { useState, useRef, useEffect } from 'react';
import { useRoute } from '../contexts/RouteContext';
import { routes } from '../routes';

export const useSidebar = (defaultOpen = false, defaultSelected = "Overview") => {
    const { setCurrentRoute } = useRoute();
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [selectedItem, setSelectedItem] = useState(defaultSelected);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const sidebarRef = useRef(null);
    const timerRef = useRef(null);

    // Handle mouse hover for desktop
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

    // Clean up timer on unmount
    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    // Handle window resize
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

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Update route when selected item changes
    useEffect(() => {
        const route = routes.find(r => r.label === selectedItem);
        if (route) {
            setCurrentRoute(route.path);
        }
    }, [selectedItem, setCurrentRoute]);

    // Disable body scroll when mobile menu is open
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
        selectedItem,
        setSelectedItem,
        isMobile,
        mobileMenuOpen,
        toggleMobileMenu,
        sidebarRef,
        handleMouseEnter,
        handleMouseLeave
    };
};