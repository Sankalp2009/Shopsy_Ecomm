import { SpeedInsights } from "@vercel/speed-insights/react";
import AllRoutes from "./Component/AllRoutes.jsx";
import ErrorBoundary from "./Component/ErrorBoundary.jsx";
import Header from "./Component/Header.jsx";
import { Toaster } from "./components/ui/toaster.jsx";

function App() {
  return (
    <ErrorBoundary>
      <div>
        <Header />
        <Toaster variant="solid" size="md" />
        <AllRoutes />
        <SpeedInsights />
      </div>
    </ErrorBoundary>
  );
}

export default App;
