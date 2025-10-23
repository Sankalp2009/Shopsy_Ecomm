import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import GlobalInfo from "./Redux/store.jsx";
import { Provider as Chakra } from "./components/ui/provider.jsx";
import { ThemeProvider } from "next-themes";
// console.log(GlobalInfo.getState())
createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Provider store={GlobalInfo}>
        <Chakra>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <App />
          </ThemeProvider>
        </Chakra>
      </Provider>
    </BrowserRouter>
  </>
);
