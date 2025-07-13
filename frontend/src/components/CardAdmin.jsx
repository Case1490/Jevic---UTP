import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CardAdmin = ({ title, link, bgcolor, icon: Icon }) => {
  return (
    <div
      className={`${bgcolor} h-24 rounded-xl p-2 text-white flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <Icon />
          <span className="text-xl">{title}</span>
        </div>
      </div>
      <Link
        to={`/admin/${link}`}
        className="underline flex items-center gap-x-1"
      >
        Ver más <FaArrowRight size={12} />
      </Link>
    </div>
  );
};

export default CardAdmin;
