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

// --- Modal Questionnaire Logic ---

window.openSymptomModal = function () {
    const modal = document.getElementById('symptom-modal');
    const modalContent = document.getElementById('symptom-modal-content');
    modal.classList.remove('hidden');
    // small timeout to allow display:block to apply before animating opacity/transform
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);
    document.body.style.overflow = 'hidden'; // prevent background scrolling

    // Reset to step 1
    nextStep(1);

    // Reset form errors and fields on open if desired, but 
    // keeping previous answers might be nice too.
};

window.closeSymptomModal = function () {
    const modal = document.getElementById('symptom-modal');
    const modalContent = document.getElementById('symptom-modal-content');
    modal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // match transition duration
    document.body.style.overflow = '';
};

window.nextStep = function (step) {
    const steps = [1, 2, 3, 4, 5, 6, 7];
    const nextStepDiv = document.getElementById(`modal-step-${step}`);

    // Find currently visible step
    let currentStepDiv = null;
    steps.forEach(s => {
        const div = document.getElementById(`modal-step-${s}`);
        if (div && !div.classList.contains('hidden') && s !== step) {
            currentStepDiv = div;
        }
    });

    if (currentStepDiv) {
        // Animate out current step
        gsap.to(currentStepDiv, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                currentStepDiv.classList.add('hidden');
                showNext();
            }
        });
    } else {
        showNext();
    }

    function showNext() {
        // Reset properties before showing
        gsap.set(nextStepDiv, { opacity: 0, y: 20 });
        nextStepDiv.classList.remove('hidden');

        gsap.to(nextStepDiv, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        });

        // Scroll modal to top smoothly
        if (step > 1) {
            const modalContent = document.getElementById('symptom-modal-content');
            modalContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

window.validateStep2 = function () {
    const q1Checked = document.querySelectorAll('input[name="q1"]:checked');
    const q1Other = document.querySelector('input[name="q1_other"]').value;
    if (q1Checked.length === 0 && q1Other.trim() === '') {
        document.getElementById('q1-error').classList.remove('hidden');
    } else {
        document.getElementById('q1-error').classList.add('hidden');
        nextStep(3);
    }
};

window.validateStep3 = function () {
    const q2Checked = document.querySelector('input[name="q2"]:checked');
    if (!q2Checked) {
        document.getElementById('q2-error').classList.remove('hidden');
    } else {
        document.getElementById('q2-error').classList.add('hidden');
        nextStep(4);
    }
};

window.validateStep4 = function () {
    // Slider always has a value, proceed
    nextStep(5);
};

window.validateStep5 = function () {
    const q4Checked = document.querySelector('input[name="q4"]:checked');
    if (!q4Checked) {
        document.getElementById('q4-error').classList.remove('hidden');
    } else {
        document.getElementById('q4-error').classList.add('hidden');
        nextStep(6);
    }
};

window.submitForm = function () {
    // Validate final contact info step
    let isValid = true;
    let firstErrorElement = null;

    // Q1
    const q1Checked = document.querySelectorAll('input[name="q1"]:checked');
    const q1Other = document.querySelector('input[name="q1_other"]').value;
    if (q1Checked.length === 0 && q1Other.trim() === '') {
        document.getElementById('q1-error').classList.remove('hidden');
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('q1-error');
    } else {
        document.getElementById('q1-error').classList.add('hidden');
    }

    // Q2
    const q2Checked = document.querySelector('input[name="q2"]:checked');
    if (!q2Checked) {
        document.getElementById('q2-error').classList.remove('hidden');
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('q2-error');
    } else {
        document.getElementById('q2-error').classList.add('hidden');
    }

    // Q4
    const q4Checked = document.querySelector('input[name="q4"]:checked');
    if (!q4Checked) {
        document.getElementById('q4-error').classList.remove('hidden');
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('q4-error');
    } else {
        document.getElementById('q4-error').classList.add('hidden');
    }

    // Name
    const name = document.getElementById('user-name').value;
    if (name.trim() === '') {
        document.getElementById('name-error').classList.remove('hidden');
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('name-error');
    } else {
        document.getElementById('name-error').classList.add('hidden');
    }

    // Phone
    const phone = document.getElementById('user-phone').value;
    if (phone.trim() === '') {
        document.getElementById('phone-error').classList.remove('hidden');
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('phone-error');
    } else {
        document.getElementById('phone-error').classList.add('hidden');
    }

    // Time
    const timeChecked = document.querySelector('input[name="q_time"]:checked');
    if (!timeChecked) {
        document.getElementById('time-error').classList.remove('hidden');
        isValid = false;
        if (!firstErrorElement) firstErrorElement = document.getElementById('time-error');
    } else {
        document.getElementById('time-error').classList.add('hidden');
    }

    if (isValid) {
        nextStep(7);
    } else {
        // Scroll to the first error
        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};

window.sendToWhatsApp = function () {
    // Collect data
    let q1Answers = Array.from(document.querySelectorAll('input[name="q1"]:checked')).map(el => el.value);
    const q1Other = document.querySelector('input[name="q1_other"]').value;
    if (q1Other.trim() !== '') {
        q1Answers.push(q1Other.trim());
    }
    const q1String = q1Answers.join(', ');

    const q2 = document.querySelector('input[name="q2"]:checked').value;
    const q3 = document.querySelector('input[name="q3"]').value;
    const q4 = document.querySelector('input[name="q4"]:checked').value;

    const name = document.getElementById('user-name').value.trim();
    // Use the contact phone as info for Dra Kerly if needed, but we don't strictly print it in the requested message. We will just send to Dra Kerly's number.
    const time = document.querySelector('input[name="q_time"]:checked').value;

    const message = `Olá, Dra. Kerly.
Acabei de responder o questionário do site.

Meu nome: ${name}

Principais sintomas:
${q1String}

Tempo dos sintomas:
${q2}

Impacto na qualidade de vida:
${q3}/10

O que gostaria de melhorar primeiro:
${q4}

Melhor horário para conversar:
${time}

Gostaria de entender melhor como a consulta pode me ajudar.`;

    const encodedMessage = encodeURIComponent(message);
    const targetPhone = "5598981532153"; // Dra. Kerly's phone number as provided in existing links
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    closeSymptomModal();
};

window.toggleFloatingMenu = function () {
    const menu = document.getElementById('floating-menu');
    const icon = document.getElementById('floating-btn-icon');

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        setTimeout(() => {
            menu.classList.remove('opacity-0');
            menu.classList.add('opacity-100');
        }, 10);
        icon.setAttribute('data-feather', 'x');
        feather.replace();
    } else {
        menu.classList.remove('opacity-100');
        menu.classList.add('opacity-0');
        setTimeout(() => {
            menu.classList.add('hidden');
        }, 300);
        icon.setAttribute('data-feather', 'message-circle');
        feather.replace();
    }
};

// Close floating menu when clicking outside
document.addEventListener('click', (event) => {
    const menu = document.getElementById('floating-menu');
    const btn = document.getElementById('floating-main-btn');
    if (menu && btn && !menu.classList.contains('hidden')) {
        if (!menu.contains(event.target) && !btn.contains(event.target)) {
            window.toggleFloatingMenu();
        }
    }
});
