"use strict";

const THEME_STORAGE_KEY = "theme";
const FORM_ENDPOINT =
    "https://getform.io/f/75f08d80-b90d-429b-bbed-d5b267545e96";

// Cache DOM elements
const elements = {
    form: document.getElementById("contact-form"),
    themeStyle: document.getElementById("theme-style"),
    themeDots: document.getElementsByClassName("theme-dot"),
    floatingEye: document.querySelector(".floating-eye .pupil"),
};

// Theme configuration
const themeConfig = {
    light: "default.css",
    blue: "blue.css",
    purple: "purple.css",
    green: "green.css",
};

// Initialize theme
function initializeTheme() {
    try {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "light";
        setTheme(savedTheme);
    } catch (error) {
        console.error("Error initializing theme:", error);
        setTheme("light"); // Fallback to light theme
    }
}

// Theme handling
function setTheme(mode) {
    try {
        if (!themeConfig[mode]) {
            throw new Error(`Invalid theme mode: ${mode}`);
        }
        elements.themeStyle.href = themeConfig[mode];
        localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
        console.error("Error setting theme:", error);
    }
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Form submission handler
async function handleFormSubmit(e) {
    e.preventDefault();
    const button = e.target.querySelector("button");
    const buttonText = button.querySelector("p");
    const formData = new FormData(e.target);

    // Early validation
    if (!validateForm(formData)) {
        return;
    }

    try {
        button.disabled = true;
        buttonText.textContent = "Sending..."; // Show sending state

        const response = await fetch(FORM_ENDPOINT, {
            method: "POST",
            body: formData,
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Form submission failed: ${response.status}`);
        }

        // Success handling
        e.target.reset();
        buttonText.textContent = "Sent!";
        button.classList.add("clicked");
        showNotification("Message sent successfully!", "success");

        // Reset button after delay
        setTimeout(() => {
            button.classList.remove("clicked");
            buttonText.textContent = "Send";
        }, 2000);
    } catch (error) {
        console.error("Form submission error:", error);
        buttonText.textContent = "Send"; // Reset text on error
        showNotification("Failed to send message. Please try again.", "error");
    } finally {
        button.disabled = false;
    }
}

// Form validation
function validateForm(formData) {
    const email = formData.get("email");
    const message = formData.get("message");

    if (!email || !message) {
        alert("Please fill in all required fields");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return false;
    }

    return true;
}

// Form submission
async function submitForm(formData) {
    return await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json",
        },
    });
}

// Success handler
function handleFormSuccess(form, button) {
    form.reset();
    button.classList.add("clicked");
    setTimeout(() => button.classList.remove("clicked"), 2000);
    showNotification("Message sent successfully!", "success");
}

// Error handler
function handleFormError(error) {
    console.error("Form submission error:", error);
    showNotification("Failed to send message. Please try again.", "error");
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Initialize theme
    initializeTheme();

    // Add theme switcher listeners
    Array.from(elements.themeDots).forEach((dot) => {
        dot.addEventListener("click", () => setTheme(dot.dataset.mode));
    });

    // Add form submission listener with simpler approach
    elements.form?.addEventListener("submit", handleFormSubmit);

    // Add mouse move listener for floating eye
    document.addEventListener("mousemove", (e) => {
        const eye = elements.floatingEye;
        const eyeRect = eye.getBoundingClientRect();
        const eyeX = eyeRect.left + eyeRect.width / 2;
        const eyeY = eyeRect.top + eyeRect.height / 2;
        const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
        const distance = Math.min(
            eyeRect.width / 4,
            Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 10
        );
        eye.style.transform = `translate(${distance * Math.cos(angle)}px, ${
            distance * Math.sin(angle)
        }px)`;
    });
});

// Add CSS for notifications
const style = document.createElement("style");
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    .notification.success { background-color: #4CAF50; }
    .notification.error { background-color: #f44336; }
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
