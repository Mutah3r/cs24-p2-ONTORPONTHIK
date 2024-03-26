import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <h1>THis is main layout</h1>
      <Outlet />
    </div>
  );
};

export default Main;
