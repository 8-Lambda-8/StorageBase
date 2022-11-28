import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.scss";
import App from "./App.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    },
    component: () => import("./views/Parts.vue"),
  },
  {
    path: "/categories",
    name: "Categories",
    meta: {
      requiresAuth: true,
    },
    component: () => import("./views/Categories.vue"),
  },
  {
    path: "/storage",
    name: "Storage Locations",
    meta: {
      requiresAuth: true,
    },
    component: () => import("./views/Storage.vue"),
  },
  {
    path: "/storage/edit/:id",
    name: "Storage Locations Editor",
    meta: {
      requiresAuth: true,
    },
    component: () => import("./views/EditStorage.vue"),
  },
  {
    path: "/projects",
    name: "Projects",
    meta: {
      requiresAuth: true,
    },
    component: () => import("./views/Projects.vue"),
  },
  { path: "/login", name: "Login", component: () => import("./views/Login.vue") },
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

app.use(router);
app.mount("#app");
