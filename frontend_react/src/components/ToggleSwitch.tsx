//  Returns a toggle switch for changing the theme mode.
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme as setThemePreference } from "../redux/PreferencesSlice";

interface ToggleSwitchProps {
  initialTheme?: "light" | "dark";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  initialTheme = "light",
}) => {
  const [theme, setTheme] = useState(initialTheme);
  const dispatch = useDispatch();

  // Apply the theme to the body element
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    const isDarkMode: boolean = newTheme === "dark";
    setTheme(newTheme);
    dispatch(setThemePreference(isDarkMode));
  };

  return (
    <label className="relative inline-block w-12 h-6">
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <span
        className={`absolute cursor-pointer inset-0 dark:bg-gray-300 bg-indigo-800 rounded-full transition duration-300 ease-in-out`}
      >
        <span
          className={`absolute left-1 top-1 bg-white dark:bg-indigo-800 w-4 h-4 rounded-full transition transform duration-300 ease-in-out ${
            theme === "dark" ? "translate-x-6" : "translate-x-0"
          }`}
        ></span>
      </span>
    </label>
  );
};

export default ToggleSwitch;
