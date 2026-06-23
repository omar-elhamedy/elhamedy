/* الحامدى للخردوات — interactions
   No dependencies. Mobile menu, scroll reveal, scroll-spy, header state, WhatsApp form. */
(function () {
    "use strict";

    var WHATSAPP_NUMBER = "201006234058";

    /* ---------- Mobile menu ---------- */
    var toggle = document.getElementById("menu-toggle");
    var nav = document.getElementById("nav");

    function closeMenu() {
        if (!nav || !toggle) return;
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "فتح القائمة");
    }

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var isOpen = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            toggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
        });

        nav.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeMenu();
        });
    }

    /* ---------- Header shadow on scroll ---------- */
    var header = document.querySelector(".site-header");
    if (header) {
        var onScroll = function () {
            header.classList.toggle("scrolled", window.scrollY > 8);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    /* ---------- Scroll-spy: highlight active nav link ---------- */
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".nav-link");
    if ("IntersectionObserver" in window && sections.length && navLinks.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                navLinks.forEach(function (link) {
                    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
                });
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

        sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- WhatsApp contact form ---------- */
    var form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var name = form.querySelector("#name");
            var phone = form.querySelector("#phone");
            var message = form.querySelector("#message");
            var valid = true;

            if (!name.value.trim()) {
                name.classList.add("invalid");
                valid = false;
            } else {
                name.classList.remove("invalid");
            }

            // Phone: keep digits only, require a plausible length (mobile/landline).
            var phoneDigits = phone.value.replace(/\D/g, "");
            if (phoneDigits.length < 8) {
                phone.classList.add("invalid");
                valid = false;
            } else {
                phone.classList.remove("invalid");
            }

            if (!valid) {
                form.querySelector(".invalid").focus();
                return;
            }

            var lines = [
                "مرحبًا، أنا " + name.value.trim(),
                "رقم الهاتف: " + phone.value.trim()
            ];
            if (message.value.trim()) {
                lines.push("الرسالة: " + message.value.trim());
            }

            var text = encodeURIComponent(lines.join("\n"));
            window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text, "_blank", "noopener");
        });

        form.querySelectorAll("input, textarea").forEach(function (field) {
            field.addEventListener("input", function () {
                field.classList.remove("invalid");
            });
        });
    }

    /* ---------- Footer year ---------- */
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
})();
