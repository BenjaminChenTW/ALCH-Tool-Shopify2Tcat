import { Form, FormInstance, Input, InputNumber, InputRef } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import type TcatOrder from "types/TcatOrder.interface";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  dataIndex: keyof TcatOrder;
  record: TcatOrder;
  inputNode?: React.ReactElement;
  setIsEditing: () => void;
  handleSave: () => void;
  required?: boolean;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  dataIndex,
  record,
  inputNode = <Input />,
  setIsEditing,
  handleSave,
  required = true,
  children,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    if (!editing) setIsEditing();
    setEditing(!editing);
  };

  const save = async () => {
    try {
      toggleEdit();
      handleSave();
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={
            required
              ? [
                  {
                    required: true,
                    message: `請輸入${title}！`,
                  },
                ]
              : []
          }
        >
          {React.cloneElement(inputNode, {
            ref: inputRef,
            onPressEnter: () => {
              console.log("onPressEnter");
              save();
            },
            onBlur: save,
          })}
        </Form.Item>
      ) : (
        <div onClick={toggleEdit}>{children}</div>
      )}
    </td>
  );
};

export default EditableCell;
