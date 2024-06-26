import { Link } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import "./Home.css";
import { IoLeafOutline } from "react-icons/io5";
import "animate.css/animate.css";

const Home = () => {
  return (
    <div className="home-hero-container">
      <div className="py-3">
        {/* Conditional rendering based on user login status */}
        <div className="flex flex-col gap-3 sm:flex-row items-center justify-between px-2 pt-2 pb-3 border-b-[1px] border-green-500">
          <Logo />
          {JSON.parse(localStorage.getItem("user")) ? ( // If the user is logged in
            <Link to="/dashboard">
              <button className="bg-green-500 text-white hover:bg-white hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200">
                Dashboard
              </button>
            </Link>
          ) : (
            // If the user is not logged in
            <Link to="/login">
              <button className="bg-green-500 text-white hover:bg-white hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Homepage Content */}
      <div className="px-2">
        <div className="max-w-[700px] mt-[150px] mx-auto text-center">
          {/* Title with Animate.css animation */}
          <h1 className="animate__animated animate__fadeInDown text-[24px] md:text-[32px] lg:text-[48px] font-semibold text-white leading-tight">
            Dhaka North City Corporation (DNCC) Waste Management
          </h1>

          {/* Button with Animate.css animation for displaying modal */}
          <button
            onClick={() => document.getElementById("my_modal_5").showModal()}
            className="animate__animated animate__zoomIn mx-auto mt-3 flex gap-2 items-center bg-green-500 text-white hover:bg-white hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200"
          >
            Learn More <IoLeafOutline />
          </button>

          {/* Modal dialog for displaying additional information */}
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">EcoSync</h3>
              {/* Modal content */}
              <p className="py-4">
                EcoSync is a revolutionary waste management project aimed at
                improving waste collection and transportation processes in Dhaka
                North City Corporation. It introduces a comprehensive web
                application that streamlines various aspects of waste
                management, including user and role management, data entry,
                billing, route optimization, fleet optimization, and dashboard
                statistics.
              </p>
              {/* Modal close button */}
              <div className="modal-action">
                <form method="dialog">
                  <button className="bg-green-500 text-white hover:bg-neutral-100 hover:text-green-500 px-6 py-3 text-xl rounded-md transition-all duration-200">
                    Close
                  </button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Home;
