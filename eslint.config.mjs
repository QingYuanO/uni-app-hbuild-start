import { FlatCompat } from "@eslint/eslintrc";
import uni from "@uni-helper/eslint-config";

const compat = new FlatCompat();
export default uni(

  {
    stylistic: {
      quotes: "double",
      semi: true,
    },
    rules: {
      "no-console": "off",
      "eslint-comments/no-unlimited-disable": "off",
      "n/prefer-global/process": "off",
      "unused-imports/no-unused-vars": "off",
      "regexp/no-unused-capturing-group": "off",

    },

  },
  ...compat.config({
    plugins: ["tailwindcss"],
    // https://github.com/francoismassart/eslint-plugin-tailwindcss
    extends: ["plugin:tailwindcss/recommended"],
    settings: {
      tailwindcss: {
        callees: ["classnames", "clsx", "cn"],
        config: `${import.meta.dirname}/styles/tailwind.css`,
        cssFiles: [
          "**/*.css",
          "!**/node_modules",
          "!**/.*",
          "!**/dist",
          "!**/build",
        ],
        cssFilesRefreshRate: 5_000,
        removeDuplicates: true,
        skipClassAttribute: false,
        whitelist: [],
        tags: [],
        classRegex: "[A-Za-z]?[A-Za-z-]*[Cc]lass",
      },
    },
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  }),

);
