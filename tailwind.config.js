const tailwindcssPlugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ["class"],
  // safelist: ["dark"],
  darkMode: ["variant", ":is(.dark &)"],
  plugins: [
    require("tailwind-scrollbar")({ preferredStrategy: "pseudoelements", nocompatible: true }),
    tailwindcssPlugin(({ addVariant, matchUtilities, theme }) => {
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
    }),
  ],
};
