import { parseISO, formatDistanceToNow } from "date-fns";

function TimeAgo({ timestamp }) {
  let timeAgo = "";
  if (timestamp) {
    const date = parseISO(timestamp);
    const timeperiod = formatDistanceToNow(date);
    timeAgo = `${timeperiod} ago`;
  }
  return (
    <span title={timestamp}>
      &nbsp; <i>{timeAgo}</i>
    </span>
  );
}

export default TimeAgo;
