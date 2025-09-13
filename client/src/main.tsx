import { BookmarksProvider } from './contexts/BookmarksContext';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<BookmarksProvider>
		<App />
	</BookmarksProvider>
);
