import { Tag } from "antd";
import { TagProps } from "antd/lib";

interface IProps extends TagProps {
  contribution?: { selected: boolean; approved: boolean };
}

const ContributionTag = ({ contribution, ...props }: IProps) => {
  if (!contribution) return <></>;
  const { selected, approved } = contribution;
  return (
    <>
      {selected && (
        <Tag color="lime" {...props}>
          Selected
        </Tag>
      )}
      {approved && (
        <Tag color="cyan" {...props}>
          Approved
        </Tag>
      )}
    </>
  );
};

export default ContributionTag;
