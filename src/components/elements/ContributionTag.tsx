import { Tag } from "antd";
import { TagProps } from "antd/lib";

interface IProps extends TagProps {
  contribution?: { selected: boolean };
}

const ContributionTag = ({ contribution, ...props }: IProps) => {
  if (!contribution) return <></>;
  const { selected } = contribution;
  return (
    <>
      {selected && (
        <Tag color="lime" {...props}>
          Selected
        </Tag>
      )}
    </>
  );
};

export default ContributionTag;
