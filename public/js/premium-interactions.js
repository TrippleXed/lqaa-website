/**
 * LQAA Premium Website - Advanced JavaScript Interactions
 * World-class user experience with sophisticated animations and functionality
 */

'use strict';

// ==========================================
// GLOBAL VARIABLES AND CONFIGURATION
// ==========================================

const LQAA = {
    // Configuration
    config: {
        animationDuration: 800,
        scrollOffset: 100,
        preloaderDelay: 2000,
        debounceDelay: 100,
        counterAnimationDuration: 2000
    },
    
    // State management
    state: {
        isLoaded: false,
        isMobileMenuOpen: false,
        hasScrolled: false,
        activeSection: 'home',
        animatedCounters: new Set()
    },
    
    // DOM element cache
    elements: {},
    
    // Initialize the website
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.initPreloader();
        this.initNavigation();
        this.initScrollEffects();
        this.initAnimations();
        this.initCounters();
        this.initFormHandling();
        this.initParallax();
        console.log('LQAA Premium Website initialized successfully');
    },
    
    // Cache frequently used DOM elements
    cacheDOMElements() {
        this.elements = {
            // Main elements
            body: document.body,
            header: document.getElementById('header'),
            preloader: document.getElementById('preloader'),
            backToTop: document.getElementById('backToTop'),
            
            // Navigation
            mobileToggle: document.getElementById('mobileToggle'),
            navMenu: document.getElementById('navMenu'),
            navLinks: document.querySelectorAll('.nav-link'),
            
            // Sections
            sections: document.querySelectorAll('section[id]'),
            
            // Interactive elements
            counters: document.querySelectorAll('[data-count]'),
            form: document.getElementById('contactForm'),
            floatingElements: document.querySelectorAll('.float-element'),
            
            // Animation targets
            animateElements: document.querySelectorAll('[class*="animate-"]'),
            
            // Cards and interactive components
            cards: document.querySelectorAll('.expertise-card, .service-card, .training-card'),
            buttons: document.querySelectorAll('.btn, .cta-button, .service-btn')
        };
    },
    
    // Bind all event listeners
    bindEvents() {
        // Window events
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        
        // Navigation events
        if (this.elements.mobileToggle) {
            this.elements.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Smooth scroll for navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Back to top button
        if (this.elements.backToTop) {
            this.elements.backToTop.addEventListener('click', () => this.scrollToTop());
        }
        
        // Form submission
        if (this.elements.form) {
            this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Card hover effects
        this.elements.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.animateCard(card, 'enter'));
            card.addEventListener('mouseleave', () => this.animateCard(card, 'leave'));
        });
        
        // Button interactions
        this.elements.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e));
        });
        
        // Intersection Observer for animations
        this.initIntersectionObserver();
    },
    
    // ==========================================
    // PRELOADER
    // ==========================================
    
    initPreloader() {
        if (!this.elements.preloader) return;
        
        // Animate loading progress
        const progressBar = this.elements.preloader.querySelector('.loading-progress');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressBar.style.width = `${progress}%`;
            }, 100);
        }
    },
    
    handlePageLoad() {
        setTimeout(() => {
            this.hidePreloader();
            this.state.isLoaded = true;
            this.initOnLoadAnimations();
        }, this.config.preloaderDelay);
    },
    
    hidePreloader() {
        if (!this.elements.preloader) return;
        
        this.elements.preloader.classList.add('hide');
        this.elements.body.classList.remove('loading');
        
        setTimeout(() => {
            this.elements.preloader.style.display = 'none';
        }, 500);
    },
    
    // ==========================================
    // NAVIGATION
    // ==========================================
    
    initNavigation() {
        // Set initial active state
        this.updateActiveNavLink();
    },
    
    toggleMobileMenu() {
        this.state.isMobileMenuOpen = !this.state.isMobileMenuOpen;
        
        if (this.elements.mobileToggle) {
            this.elements.mobileToggle.classList.toggle('active', this.state.isMobileMenuOpen);
        }
        
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.toggle('active', this.state.isMobileMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        this.elements.body.style.overflow = this.state.isMobileMenuOpen ? 'hidden' : '';
    },
    
    handleNavClick(e) {
        const link = e.currentTarget;
        const targetId = link.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                this.scrollToSection(targetElement);
                
                // Close mobile menu if open
                if (this.state.isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            }
        }
    },
    
    scrollToSection(element) {
        const headerHeight = this.elements.header ? this.elements.header.offsetHeight : 0;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    
    updateActiveNavLink() {
        const scrollPosition = window.scrollY + this.config.scrollOffset;
        let activeSection = '';
        
        // Find current section
        this.elements.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section.getAttribute('id');
            }
        });
        
        // Update navigation links
        this.elements.navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === activeSection);
        });
        
        this.state.activeSection = activeSection;
    },
    
    // ==========================================
    // SCROLL EFFECTS
    // ==========================================
    
    initScrollEffects() {
        // Throttle scroll events
        this.throttledScroll = this.throttle(() => {
            this.updateHeaderState();
            this.updateActiveNavLink();
            this.updateBackToTopButton();
            this.updateCountersOnScroll();
        }, this.config.debounceDelay);
        
        window.addEventListener('scroll', this.throttledScroll);
    },
    
    handleScroll() {
        this.throttledScroll();
    },
    
    updateHeaderState() {
        if (!this.elements.header) return;
        
        const shouldAddScrolled = window.scrollY > 50;
        
        if (shouldAddScrolled !== this.state.hasScrolled) {
            this.state.hasScrolled = shouldAddScrolled;
            this.elements.header.classList.toggle('scrolled', shouldAddScrolled);
        }
    },
    
    updateBackToTopButton() {
        if (!this.elements.backToTop) return;
        
        const shouldShow = window.scrollY > 300;
        this.elements.backToTop.classList.toggle('visible', shouldShow);
    },
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    // ==========================================
    // ANIMATIONS
    // ==========================================
    
    initAnimations() {
        // Initialize entrance animations for elements in viewport
        this.animateVisibleElements();
    },
    
    initOnLoadAnimations() {
        // Hero elements animation
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-stats, .hero-actions');
        
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'all 0.8s ease';
                
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
            }, index * 150);
        });
        
        // Hero visual cards animation
        const visualCards = document.querySelectorAll('.visual-card');
        visualCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(20px)';
                card.style.transition = 'all 0.6s ease';
                
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                });
            }, 800 + (index * 200));
        });
    },
    
    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    this.intersectionObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all animatable elements
        const elementsToAnimate = document.querySelectorAll(`
            .section-header,
            .expertise-card,
            .service-card,
            .training-card,
            .trust-item,
            .highlight-item,
            .option-card,
            .info-card,
            .stat-card
        `);
        
        elementsToAnimate.forEach(element => {
            this.intersectionObserver.observe(element);
        });
    },
    
    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(40px)';
        element.style.transition = 'all 0.8s ease';
        
        // Add random delay for staggered effect
        const delay = Math.random() * 200;
        
        setTimeout(() => {
            requestAnimationFrame(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }, delay);
    },
    
    animateVisibleElements() {
        const elements = document.querySelectorAll('[class*="animate-"]');
        elements.forEach(element => {
            if (this.isElementInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'none';
            }
        });
    },
    
    animateCard(card, action) {
        if (action === 'enter') {
            // Add subtle scaling and glow effect
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Add glow effect
            const glowIntensity = card.classList.contains('featured') ? '0 0 30px rgba(245, 158, 11, 0.3)' : '0 0 20px rgba(37, 99, 235, 0.2)';
            card.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.25), ${glowIntensity}`;
        } else {
            card.style.transition = 'all 0.3s ease';
            card.style.boxShadow = '';
        }
    },
    
    // ==========================================
    // COUNTERS
    // ==========================================
    
    initCounters() {
        this.updateCountersOnScroll();
    },
    
    updateCountersOnScroll() {
        this.elements.counters.forEach(counter => {
            if (this.isElementInViewport(counter) && !this.state.animatedCounters.has(counter)) {
                this.animateCounter(counter);
                this.state.animatedCounters.add(counter);
            }
        });
    },
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = this.config.counterAnimationDuration;
        const start = performance.now();
        const startValue = 0;
        const suffix = element.querySelector('.stat-suffix');
        const suffixText = suffix ? suffix.outerHTML : '';
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutCubic);
            
            element.innerHTML = currentValue + suffixText;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.innerHTML = target + suffixText;
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // ==========================================
    // PARALLAX EFFECTS
    // ==========================================
    
    initParallax() {
        if (!this.elements.floatingElements.length) return;
        
        window.addEventListener('scroll', this.throttle(() => {
            this.updateParallaxElements();
        }, 16)); // ~60fps
    },
    
    updateParallaxElements() {
        const scrollY = window.scrollY;
        
        this.elements.floatingElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
            const yPos = scrollY * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    },
    
    // ==========================================
    // FORM HANDLING
    // ==========================================
    
    initFormHandling() {
        if (!this.elements.form) return;
        
        // Add real-time validation
        const formInputs = this.elements.form.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    },
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        }
    },
    
    validateForm() {
        const formInputs = this.elements.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        formInputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';
        
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
        
        this.showFieldValidation(field, isValid, errorMessage);
        return isValid;
    },
    
    showFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Update field styling
        field.style.borderColor = isValid ? '' : '#ef4444';
        
        // Add error message if invalid
        if (!isValid && errorMessage) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            formGroup.appendChild(errorElement);
        }
    },
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        field.style.borderColor = '';
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    },
    
    async submitForm() {
        const submitButton = this.elements.form.querySelector('.submit-btn');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        submitButton.disabled = true;
        
        try {
            // Get form data
            const formData = new FormData(this.elements.form);
            const data = Object.fromEntries(formData.entries());
            
            // Submit to Vercel API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Show success message
                this.showFormMessage('success', result.message);
                this.elements.form.reset();
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage('error', error.message || 'Sorry, there was an error sending your message. Please try again or call us directly.');
        } finally {
            // Restore button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    },
    
    
    showFormMessage(type, message) {
        // Remove existing message
        const existingMessage = this.elements.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message-${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            margin-top: 1rem;
            font-weight: 500;
            ${type === 'success' ? 
                'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' : 
                'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
            }
        `;
        
        this.elements.form.appendChild(messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    },
    
    // ==========================================
    // BUTTON INTERACTIONS
    // ==========================================
    
    handleButtonClick(e) {
        const button = e.currentTarget;
        
        // Add ripple effect
        this.createRippleEffect(button, e);
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    },
    
    createRippleEffect(button, e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.querySelector('[data-ripple-styles]')) {
            style.setAttribute('data-ripple-styles', '');
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    },
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    handleResize() {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768 && this.state.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
        
        // Recalculate animations if needed
        this.animateVisibleElements();
    },
    
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= windowHeight &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        ) || (
            rect.top < windowHeight &&
            rect.bottom >= 0
        );
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
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

// ==========================================
// ADDITIONAL PREMIUM FEATURES
// ==========================================

// Advanced smooth scrolling with easing
function smoothScrollTo(element, duration = 1000) {
    const start = window.pageYOffset;
    const target = element.offsetTop - (LQAA.elements.header?.offsetHeight || 0);
    const distance = target - start;
    const startTime = performance.now();
    
    function animation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-in-out-cubic)
        const easeInOutCubic = progress < 0.5 ? 
            4 * progress * progress * progress : 
            1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, start + distance * easeInOutCubic);
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Enhanced typing effect for dynamic text
function createTypingEffect(element, texts, speed = 100) {
    if (!element || !texts.length) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = speed;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// Particle effect for premium visual enhancement
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            particleCount: 50,
            particleSize: 2,
            speed: 0.5,
            color: 'rgba(255, 255, 255, 0.1)',
            ...options
        };
        
        this.particles = [];
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.container.style.position = 'relative';
        this.container.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.speed,
                vy: (Math.random() - 0.5) * this.options.speed,
                size: Math.random() * this.options.particleSize + 1
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.options.color;
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    LQAA.init();
    
    // Add particle effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleSystem(heroSection, {
            particleCount: 30,
            particleSize: 1.5,
            speed: 0.3,
            color: 'rgba(255, 255, 255, 0.08)'
        });
    }
});

// Export for external use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LQAA;
}