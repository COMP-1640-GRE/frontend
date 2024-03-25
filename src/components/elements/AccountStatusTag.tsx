import { Tag } from "antd";
import { TagProps } from "antd/lib";
import { capitalize } from "lodash";
import { AccountStatus } from "../../enums/user.enum";
import NotSetTag from "./NotSetTag";

interface IProps extends TagProps {
  status?: AccountStatus;
}

const AccountStatusTag = ({ status, ...props }: IProps) => {
  if (!status) return <NotSetTag />;

  return (
    <Tag color={TAG_COLOR[status]} {...props}>
      {capitalize(status.replace("_", " "))}
    </Tag>
  );
};

export default AccountStatusTag;

const TAG_COLOR: Record<AccountStatus, TagProps["color"]> = {
  active: "green",
  inactive: "geekblue",
  locked: "red",
};
