import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Outlet } from "react-router"

const App = () => {
  const [animationParent] = useAutoAnimate()
  return (
    <div>
      <div ref={animationParent}>
        <Outlet/>
      </div>
    </div>
  );
};

export default App;
