import Header from "./Component/Header.jsx";
import AllRoutes from "./Component/AllRoutes.jsx";
import { Toaster } from "./components/ui/toaster.jsx";
import { SpeedInsights } from "@vercel/speed-insights/react";
function App() {
  return (
    <div>
      <Header />
      <Toaster variant="solid" size="md" />
      <AllRoutes />
       <SpeedInsights />
    </div>
  );
}

export default App;
