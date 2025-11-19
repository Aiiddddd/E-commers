// Wishlist functionality
document.addEventListener('DOMContentLoaded', function() {
    // Wishlist buttons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            // Simple animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Add to cart buttons
    const addCartButtons = document.querySelectorAll('.add-cart-btn');
    
    addCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Show alert (you can replace this with a better notification)
            const originalText = this.innerHTML;
            this.innerHTML = '✓ Ditambahkan';
            this.style.background = '#10b981';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '#000';
            }, 2000);
            
            // Update cart count
            const cartBadge = document.querySelector('.cart-btn .badge');
            if (cartBadge) {
                const currentCount = parseInt(cartBadge.textContent);
                cartBadge.textContent = currentCount + 1;
                
                // Animate badge
                cartBadge.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    cartBadge.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
    
    // Mobile menu toggle (placeholder - you can expand this)
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            alert('Menu mobile akan ditampilkan di sini');
        });
    }
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Search functionality (basic)
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = this.value;
                if (searchTerm.trim()) {
                    alert('Mencari: ' + searchTerm);
                    // Here you would implement actual search functionality
                }
            }
        });
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('.email-input');
        const submitBtn = newsletterForm.querySelector('.btn');
        
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = emailInput.value;
            
            if (email && email.includes('@')) {
                alert('Terima kasih! Email ' + email + ' berhasil didaftarkan.');
                emailInput.value = '';
            } else {
                alert('Mohon masukkan email yang valid.');
            }
        });
    }
    
    // Footer newsletter form
    const footerForm = document.querySelector('.footer-form');
    if (footerForm) {
        const footerEmailInput = footerForm.querySelector('input[type="email"]');
        const footerSubmitBtn = footerForm.querySelector('.btn');
        
        footerSubmitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = footerEmailInput.value;
            
            if (email && email.includes('@')) {
                alert('Terima kasih! Email ' + email + ' berhasil didaftarkan.');
                footerEmailInput.value = '';
            } else {
                alert('Mohon masukkan email yang valid.');
            }
        });
    }
    
    // Product card click (navigate to product detail - placeholder)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on button
            if (!e.target.closest('button')) {
                console.log('Product card clicked - would navigate to product detail page');
            }
        });
    });
    
    // Category card click
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            console.log('Category clicked:', categoryName);
        });
    });
    
    // Sticky navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
});
