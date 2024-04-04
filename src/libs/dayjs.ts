import baseDayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

const dayjs = baseDayjs;
dayjs.extend(relativeTime);
dayjs.extend(utc);

export default dayjs;
