// Dynamic slide generation based on images
let slides = [];
let totalSlides = 0;
let currentSlide = 0;
let isScrolling = false;
let scrollCooldown = 1000; // Cooldown period in milliseconds

// Load images dynamically and create slides
async function initializeSlides() {
    const container = document.getElementById('slidesContainer');
    const imageFiles = [];
    let imageIndex = 1;
    
    // Check for images by trying to load them sequentially
    while (imageIndex <= 100) { // Check up to 100 images max
        const imagePath = `images/image-${imageIndex}.jpg`;
        const imageExists = await checkImageExists(imagePath);
        if (imageExists) {
            imageFiles.push(imagePath);
            imageIndex++;
        } else {
            break;
        }
    }
    
    // Create slides dynamically
    imageFiles.forEach((imagePath, index) => {
        const slideNum = index + 1;
        const slide = document.createElement('section');
        slide.classList.add('slide');
        slide.setAttribute('data-slide', slideNum);
        
        if (index === 0) {
            slide.classList.add('active');
        }
        
        if (index === imageFiles.length - 1) {
            slide.classList.add('last-slide');
        }
        
        slide.innerHTML = `
            <img src="${imagePath}" alt="Slide Image ${slideNum}" class="fullscreen-image">
            ${index === imageFiles.length - 1 ? '<footer class="end-footer"><p>End of presentation</p></footer>' : ''}
        `;
        
        container.appendChild(slide);
    });
    
    // Get all created slides
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    // Initialize navigation
    initNavDots();
    addEventListeners();
}

// Check if an image exists by attempting to load it
function checkImageExists(imagePath) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
            // Silently fail - don't log 404 errors
            resolve(false);
        };
        img.src = imagePath;
    });
}

// Initialize navigation dots
function initNavDots() {
    const navDots = document.getElementById('navDots');
    navDots.innerHTML = ''; // Clear existing dots
    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('nav-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        navDots.appendChild(dot);
    });
}

// Update navigation dots
function updateNavDots() {
    const dots = document.querySelectorAll('.nav-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Go to specific slide
function goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= totalSlides || slideIndex === currentSlide) {
        return;
    }
    
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    
    // Update navigation dots
    updateNavDots();
    
    // Re-trigger footer animation if it's the last slide
    if (currentSlide === totalSlides - 1) {
        const footer = document.querySelector('.end-footer');
        if (footer) {
            footer.style.animation = 'none';
            setTimeout(() => {
                footer.style.animation = 'slideUpFooter 1s ease 0.5s forwards';
            }, 10);
        }
    }
}

// Handle wheel scroll
function handleScroll(event) {
    if (isScrolling) return;
    
    const delta = Math.sign(event.deltaY);
    
    if (delta > 0 && currentSlide < totalSlides - 1) {
        // Scroll down - go to next slide
        isScrolling = true;
        goToSlide(currentSlide + 1);
        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    } else if (delta < 0 && currentSlide > 0) {
        // Scroll up - go to previous slide
        isScrolling = true;
        goToSlide(currentSlide - 1);
        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    } else if (delta > 0 && currentSlide === totalSlides - 1) {
        // At last slide, trying to scroll down - do nothing (stay on last page)
        event.preventDefault();
    }
}

// Handle touch events for mobile
let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    touchEndY = event.touches[0].clientY;
}

function handleTouchEnd() {
    if (isScrolling) return;
    
    const swipeDistance = touchStartY - touchEndY;
    const minSwipeDistance = 50; // Minimum swipe distance to trigger slide change
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0 && currentSlide < totalSlides - 1) {
            // Swipe up - go to next slide
            isScrolling = true;
            goToSlide(currentSlide + 1);
            setTimeout(() => {
                isScrolling = false;
            }, scrollCooldown);
        } else if (swipeDistance < 0 && currentSlide > 0) {
            // Swipe down - go to previous slide
            isScrolling = true;
            goToSlide(currentSlide - 1);
            setTimeout(() => {
                isScrolling = false;
            }, scrollCooldown);
        }
    }
}

// Handle keyboard navigation
function handleKeyboard(event) {
    if (isScrolling) return;
    
    if ((event.key === 'ArrowDown' || event.key === 'PageDown') && currentSlide < totalSlides - 1) {
        isScrolling = true;
        goToSlide(currentSlide + 1);
        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    } else if ((event.key === 'ArrowUp' || event.key === 'PageUp') && currentSlide > 0) {
        isScrolling = true;
        goToSlide(currentSlide - 1);
        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    } else if (event.key === 'Home') {
        isScrolling = true;
        goToSlide(0);
        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    } else if (event.key === 'End') {
        isScrolling = true;
        goToSlide(totalSlides - 1);
        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    }
}

// Add event listeners
function addEventListeners() {
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyboard);
    document.body.style.overflow = 'hidden';
}

// Request fullscreen on user interaction (first click or key press)
function enableFullscreenOnInteraction() {
    const triggerFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => {
                console.log(`Fullscreen request denied: ${err.message}`);
            });
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        // Remove listeners after first interaction
        document.removeEventListener('click', triggerFullscreen);
        document.removeEventListener('keydown', triggerFullscreen);
    };
    
    document.addEventListener('click', triggerFullscreen, { once: true });
    document.addEventListener('keydown', triggerFullscreen, { once: true });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeSlides();
    enableFullscreenOnInteraction();
});
