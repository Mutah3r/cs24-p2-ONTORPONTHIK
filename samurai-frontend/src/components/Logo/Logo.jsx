import { IoLeafOutline } from "react-icons/io5";

const Logo = ({ bgWhite }) => {
  return (
    <div className="text-green-500 flex gap-2 items-center">
      <IoLeafOutline className="text-green-500 text-[44px] font-bold" />
      <h1 className="text-[32px]">
        Eco
        <span className={`${bgWhite ? "text-green-500" : "text-white"}`}>
          Sync
        </span>
      </h1>
    </div>
  );
};

export default Logo;
