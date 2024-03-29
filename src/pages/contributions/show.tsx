import { NumberField, Show, TextField } from "@refinedev/antd";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Typography } from "antd";
import React from "react";
import { useIdentity } from "../../hooks/useIdentity";

const { Title } = Typography;

export const ContributionShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const { id } = useIdentity();
  const record = data?.data;

  return (
    <Show
      isLoading={isLoading}
      canEdit={id === record?.student?.id}
      canDelete={false}
    >
      <Title level={5}>{"ID"}</Title>
      <NumberField value={record?.id ?? ""} />
      <Title level={5}>{"Name"}</Title>
      <TextField value={record?.name} />
    </Show>
  );
};
