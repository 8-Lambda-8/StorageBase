import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.scss";
import App from "./App.vue";

const routes = [
  { path: "/", name: "StoredParts", component: () => import("./views/StoredParts.vue") },
  { path: "/parts", name: "Parts", component: () => import("./views/Parts.vue") },
  { path: "/categories", name: "Categories", component: () => import("./views/Categories.vue") },
  {
    path: "/storage",
    name: "Storage Locations",
    component: () => import("./views/Storage.vue"),
  },
  {
    path: "/storage/edit/:id",
    name: "Storage Locations Editor",
    component: () => import("./views/EditStorage.vue"),
  },
  { path: "/projects", name: "Projects", component: () => import("./views/Projects.vue") },
  { path: "/login", name: "Login", component: () => import("./views/Login.vue") },
];

const app = createApp(App);
const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);
app.mount("#app");
