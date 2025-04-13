document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode Toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;
    
    // Check for saved user preference
    const darkMode = localStorage.getItem('darkMode');
    
    // Set initial theme based on saved preference or system preference
    if (darkMode === 'enabled' || (darkMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
    }
    
    darkModeToggle.addEventListener('click', () => {
        // Toggle dark mode
        body.classList.toggle('dark-mode');
        
        // Save user preference
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Header scroll effect
    const header = document.querySelector('header');
    const scrollThreshold = 20;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
            
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Typing effect for the hero section
    const textElement = document.getElementById('typing-text');
    
    if (textElement) {
        // Use your multilingual phrases
        const phrases = [
            "Hey there! I'm Saisankalp!",
            "வணக்கம்! என் பெயர் சாய்சங்கல்ப்",
            "नमस्ते! मैं साईसंकल्प हूं।",
            "നമസ്കാരം! ഞാൻ സൈസങ്കൽപ് ആണ്.",
            "నా పేరు సాయిసంకల్పం.",
            "Hallo! Ich bin Saisankalp!"
        ];
        
        let phraseIndex = 0;
        let letterIndex = 0;
        let currentPhrase = '';
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentText = phrases[phraseIndex];
            
            if (isDeleting) {
                currentPhrase = currentText.substring(0, letterIndex - 1);
                letterIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                currentPhrase = currentText.substring(0, letterIndex + 1);
                letterIndex++;
                typingSpeed = 75; // Normal speed when typing
            }
            
            textElement.textContent = currentPhrase;
            
            // When we've typed the complete phrase
            if (!isDeleting && letterIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1000; // Pause at the end of phrase
            } 
            // When we've deleted the entire phrase
            else if (isDeleting && letterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before typing next phrase
            }
            
            setTimeout(typeEffect, typingSpeed);
        }

        // Start the typing effect
        typeEffect();
    }
    
    // Image gallery lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length > 0 && lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxCaption = document.querySelector('.lightbox-caption');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const fullImageSrc = item.getAttribute('data-full');
                const imgAlt = item.querySelector('img').getAttribute('alt');
                
                lightboxImg.src = fullImageSrc;
                lightboxCaption.textContent = imgAlt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
            });
        });
        
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }
        });
        
        // Escape key to close lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }
        });
    }
    
    // Timeline items (formerly testimonials)
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    if (testimonials.length > 0 && dots.length > 0) {
        let currentSlide = 0;
        
        // Hide all testimonials except the first one
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // Show the selected testimonial
        function showSlide(index) {
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'none';
            });
            
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            testimonials[index].style.display = 'block';
            dots[index].classList.add('active');
        }
        
        // Next testimonial
        function nextSlide() {
            currentSlide++;
            if (currentSlide >= testimonials.length) {
                currentSlide = 0;
            }
            showSlide(currentSlide);
        }
        
        // Previous testimonial
        function prevSlide() {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = testimonials.length - 1;
            }
            showSlide(currentSlide);
        }
        
        // Click events for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Click events for prev/next buttons
        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // Auto-slide (optional)
        const autoSlide = setInterval(nextSlide, 5000);
        
        // Pause auto-slide on hover
        const sliderContainer = document.querySelector('.testimonial-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlide);
            });
        }
    }
    
    // Form input animation
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        // Check if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('active');
        }
        
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('active');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('active');
            }
        });
    });
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Form validation would go here
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                alert('Your message has been sent successfully!');
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Animation for skills on scroll
    const skillLevels = document.querySelectorAll('.skill-level');
    
    if (skillLevels.length > 0) {
        const animateSkills = () => {
            skillLevels.forEach(level => {
                const skillSection = document.querySelector('#qualifications');
                if (skillSection) {
                    const sectionPosition = skillSection.getBoundingClientRect().top;
                    const screenPosition = window.innerHeight / 1.3;
                    
                    if (sectionPosition < screenPosition) {
                        level.style.width = level.getAttribute('style').split(':')[1];
                    } else {
                        level.style.width = '0';
                    }
                }
            });
        };
        
        // Ensure timeline and skills animations run on scroll
        window.addEventListener('scroll', () => {
            animateSkills();
        });
        
        // Run once on page load
        animateSkills();
    }
    
    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .section-header, .testimonial, .contact-form, .qualification-item, .timeline-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    const elementsToAnimate = document.querySelectorAll('.feature-card, .section-header, .testimonial, .contact-form, .qualification-item, .timeline-item');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Slideshow functionality
    let slideIndex = 1;

    // Initialize slideshow on page load
    showSlides(slideIndex);
    // Auto advance slides every 4 seconds
    setInterval(function() {
        plusSlides(1);
    }, 4000);
});

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slides");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active-dot", "");
    }
    
    // Show the current slide and activate corresponding dot
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active-dot";
    
    // Make sure lightbox functionality works with the slideshow
    const slideImages = document.querySelectorAll('.slides img');
    slideImages.forEach(img => {
        img.addEventListener('click', function() {
            showLightbox(this.getAttribute('data-full'), this.alt);
        });
    });
}