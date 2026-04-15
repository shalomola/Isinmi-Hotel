import { STATUS } from "../utils/data";

const Badge = ({ status }) => {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS[status]}`}>
      {status}
    </span>
  );
}

export default Badge;