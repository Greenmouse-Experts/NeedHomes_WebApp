import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import generouted from "@generouted/react-router/plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react-oxc";

import generouted from "@generouted/tanstack-react-router";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    ,
    generouted(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
