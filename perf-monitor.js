// Performance monitoring utilities
class PerformanceMonitor {
    static init() {
        // Monitor page load time
        window.addEventListener("load", () => {
            setTimeout(() => {
                const timing = performance.getEntriesByType("navigation")[0];
                console.log(
                    "Page Load Time:",
                    timing.loadEventEnd - timing.navigationStart
                );
            }, 0);
        });

        // Monitor interactions
        this.setupInteractionMonitoring();
        this.setupErrorMonitoring();
    }

    static setupInteractionMonitoring() {
        // Monitor form interactions
        document.addEventListener("submit", (e) => {
            if (e.target.id === "contact-form") {
                performance.mark("form-submit-start");
            }
        });

        // Monitor theme changes
        document.querySelectorAll(".theme-dot").forEach((dot) => {
            dot.addEventListener("click", () => {
                performance.mark("theme-change-start");
                // Record theme change timing
                setTimeout(() => {
                    performance.mark("theme-change-end");
                    performance.measure(
                        "theme-change",
                        "theme-change-start",
                        "theme-change-end"
                    );
                }, 300);
            });
        });
    }

    static setupErrorMonitoring() {
        window.addEventListener("error", (event) => {
            console.error("Runtime Error:", {
                message: event.message,
                source: event.filename,
                lineNo: event.lineno,
                columnNo: event.colno,
                error: event.error,
            });
        });

        window.addEventListener("unhandledrejection", (event) => {
            console.error("Unhandled Promise Rejection:", event.reason);
        });
    }

    static logTiming(label, timing) {
        console.log(`${label}: ${timing}ms`);
        // Here you could send this data to your analytics service
    }
}

// Initialize performance monitoring
document.addEventListener("DOMContentLoaded", () => {
    PerformanceMonitor.init();
});
