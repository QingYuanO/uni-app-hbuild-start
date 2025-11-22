import { router } from "./router";

const ignoreToken = [
  "/pages/login/index",

];

router.beforeEach((to, next) => {
  const user = useUserStore();

  if (ignoreToken.includes(to.path)) {
    next();
  }
  else {
    if (user.token) {
      next();
    }
    else {
      router.login();
    }
  }
});

export { router };
