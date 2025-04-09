// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: [
      "three/examples/jsm/utils/SkeletonUtils.js"
    ]
  }
});
