document.addEventListener("DOMContentLoaded", (event) => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-md', 'bg-sand-100/90');
            navbar.classList.remove('bg-sand-100/80');
        } else {
            navbar.classList.remove('shadow-md', 'bg-sand-100/90');
            navbar.classList.add('bg-sand-100/80');
        }
    });

    // Reveal Elements on Scroll with advanced, satisfying physics
    const revealElements = document.querySelectorAll('.gs-reveal');

    revealElements.forEach((elem) => {
        // Find if element has an image to add a subtle scale effect
        const img = elem.querySelector('img');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Trigger when top of element hits 85% of viewport
                toggleActions: "play none none reverse"
            }
        });

        tl.fromTo(elem,
            { y: 60, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.4,
                ease: "power4.out",
            }
        );

        // If there's an image inside, give it a beautiful zoom-out reveal
        if (img) {
            tl.fromTo(img,
                { scale: 1.15 },
                { scale: 1, duration: 1.8, ease: "power2.out" },
                "-=1.4" // Start at the same time
            );
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');

            // Adjust icon
            if (mobileMenu.classList.contains('hidden')) {
                mobileBtn.innerHTML = '<i data-feather="menu"></i>';
            } else {
                mobileBtn.innerHTML = '<i data-feather="x"></i>';
            }
            feather.replace();
        });

        // Close menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileBtn.innerHTML = '<i data-feather="menu"></i>';
                feather.replace();
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Fluid Letter Hover Animation (Desktop Only)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        // Target main text elements to add the playful letter interaction
        const textElements = document.querySelectorAll('main h1, main h2, main h3');

        textElements.forEach(el => {
            // Check if element has text nodes to split. Avoid already structured or complex interactive elements like cards if they glitch, but standard text is fine.
            Array.from(el.childNodes).forEach(node => {
                // Process only raw text nodes that have visible characters
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    const words = node.textContent.split(/(\s+)/);
                    const fragment = document.createDocumentFragment();

                    words.forEach(word => {
                        if (word.trim() === '') {
                            // Keep whitespaces intact
                            fragment.appendChild(document.createTextNode(word));
                        } else {
                            // Wrap words to prevent them from breaking halfway to the next line
                            const wordSpan = document.createElement('span');
                            wordSpan.style.display = 'inline-block';
                            wordSpan.style.whiteSpace = 'nowrap';

                            // Wrap each character individually
                            for (let i = 0; i < word.length; i++) {
                                const charSpan = document.createElement('span');
                                charSpan.className = 'hover-char';
                                charSpan.textContent = word[i];
                                wordSpan.appendChild(charSpan);
                            }
                            fragment.appendChild(wordSpan);
                        }
                    });

                    node.parentNode.replaceChild(fragment, node);
                }
            });
        });
    }
});
