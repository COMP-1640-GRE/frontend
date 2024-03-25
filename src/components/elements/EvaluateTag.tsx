import { Tag } from "antd";
import { TagProps } from "antd/lib";
import { capitalize } from "lodash";
import { ContributionEvaluate } from "../../enums/contribution.enum";
import NotSetTag from "./NotSetTag";

interface IProps extends TagProps {
  evaluation?: ContributionEvaluate;
}

const EvaluateTag = ({ evaluation, ...props }: IProps) => {
  if (!evaluation) return <NotSetTag />;

  return (
    <Tag color={TAG_COLOR[evaluation]} {...props}>
      {capitalize(evaluation.replace("_", " "))}
    </Tag>
  );
};

export default EvaluateTag;

const TAG_COLOR: Record<ContributionEvaluate, TagProps["color"]> = {
  bad: "red-inverse",
  good: "green-inverse",
  normal: "yellow-inverse",
};
