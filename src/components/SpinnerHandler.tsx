"use client";
import { useEffect } from 'react';

const SpinnerHandler = () => {
    useEffect(() => {
        // Function to handle the nav item click
        const handleNavItemClick = (event:any) => {
            document.querySelector('#mainWindowDiv')?.setAttribute('style', 'display:none');
              document.querySelector('#content-load-spinner')?.setAttribute('style', 'display:flex');
        };

        // Select all nav items
        const spinOnClickItems = Array.from(document.querySelectorAll('.nav-item')).concat(Array.from(document.querySelectorAll('.news-card')));

        // Attach event listeners
        spinOnClickItems.forEach(item => item.addEventListener('click', handleNavItemClick));

        // Cleanup function to remove event listeners
        return () => {
            spinOnClickItems.forEach(item => item.removeEventListener('click', handleNavItemClick));
        };
    }, []); // Empty dependency array to run once on mount

    return null; // This component doesn't render anything visible
};

export default SpinnerHandler;
