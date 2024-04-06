import { PlusOutlined } from "@ant-design/icons";
import { SaveButton } from "@refinedev/antd";
import { useCustom, useCustomMutation } from "@refinedev/core";
import type { InputRef } from "antd";
import { Card, Input, Tag, Typography, theme } from "antd";
import { isEqual } from "lodash";
import React, { useEffect, useRef, useState } from "react";

const BlockedWords = () => {
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  const { data, refetch } = useCustom({
    url: "/systems/blocked-words",
    method: "get",
    queryOptions: {
      onSuccess: (res: any) => setTags(res.data || []),
    },
  });

  const { mutate } = useCustomMutation();

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: "dashed",
  };

  return (
    <>
      <Typography.Title level={3}>Blocked words:</Typography.Title>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap gap-1">
          {tags.map((tag: string) => (
            <span key={tag} style={{ display: "inline-block" }}>
              <Tag
                closable
                onClose={(e) => {
                  e.preventDefault();
                  handleClose(tag);
                }}
                style={tagPlusStyle}
              >
                {tag}
              </Tag>
            </span>
          ))}
          {inputVisible ? (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            <Tag onClick={showInput} style={tagPlusStyle}>
              <PlusOutlined /> New word
            </Tag>
          )}
        </div>
        <div className="flex justify-end">
          <SaveButton
            disabled={isEqual(tags, data?.data)}
            onClick={() =>
              mutate(
                {
                  method: "post",
                  url: "/systems/blocked-words",
                  values: tags,
                  successNotification: {
                    type: "success",
                    message: "Blocked words updated successfully",
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

export default BlockedWords;
