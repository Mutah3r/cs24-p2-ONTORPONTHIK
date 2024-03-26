import { Link } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import "./Home.css";
import { IoLeafOutline } from "react-icons/io5";

const Home = () => {
  return (
    <div className="home-hero-container">
      <div className="py-3">
        <div className="flex items-center justify-between px-2 pt-2 pb-3 border-b-[1px] border-green-500">
          <Logo />
          <Link to="/login">
            <button className="bg-green-500 text-white hover:bg-white hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200">
              Login
            </button>
          </Link>
        </div>
      </div>
      <div className="px-2">
        <div className="max-w-[700px] mt-[150px] mx-auto text-center">
          <h1 className="text-[48px] font-semibold text-white leading-tight">
            Dhaka North City Corporation (DNCC) Waste Management
          </h1>
          <button className="mx-auto mt-3 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200">
            Learn More <IoLeafOutline />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
