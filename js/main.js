// Mobel - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll functionality
    const header = document.querySelector('.header');
    const headerTop = document.querySelector('.header-top');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Hide header on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        // Hide header-top on scroll
        if (currentScroll > 100) {
            headerTop.classList.add('hidden');
        } else {
            headerTop.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Language switcher toggle
    const langSwitcher = document.querySelector('.lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
        
        // Close on outside click
        document.addEventListener('click', function() {
            langSwitcher.classList.remove('active');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
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
    const productImages = document.querySelectorAll('.product-image img');

    productImages.forEach(img => {
        img.addEventListener('click', function() {
            if (!imageOverlay || !overlayImage) return;
            overlayImage.src = this.src;
            overlayImage.alt = this.alt || 'Product Image';
            imageOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    if (imageOverlay) {
        imageOverlay.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('overlay-close')) {
                imageOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageOverlay && imageOverlay.classList.contains('open')) {
            imageOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
});