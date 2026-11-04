// Mobel - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuLabels = document.documentElement.lang === 'ka'
        ? { open: 'ნავიგაციის მენიუს გახსნა', close: 'ნავიგაციის მენიუს დახურვა' }
        : { open: 'Open navigation menu', close: 'Close navigation menu' };

    function closeNavigation() {
        if (!menuToggle || !navMenu) return;
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', menuLabels.open);
        navMenu.classList.remove('active');
    }
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.classList.toggle('active', !isExpanded);
            navMenu.classList.toggle('active', !isExpanded);
            menuToggle.setAttribute('aria-expanded', String(!isExpanded));
            menuToggle.setAttribute('aria-label', isExpanded ? menuLabels.open : menuLabels.close);
        });
    }

    // Language switcher toggle
    const langSwitcher = document.querySelector('.lang-switcher');
    if (langSwitcher) {
        const langButton = langSwitcher.querySelector('.lang-btn');
        langSwitcher.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = langButton.getAttribute('aria-expanded') === 'true';
            this.classList.toggle('active', !isExpanded);
            langButton.setAttribute('aria-expanded', String(!isExpanded));
        });
        
        // Close on outside click
        document.addEventListener('click', function() {
            langSwitcher.classList.remove('active');
            langButton.setAttribute('aria-expanded', 'false');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                        ? 'auto'
                        : 'smooth'
                });
                // Close mobile menu if open
                closeNavigation();
            }
        });
    });

    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            count++;
            cartCount.textContent = count;
            
            // Add animation
            this.textContent = 'Added!';
            this.style.background = 'var(--secondary-color)';
            this.style.color = 'var(--white)';
            this.style.borderColor = 'var(--secondary-color)';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.background = '';
                this.style.color = '';
                this.style.borderColor = '';
            }, 1500);
        });
    });

    // Search button functionality (placeholder)
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Search functionality coming soon!');
        });
    }

    // Cart button functionality (placeholder)
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Cart page coming soon!');
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            if (input.value) {
                alert('Thank you for subscribing!');
                input.value = '';
            }
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Product card hover effect enhancement
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '1';
        });
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '';
        });
    });

    // Product image fullscreen overlay
    const imageOverlay = document.querySelector('.image-overlay');
    const overlayImage = imageOverlay ? imageOverlay.querySelector('img') : null;
    const overlayClose = imageOverlay ? imageOverlay.querySelector('.overlay-close') : null;
    const productImages = document.querySelectorAll('.product-image img');
    const zoomLabel = document.documentElement.lang === 'ka'
        ? 'სურათის გადიდება: '
        : 'View larger image: ';
    let lastFocusedImage = null;

    function closeImageOverlay() {
        if (!imageOverlay || !overlayImage) return;
        imageOverlay.classList.remove('open');
        imageOverlay.setAttribute('aria-hidden', 'true');
        overlayImage.removeAttribute('src');
        document.body.style.overflow = '';
        if (lastFocusedImage) lastFocusedImage.focus();
    }

    productImages.forEach(img => {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `${zoomLabel}${img.alt}`);

        function openImage() {
            if (!imageOverlay || !overlayImage) return;
            lastFocusedImage = img;
            overlayImage.src = img.currentSrc || img.src;
            overlayImage.alt = img.alt;
            imageOverlay.setAttribute('aria-hidden', 'false');
            imageOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (overlayClose) overlayClose.focus();
        }

        img.addEventListener('click', function() {
            openImage();
        });

        img.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openImage();
            }
        });
    });

    if (imageOverlay) {
        imageOverlay.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('overlay-close')) {
                closeImageOverlay();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && imageOverlay && imageOverlay.classList.contains('open')) {
            e.preventDefault();
            if (overlayClose) overlayClose.focus();
            return;
        }

        if (e.key === 'Escape') {
            if (imageOverlay && imageOverlay.classList.contains('open')) {
                closeImageOverlay();
            }
            if (langSwitcher) {
                langSwitcher.classList.remove('active');
                langSwitcher.querySelector('.lang-btn').setAttribute('aria-expanded', 'false');
            }
            closeNavigation();
        }
    });
});