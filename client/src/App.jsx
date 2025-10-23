import Header from "./Component/Header.jsx"
import AllRoutes from "./Component/AllRoutes.jsx"
import { Toaster } from "./components/ui/toaster.jsx";

function App() {

  return (
    <div>
     <Header />
          <Toaster variant="solid" size="md" />
     <AllRoutes />
    </div>
  )
}

export default App
