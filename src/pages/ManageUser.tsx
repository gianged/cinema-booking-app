import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faBan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Space, Table, TableColumnsType } from "antd";

const userList = async () => {
  const response = await fetch("http://localhost:4000/security/user");
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

const tableColumns: TableColumnsType<TableDataType> = [
  {
    title: "Id",
    width: 50,
    dataIndex: "id",
  },
  {
    title: "Username",
    width: 200,
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
    render: () => (
      <Space>
        <a>
          <FontAwesomeIcon icon={faPenToSquare} />
        </a>
        <a>
          <FontAwesomeIcon icon={faBan} />
        </a>
      </Space>
    ),
  },
];

export const ManageUser: React.FC = () => {
  const [tableList, setTableList] = useState<any[]>([]);
  const [formAddUserOpen, setFormAddUserOpen] = useState<boolean>(false);

  useEffect(() => {
    userList().then((data: any) => {
      setTableList(data);
    });
  }, []);

  return (
    <>
      <Button
        type="default"
        icon={<FontAwesomeIcon icon={faPlus} onClick={() => setFormAddUserOpen(true)} />}
      >
        Add User
      </Button>
      <Table columns={tableColumns} dataSource={tableList} pagination={false} bordered />
      <Modal open={formAddUserOpen} title="Add User" footer={null} closable>
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} layout="horizontal">
            
        </Form>
      </Modal>
    </>
  );
};
