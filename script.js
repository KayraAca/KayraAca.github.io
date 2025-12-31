// Typewriter Effect
const typewriter = document.getElementById('typewriter');
const phrases = [
    'Backend Developer',
    'Cryptography Student', 
    'Security Enthusiast',
    'System Builder'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriter.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriter.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Small pause before starting next phrase
    }

    setTimeout(type, typeSpeed);
}

// Create floating particles
function createParticles() {
    const particles = document.createElement('div');
    particles.className = 'particles';
    document.body.appendChild(particles);

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particles.appendChild(particle);
    }
}

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -10% 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            
            // Add animated class to trigger animations
            if (target.classList.contains('about-content')) {
                target.classList.add('animated');
            }
            
            if (target.classList.contains('skills-grid')) {
                const skillItems = target.querySelectorAll('.skill-item');
                skillItems.forEach(item => {
                    item.classList.add('animated');
                });
            }
            
            if (target.classList.contains('row') && target.closest('#projects')) {
                const projectCards = target.querySelectorAll('.project-card');
                projectCards.forEach(card => {
                    card.classList.add('animated');
                });
            }
            
            if (target.classList.contains('contact-form')) {
                target.classList.add('animated');
                const socialLinks = document.querySelector('.social-links');
                if (socialLinks) {
                    socialLinks.classList.add('animated');
                }
            }
        }
    });
}, observerOptions);

// Mouse move parallax effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    const codeContainer = document.querySelector('.code-container');
    if (codeContainer) {
        codeContainer.style.transform = `translateY(${mouseY * 20}px) translateX(${mouseX * 20}px) rotateY(${mouseX * 5}deg) rotateX(${-mouseY * 5}deg)`;
    }
    
    // Move particles slightly
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.5;
        particle.style.transform = `translate(${mouseX * speed * 20}px, ${mouseY * speed * 20}px)`;
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Start animations and effects
document.addEventListener('DOMContentLoaded', function() {
    // Start typewriter after delay
    setTimeout(type, 1500);
    
    // Create floating particles
    createParticles();
    
    // Observe elements for scroll animations
    const elementsToObserve = [
        '.about-content',
        '.skills-grid', 
        '#projects .row',
        '.contact-form'
    ];
    
    elementsToObserve.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            observer.observe(element);
        }
    });
    
    // Add stagger animation to code lines
    const codeLines = document.querySelectorAll('.code-content .code-line');
    codeLines.forEach((line, index) => {
        line.style.animationDelay = (1.2 + index * 0.2) + 's';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Active nav links
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (scrollY >= sectionTop) {
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

// Form submission with animation
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Add submit animation
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.style.transform = '';
            this.reset();
        }, 2000);
    }, 1000);
});

// Add hover sound effect (optional)
document.querySelectorAll('.btn, .nav-link, .social-link, .project-card').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});