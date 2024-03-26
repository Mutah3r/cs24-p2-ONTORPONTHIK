import { IoLeafOutline } from "react-icons/io5";

const Logo = () => {
  return (
    <div className="text-green-500 flex gap-2 items-center">
      <IoLeafOutline className="text-green-500 text-[44px] font-bold" />
      <h1 className="text-[32px]">
        Eco<span className="text-white">Sync</span>
      </h1>
    </div>
  );
};

export default Logo;
