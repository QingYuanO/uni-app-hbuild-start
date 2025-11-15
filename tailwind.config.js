// import path from "node:path";

const { addDynamicIconSelectors } = require("@iconify/tailwind");
const animate = require("tailwindcss-animate");
const tailwindcssPlugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ["class"],
  // safelist: ["dark"],
  darkMode: ["variant", ":is(.dark &)"],
  plugins: [
    animate,
    addDynamicIconSelectors(),
    require("tailwind-scrollbar")({ preferredStrategy: "pseudoelements", nocompatible: true }),
    require("@tailwindcss/typography"),
    require("tailwindcss-animate"),

    tailwindcssPlugin(({ addUtilities, addVariant, matchUtilities, theme }) => {
      const os = ["ios", "android"];
      os.forEach((t) => {
        addVariant(t, `.${t} &`);
      });

      addVariant("disabled", `&[disabled]`);
      matchUtilities(
        {
          require: value => ({
            "position": "relative",
            "&::before": {
              content: "*",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              [value]: "-24rpx",
              color: "red",
            },
          }),
        },
        { values: { left: "left", right: "right" } },
      );
      matchUtilities(
        {
          safe: (value) => {
            const name = {
              b: "bottom",
              t: "top",
              l: "left",
              r: "right",
            }[value];
            return {
              "padding-bottom": `constant(safe-area-inset-${name})` /* 兼容 IOS<11.2 */,
              "padding-bottom ": `env(safe-area-inset-${name})` /* 兼容 IOS>11.2 */,
            };
          },
        },
        { values: { b: "b", t: "t", l: "l", r: "r" } },
      );
      matchUtilities(
        {
          circular: value => ({
            "width": value,
            "height": value,
            "border-radius": "100%",
          }),
        },
        { values: theme("spacing") },
      );
      addUtilities({
        ".flex-col-center": {
          "display": "flex",
          "align-items": "center",
          "justify-content": "center",
          "flex-direction": "column",
        },
        ".flex-center": {
          "display": "flex",
          "align-items": "center",
          "justify-content": "center",
          "flex-direction": "row",
        },
        ".all-unset": {
          all: "unset",
        },
        ".borurio-panel": {
          "background-color": "white",
          "border-radius": "10px",
          "padding": "10px",
        },
        ".status-bar-height": {
          height: "var(--status-bar-height)",
        },
      });
    }),
  ],
};
