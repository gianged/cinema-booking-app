import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faBan, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import "./ManageUser.scss";

const userList = async () => {
  const response = await fetch("http://localhost:4000/security/user", { method: "GET" });
  const data = await response.json();
  return data;
};

const getOneUser = async (id: string) => {
  const response = await fetch(`http://localhost:4000/security/user/${id}`, { method: "GET" });
  const data = await response.json();
  return data;
};

const userAdd = async (
  username: string,
  password: string,
  role: string,
  isBanned: number,
  isActive: number
) => {
  const response = await fetch("http://localhost:4000/security/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, role, isBanned, isActive }),
  });
  const data = await response.json();
  return data;
};

const updateUser = async (
  id: string,
  password: string,
  role: string,
  isBanned: number,
  isActive: number
) => {
  const response = await fetch(`http://localhost:4000/security/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, role, isBanned, isActive }),
  });
  const data = await response.json();
  return data;
};

interface TableDataType {
  key: React.Key;
  username: string;
  role: string;
  isBanned: number;
  isActive: number;
}

export const ManageUser: React.FC = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [formAddUserOpen, setFormAddUserOpen] = useState<boolean>(false);
  const [formUpdateUserOpen, setFormUpdateUserOpen] = useState<boolean>(false);
  const [getUserUpdate, setGetUserUpdate] = useState<any>({});
  const [formUpdate] = Form.useForm();
  const [updateId, setUpdateId] = useState<string | null>(null);

  useEffect(() => {
    userList().then((data: any) => {
      setTableList(data);
    });
  }, [formAddUserOpen, formUpdateUserOpen]);

  const setFormUpdateData = async (id: string) => {
    const data = await getOneUser(id);
    setGetUserUpdate(data);
    if (Object.keys(data).length > 0) {
      formUpdate.setFieldsValue({
        username: data.username,
        role: data.role,
        isBanned: data.isBanned,
        isActive: data.isActive,
      });
    }
  };

  const tableColumns: TableColumnsType<TableDataType> = [
    {
      title: "Id",
      width: 50,
      dataIndex: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role: string) => {
        switch (role) {
          case "a":
            return "Admin";
          case "u":
            return "User";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "Is Banned",
      dataIndex: "isBanned",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
    },
    {
      title: "Action",
      width: 100,
      render: (values) => (
        <Space>
          <a
            onClick={() => {
              setFormUpdateUserOpen(true);
              setFormUpdateData(values.id.toString());
              setUpdateId(values.id.toString());
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </a>
          <a>
            <FontAwesomeIcon icon={faBan} />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row className="topRow">
        <Button
          className="topButton"
          type="default"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setFormAddUserOpen(true)}
        >
          Add User
        </Button>
      </Row>
      <Table columns={tableColumns} dataSource={tableList} pagination={false} bordered />
      <Modal
        className="modalAddUser"
        open={formAddUserOpen}
        title="Add User"
        footer={null}
        onCancel={() => {
          setFormAddUserOpen(false);
        }}
      >
        <Form
          className="formAddUser"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={(values) => {
            userAdd(
              values.username,
              values.password,
              values.role,
              values.isBanned,
              values.isActive
            );
            setFormAddUserOpen(false);
          }}
        >
          <Form.Item label="Username" name={"username"} required>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name={"password"} required>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Role" name={"role"} required>
            <Select defaultValue={"u"}>
              <Select.Option value="u">User</Select.Option>
              <Select.Option value="a">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} name={"isBanned"}>
            <Checkbox>Banned</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} name={"isActive"}>
            <Checkbox checked>Active</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 3 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Add User
              </Button>
              <Button onClick={() => setFormAddUserOpen(false)}>Close</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="modalUpdateUser"
        open={formUpdateUserOpen}
        title="Update User"
        footer={null}
        onCancel={() => {
          setFormUpdateUserOpen(false);
        }}
      >
        <Form
          form={formUpdate}
          className="formUpdateUser"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={(values) => {
            if (values.password === undefined) {
              values.password = getUserUpdate.password;
            }
            updateUser(
              updateId ?? "0",
              values.password,
              values.role,
              values.isBanned,
              values.isActive
            );
            setFormUpdateUserOpen(false);
            setUpdateId(null);
          }}
        >
          <Form.Item label="Username" name={"username"} initialValue={getUserUpdate.username}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Password" name={"password"}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Role" name={"role"}>
            <Select defaultValue={"u"}>
              <Select.Option value="u">User</Select.Option>
              <Select.Option value="a">Admin</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} name={"isBanned"}>
            <Checkbox>Banned</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} name={"isActive"}>
            <Checkbox checked>Active</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 3 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Update User
              </Button>
              <Button onClick={() => setFormUpdateUserOpen(false)}>Close</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
