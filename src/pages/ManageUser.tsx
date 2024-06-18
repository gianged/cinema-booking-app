import React, { useState, useEffect, ReactEventHandler } from "react";
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
  isActive: number
) => {
  const response = await fetch("http://localhost:4000/security/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, role, isActive }),
  });
  const data = await response.json();
  return data;
};

const updateUser = async (
  id: string,
  password: string,
  role: string,
  isActive: number
) => {
  const response = await fetch(`http://localhost:4000/security/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, role, isActive }),
  });
  const data = await response.json();
  return data;
};

const deleteUser = async (id: string) => {
  const response = await fetch(`http://localhost:4000/security/user/${id}`, { method: "DELETE" });
  const data = await response.json();
  return data;
};

interface TableDataType {
  key: React.Key;
  id: string;
  username: string;
  role: string;
  isBanned: number;
  isActive: number;
}

export const ManageUser: React.FC = () => {
  const tableColumns: TableColumnsType<TableDataType> = [
    {
      title: "Id",
      width: 50,
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
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
      key: "role",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
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
          <a
            onClick={() => {
              setFormDeleteUserOpen(true);
              setUpdateId(values.id.toString());
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </a>
        </Space>
      ),
    },
  ];

  const [tableList, setTableList] = useState<TableDataType[]>([]);
  const [formAddUserOpen, setFormAddUserOpen] = useState<boolean>(false);
  const [formUpdateUserOpen, setFormUpdateUserOpen] = useState<boolean>(false);
  const [formDeleteUserOpen, setFormDeleteUserOpen] = useState<boolean>(false);
  const [getUserUpdate, setGetUserUpdate] = useState<any>({});
  const [formUpdate] = Form.useForm();
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [searchedUserTable, setSearchedUserTable] = useState<TableDataType[]>([]);

  useEffect(() => {
    userList().then((data: any) => {
      setTableList(data);
      setSearchedUserTable(data);
    });
  }, [formAddUserOpen, formUpdateUserOpen, formDeleteUserOpen]);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filtered = tableList.filter((user) => {
      return user.username.toLowerCase().includes(value);
    });
    setSearchedUserTable(filtered);
  };

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
        <Input className="searchedInput" placeholder="Search username" onChange={handleSearch} />
      </Row>
      <Table columns={tableColumns} dataSource={searchedUserTable} pagination={false} bordered />
      <Modal
        className="modalAdd"
        open={formAddUserOpen}
        title="Add User"
        footer={null}
        onCancel={() => {
          setFormAddUserOpen(false);
        }}
      >
        <Form
          className="formAdd"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={(values) => {
            userAdd(
              values.username,
              values.password,
              values.role,
              values.isActive
            );
            setFormAddUserOpen(false);
            console.log(values);
          }}
          initialValues={{ isBanned: false, isActive: false }}
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
          <Form.Item wrapperCol={{ offset: 6 }} name={"isActive"} valuePropName="checked">
            <Checkbox>Active</Checkbox>
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
        className="modalUpdate"
        open={formUpdateUserOpen}
        title="Update User"
        footer={null}
        onCancel={() => {
          setFormUpdateUserOpen(false);
        }}
      >
        <Form
          form={formUpdate}
          className="formUpdate"
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
              values.isActive
            );
            setUpdateId(null);
            setFormUpdateUserOpen(false);
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
          <Form.Item wrapperCol={{ offset: 6 }} name={"isActive"} valuePropName="checked">
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

      <Modal
        className="modalDelete"
        open={formDeleteUserOpen}
        title="Delete User"
        footer={null}
        onCancel={() => {
          setFormDeleteUserOpen(false);
        }}
      >
        <p>Are you sure you want to delete this user?</p>
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => {
              deleteUser(updateId ?? "0");
              setUpdateId(null);
              setFormDeleteUserOpen(false);
            }}
          >
            Yes
          </Button>
          <Button onClick={() => setFormDeleteUserOpen(false)}>No</Button>
        </Space>
      </Modal>
    </>
  );
};
