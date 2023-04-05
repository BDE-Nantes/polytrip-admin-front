import { createRouter, createWebHistory } from "vue-router";
import AdminLogin from "../views/AdminLogin.vue";

const router = createRouter({
  history: createWebHistory("/userpanel"),
  routes: [
    {
      path: "/",
      name: "AdminLogin",
      component: AdminLogin,
      meta: {
        public: true,
        onlyWhenLoggedOut: true,
      },
    },
    {
      path: "/panel",
      name: "AdminMain",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AdminMain.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onlyWhenLoggedOut);
  const token = localStorage.getItem("token");

  if (!isPublic && !token) {
    return next({
      path: "/",
      query: { redirect: to.fullPath },
    });
  }

  if (token && onlyWhenLoggedOut) {
    return next("/panel");
  }

  next();
});

export default router;
