import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  TextField,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, IResourceComponentsProps } from "@refinedev/core";
import { Space, Table } from "antd";
import React from "react";

export const PeriodList: React.FC<IResourceComponentsProps> = () => {
  const { tableProps } = useTable({ syncWithLocation: true });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column dataIndex="description" title={"Description"} />
        <Table.Column
          dataIndex="start_date"
          title={"Start Date"}
          render={(value) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex="end_date"
          title={"End Date"}
          render={(value) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex="faculty"
          title={"Faculty"}
          render={(value) => <TextField value={value?.name} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
