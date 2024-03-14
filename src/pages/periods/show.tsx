import { DateField, NumberField, Show, TextField } from "@refinedev/antd";
import { IResourceComponentsProps, useShow } from "@refinedev/core";
import { Typography } from "antd";
import React from "react";

const { Title } = Typography;

export const PeriodShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <NumberField value={record?.id ?? ""} />
      <Title level={5}>{"Name"}</Title>
      <TextField value={record?.name} />
      <Title level={5}>{"Description"}</Title>
      <TextField value={record?.description} />
      <Title level={5}>{"Start Date"}</Title>
      <DateField value={record?.start_date} format="YYYY-MM-DD HH:mm:ss" />
      <Title level={5}>{"End Date"}</Title>
      <DateField value={record?.end_date} format="YYYY-MM-DD HH:mm:ss" />
      <Title level={5}>{"Faculty"}</Title>
      <TextField value={record?.faculty?.name} />
    </Show>
  );
};
