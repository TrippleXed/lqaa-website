/**
 * LQAA Device Detection & Redirection
 * Detects mobile devices and redirects to mobile-optimized version
 */

(function() {
    'use strict';
    
    // Mobile detection patterns
    const mobilePatterns = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
        /Opera Mini/i,
        /IEMobile/i,
        /Mobile/i
    ];
    
    // Tablet detection patterns (treat as mobile for this site)
    const tabletPatterns = [
        /iPad/i,
        /Android.*Tablet/i,
        /Windows.*Touch/i,
        /Kindle/i,
        /PlayBook/i,
        /Nexus.*7/i
    ];
    
    // Screen size detection
    function isSmallScreen() {
        return window.screen.width <= 768 || window.innerWidth <= 768;
    }
    
    // Touch device detection
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }
    
    // Main mobile detection function
    function isMobileDevice() {
        const userAgent = navigator.userAgent;
        
        // Check user agent patterns
        const isMobileUA = mobilePatterns.some(pattern => pattern.test(userAgent));
        const isTabletUA = tabletPatterns.some(pattern => pattern.test(userAgent));
        
        // Combine checks
        return isMobileUA || isTabletUA || isSmallScreen() || (isTouchDevice() && isSmallScreen());
    }
    
    // Check if user manually chose desktop version
    function userWantsDesktop() {
        return localStorage.getItem('preferDesktop') === 'true' || 
               new URLSearchParams(window.location.search).get('desktop') === 'true';
    }
    
    // Redirect to mobile version
    function redirectToMobile() {
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            window.location.replace('/mobile.html');
        }
    }
    
    // Add desktop preference option
    function addDesktopOption() {
        if (isMobileDevice() && (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
            // Create desktop version link
            const desktopLink = document.createElement('div');
            desktopLink.innerHTML = `
                <div id="desktop-option" style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(26, 35, 50, 0.9);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 25px;
                    font-size: 14px;
                    z-index: 10000;
                    backdrop-filter: blur(10px);
                    cursor: pointer;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                ">
                    <i class="fas fa-desktop" style="margin-right: 5px;"></i>
                    Desktop Version
                </div>
            `;
            
            desktopLink.onclick = function() {
                localStorage.setItem('preferDesktop', 'true');
                window.location.reload();
            };
            
            document.body.appendChild(desktopLink);
        }
    }
    
    // Initialize device detection
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // If user specifically wants desktop, don't redirect
        if (userWantsDesktop()) {
            addDesktopOption();
            return;
        }
        
        // If mobile device detected, redirect to mobile version
        if (isMobileDevice()) {
            redirectToMobile();
        }
    }
    
    // Start detection
    init();
    
    // Export for external use
    window.DeviceDetection = {
        isMobile: isMobileDevice,
        isSmallScreen: isSmallScreen,
        isTouchDevice: isTouchDevice,
        userWantsDesktop: userWantsDesktop
    };
    
})();