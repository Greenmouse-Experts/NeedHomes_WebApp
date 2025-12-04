// import "./index.css";
// import { createRoot } from "react-dom/client";
// import { Routes } from "@generouted/react-router";
// // import { Routes } from '@generouted/react-router/lazy' // route-based code-splitting

// import { Routes } from './routes.gen'

// createRoot(document.getElementById('root')!).render(<Routes />)
// createRoot(document.getElementById("root")!).render(<Routes />);
// import "./index.css";

import "./index.css";
import { Routes } from "./routes.gen";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(<Routes />);
