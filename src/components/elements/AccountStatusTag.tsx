import { Tag } from "antd";
import { TagProps } from "antd/lib";
import { capitalize } from "lodash";
import { AccountStatus } from "../../enums/user.enum";

interface IProps extends TagProps {
  status: AccountStatus;
}

const AccountStatusTag = ({ status, ...props }: IProps) => {
  return (
    <Tag color={ROLE_TAG_COLOR[status]} {...props}>
      {capitalize(status.replace("_", " "))}
    </Tag>
  );
};

export default AccountStatusTag;

const ROLE_TAG_COLOR: Record<AccountStatus, TagProps["color"]> = {
  active: "green",
  inactive: "geekblue",
  locked: "red",
};
