import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

export const TawkToWidget = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if current route is a dashboard route (investors, partners, or dashboard)
    const isDashboardRoute =
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/investors") ||
      location.pathname.startsWith("/partners");

    // Only load tawk.to if NOT on a dashboard route
    if (!isDashboardRoute) {
      // Check if Tawk.to is already loaded
      if (!(window as any).Tawk_API) {
        // Initialize Tawk.to
        (window as any).Tawk_API = (window as any).Tawk_API || {};
        (window as any).Tawk_LoadStart = new Date();

        // Create and inject the script
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://embed.tawk.to/697d04113f2d341c3dff4d32/1jg85fpsn";
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");

        const firstScript = document.getElementsByTagName("script")[0];
        firstScript.parentNode?.insertBefore(script, firstScript);
      } else {
        // If Tawk.to is already loaded, just show it
        if ((window as any).Tawk_API?.showWidget) {
          (window as any).Tawk_API.showWidget();
        }
      }
    } else {
      // Hide the widget on dashboard routes
      if ((window as any).Tawk_API?.hideWidget) {
        (window as any).Tawk_API.hideWidget();
      }
    }

    // Cleanup function
    return () => {
      // We don't remove the script entirely, just hide the widget if needed
      // This prevents issues with re-initialization
    };
  }, [location.pathname]);

  return null; // This component doesn't render anything
};
