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
    // https://github.com/francoismassart/eslint-plugin-tailwindcss
    extends: ["plugin:tailwindcss/recommended"],
    rules: {
      "tailwindcss/no-custom-classname": "off",
    },
  }),
);
