/**
 * LQAA Mobile JavaScript Interactions
 * Optimized for mobile devices and touch interactions
 */

'use strict';

const MobileApp = {
    // Initialize mobile app
    init() {
        this.bindEvents();
        this.initMobileNavigation();
        this.initSmoothScroll();
        this.initFormHandling();
        this.initScrollEffects();
        console.log('LQAA Mobile App initialized');
    },

    // Bind all event listeners
    bindEvents() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const mobileNav = document.getElementById('mobileNav');
        
        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.mobile-nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Service buttons
        const serviceButtons = document.querySelectorAll('.service-btn[data-service]');
        serviceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const service = e.target.getAttribute('data-service');
                this.handleServiceClick(service);
            });
        });

        // Training buttons
        const trainingButtons = document.querySelectorAll('.training-btn');
        trainingButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.scrollToSection('#contact');
            });
        });

        // Touch events for better mobile interaction
        this.initTouchEvents();
    },

    // Initialize mobile navigation
    initMobileNavigation() {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileNav = document.getElementById('mobileNav');
            const menuToggle = document.getElementById('menuToggle');
            
            if (mobileNav && menuToggle) {
                if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    if (mobileNav.classList.contains('active')) {
                        menuToggle.classList.remove('active');
                        mobileNav.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const mobileNav = document.getElementById('mobileNav');
                const menuToggle = document.getElementById('menuToggle');
                
                if (mobileNav && menuToggle) {
                    menuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }, 100);
        });
    },

    // Initialize smooth scrolling
    initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
            });
        });
    },

    // Scroll to section with mobile optimization
    scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;

        const headerHeight = document.querySelector('.mobile-header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    // Handle service clicks
    handleServiceClick(service) {
        // Pre-fill contact form
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = service;
        }
        
        // Scroll to contact form
        this.scrollToSection('#contact');
        
        // Add slight delay then focus on form
        setTimeout(() => {
            const nameInput = document.getElementById('name');
            if (nameInput) {
                nameInput.focus();
            }
        }, 800);
    },

    // Initialize form handling
    initFormHandling() {
        const form = document.getElementById('mobileContactForm');
        if (!form) return;

        // Add input validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Handle form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    },

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    },

    // Show field error
    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    },

    // Clear field error
    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    },

    // Handle form submission
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Validate form
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showMessage('error', 'Please fill in all required fields correctly.');
            return;
        }

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitBtn.disabled = true;

        try {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Submit to API
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('success', result.message || 'Your enquiry has been sent successfully!');
                form.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('error', error.message || 'Sorry, there was an error sending your message. Please try again or call us directly.');
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },

    // Show message
    showMessage(type, message) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.style.cssText = `
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
            font-weight: 500;
            ${type === 'success' ? 
                'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' : 
                'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
            }
        `;
        messageElement.textContent = message;

        const form = document.getElementById('mobileContactForm');
        if (form) {
            form.appendChild(messageElement);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    },

    // Initialize scroll effects
    initScrollEffects() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
    },

    // Update scroll effects
    updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.mobile-header');
        
        // Header background opacity based on scroll
        if (header) {
            const opacity = Math.min(scrolled / 100, 1);
            header.style.backgroundColor = `rgba(255, 255, 255, ${0.8 + (opacity * 0.2)})`;
        }
    },

    // Initialize touch events for better mobile interaction
    initTouchEvents() {
        // Add touch feedback to buttons
        const touchElements = document.querySelectorAll('.cta-btn, .service-btn, .training-btn, .submit-btn, .quick-btn');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 100);
            });
        });

        // Prevent zoom on double tap for specific elements
        const noZoomElements = document.querySelectorAll('input, select, textarea');
        noZoomElements.forEach(element => {
            element.addEventListener('touchend', (e) => {
                const now = new Date().getTime();
                const lastTouch = element.lastTouch || 0;
                const delta = now - lastTouch;
                
                if (delta < 500 && delta > 0) {
                    e.preventDefault();
                }
                
                element.lastTouch = now;
            });
        });
    },

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobileApp.init());
} else {
    MobileApp.init();
}

// Export for external use
window.MobileApp = MobileApp;