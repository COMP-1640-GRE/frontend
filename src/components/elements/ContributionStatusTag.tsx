import { Tag } from "antd";
import { TagProps } from "antd/lib";
import { capitalize } from "lodash";
import { ContributionStatus } from "../../enums/contribution.enum";
import NotSetTag from "./NotsetTag";

interface IProps extends TagProps {
  status?: ContributionStatus;
}

const ContributionStatusTag = ({ status, ...props }: IProps) => {
  if (!status) return <NotSetTag />;

  return (
    <Tag color={TAG_COLOR[status]} {...props}>
      {capitalize(status.replace("_", " "))}
    </Tag>
  );
};

export default ContributionStatusTag;

const TAG_COLOR: Record<ContributionStatus, TagProps["color"]> = {
  approved: "green",
  pending: "geekblue",
  rejected: "red",
};
