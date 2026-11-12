
// STARFIELD BACKGROUND
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];
let width = 0;
let height = 0;

function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    stars = Array.from(
        { length: Math.min(180, Math.floor(width / 7)) },
        () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.4 + 0.2,
            alpha: Math.random() * 0.7 + 0.2,
            speed: Math.random() * 0.15 + 0.025,
            twinkle: Math.random() * 0.018 + 0.003
        })
    );
}

function animateStars() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
        star.alpha += star.twinkle;

        if (star.alpha >= 1 || star.alpha <= 0.2) {
            star.twinkle *= -1;
        }

        star.y -= star.speed;

        if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 214, 255, ${star.alpha})`;
        ctx.shadowBlur = 9;
        ctx.shadowColor = "rgba(174, 139, 255, 0.8)";
        ctx.fill();
    });

    requestAnimationFrame(animateStars);
}

resizeCanvas();
animateStars();

window.addEventListener("resize", resizeCanvas);


// SCROLL REVEAL ANIMATIONS
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach(element => observer.observe(element));


// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-link, .nav-contact").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// ACTIVE NAVIGATION LINK
const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let currentSection = "home";

    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 180) {
            currentSection = section.id;
        }
    });

    navigationLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentSection}`
        );
    });
});


// AUTOMATIC FOOTER YEAR
document.getElementById("year").textContent = new Date().getFullYear();
