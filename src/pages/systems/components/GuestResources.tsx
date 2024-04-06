import { SaveButton } from "@refinedev/antd";
import { useCustom, useCustomMutation } from "@refinedev/core";
import { Card, Transfer, Typography } from "antd";
import { TransferProps } from "antd/lib";
import { isEqual } from "lodash";
import { useState } from "react";

const GuestResources = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const { data: availableResources } = useCustom({
    url: "/systems/available-guest-resources",
    method: "get",
    queryOptions: {
      select: (data) =>
        data.data.map((item: any) => ({
          key: item,
          title: item,
        })),
    },
  });

  const onChange: TransferProps["onChange"] = (nextTargetKeys) =>
    setTargetKeys(nextTargetKeys);
  const onSelectChange: TransferProps["onSelectChange"] = (
    sourceSelectedKeys,
    targetSelectedKeys
  ) => setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

  const { data, refetch } = useCustom({
    url: "/systems/guest-resources",
    method: "get",
    queryOptions: {
      onSuccess: (res: any) => setTargetKeys(res.data || []),
    },
  });

  const { mutate } = useCustomMutation();

  return (
    <>
      <Typography.Title level={3}>Guest Resources:</Typography.Title>
      <Card className="flex flex-col gap-4">
        <Transfer
          dataSource={(availableResources as any) || []}
          titles={["Source", "Target"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          render={(item) => item.title as any}
        />
        <div className="flex justify-end">
          <SaveButton
            disabled={isEqual(targetKeys, data?.data)}
            onClick={() =>
              mutate(
                {
                  method: "post",
                  url: "/systems/guest-resources",
                  values: targetKeys,
                  successNotification: {
                    type: "success",
                    message: "Updated successfully",
                  },
                },
                {
                  onSuccess: () => refetch(),
                }
              )
            }
          />
        </div>
      </Card>
    </>
  );
};

export default GuestResources;
