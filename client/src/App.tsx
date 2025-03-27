import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import HeartBackground from "./components/HeartBackground";
import CreateContentButton from "./components/CreateContentButton";
import { TooltipProvider } from "@radix-ui/react-tooltip";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <><TooltipProvider>
      <HeartBackground />
      <Router />
      <CreateContentButton />
      <Toaster />
      </TooltipProvider>
    </>
  );
}

export default App;
