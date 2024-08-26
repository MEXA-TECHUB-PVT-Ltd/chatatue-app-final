import { resetNavigation } from "./resetNavigation";

export const createDelayedNavigation = (navigation, screen, delay = 3000, params = {}) => {
    return () => {
        const timer = setTimeout(() => {
            resetNavigation(navigation, screen, params);
        }, delay);
        return () => clearTimeout(timer);
    };
};