import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "vue-select/dist/vue-select.css";
import "./style.scss";
import App from "./App.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import vSelect from "vue-select";

const routes = [
  {
    path: "/",
    name: "StoredParts",
    meta: {
      requiresAuth: true,
    },
    component: () => import("./views/StoredParts.vue"),
  },
  {
    path: "/parts",
    name: "Parts",
    meta: {
      requiresAuth: true,
      title: "Parts",
    },
    component: () => import("./views/Parts.vue"),
  },
  {
    path: "/categories",
    name: "Categories",
    meta: {
      requiresAuth: true,
      title: "Categories",
    },
    component: () => import("./views/Categories.vue"),
  },
  {
    path: "/categories/edit/:id",
    name: "Category Editor",
    meta: {
      requiresAuth: true,
      title: "Edit Category",
    },
    component: () => import("./views/EditCategory.vue"),
  },
  {
    path: "/storage",
    name: "Storage Locations",
    meta: {
      requiresAuth: true,
      title: "Storage Locations",
    },
    component: () => import("./views/Storage.vue"),
  },
  {
    path: "/storage/edit/:id",
    name: "Storage Location Editor",
    meta: {
      requiresAuth: true,
      title: "Edit Storage Location",
    },
    component: () => import("./views/EditStorage.vue"),
  },
  {
    path: "/projects",
    name: "Projects",
    meta: {
      requiresAuth: true,
      title: "Projects",
    },
    component: () => import("./views/Projects.vue"),
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "Login",
    },
    component: () => import("./views/Login.vue"),
  },
];

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  console.log({ to, from });

  const metaTitle = to.matched[0].meta.title;

  if (typeof metaTitle == "string") {
    document.title = metaTitle + " | Storage Base";
  } else {
    document.title = "Storage Base";
  }

  if (to.matched.some((r) => r.meta.requiresAuth)) {
    //Auth required
    if (await getCurrentUser()) {
      next();
    } else {
      next("/login");
    }
  } else if (to.matched.some((r) => r.name === "Login")) {
    //Login
    if (await getCurrentUser()) next(from); // go back if logged in

    if (from.path === "/login") next("/");
    next();
  } else {
    next();
  }
});

app.component("v-select", vSelect);
app.use(router);
app.mount("#app");
