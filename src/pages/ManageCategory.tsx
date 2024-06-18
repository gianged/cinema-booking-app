import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Input, Modal, Row, Space, Table, TableColumnsType } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faBan, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./ManageCategory.scss";

interface TableDataType {
  key: React.Key;
  id: number;
  categoryName: string;
  isActive: number;
}

const categoryList = async () => {
  const response = await fetch("http://localhost:4000/category", { method: "GET" });
  const data = await response.json();
  return data;
};

const getOneCategory = async (id: string) => {
  const response = await fetch(`http://localhost:4000/category/${id}`, { method: "GET" });
  const data = await response.json();
  return data;
};

const addCategory = async (categoryName: string, isActive: number) => {
  const response = await fetch("http://localhost:4000/category", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryName, isActive }),
  });
  const data = await response.json();
  return data;
};

const updateCategory = async (id: string, categoryName: string, isActive: number) => {
  const response = await fetch(`http://localhost:4000/category/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoryName, isActive }),
  });
  const data = await response.json();
  return data;
};

const deleteCategory = async (id: string) => {
  const response = await fetch(`http://localhost:4000/category/${id}`, { method: "DELETE" });
  const data = await response.json();
  return data;
};

export const ManageCategory: React.FC = () => {
  const tableColumns: TableColumnsType<TableDataType> = [
    {
      title: "Id",
      width: 50,
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
    },
    {
      title: "Action",
      width: 100,
      render: (values: any) => (
        <Space>
          <a
            onClick={() => {
              setFormUpdateData(values.id);
              setSelectCategoryId(values.id);
              setModalUpdateOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </a>
          <a
            onClick={() => {
              setSelectCategoryId(values.id);
              setModalDeleteOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faBan} />
          </a>
        </Space>
      ),
    },
  ];

  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const [searchedTableData, setSearchedTableData] = useState<TableDataType[]>([]);
  const [modalAddOpen, setModalAddOpen] = useState<boolean>(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState<boolean>(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [selectCategoryId, setSelectCategoryId] = useState<string | null>(null);
  const [formUpdate] = Form.useForm();

  useEffect(() => {
    categoryList().then((data: any) => {
      setTableData(data);
      setSearchedTableData(data);
    });
  }, [modalAddOpen, modalUpdateOpen, modalDeleteOpen]);

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filter = tableData.filter((data) => {
      return data.categoryName.toLowerCase().includes(value);
    });
    setSearchedTableData(filter);
  };

  const setFormUpdateData = async (id: string) => {
    const data = await getOneCategory(id);
    if (Object.keys(data).length > 0) {
      formUpdate.setFieldsValue({
        categoryName: data.categoryName,
        isActive: data.isActive,
      });
    }
  };

  return (
    <>
      <Row className="topRow">
        <Button
          className="topButton"
          type="default"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setModalAddOpen(true)}
        >
          Add Category
        </Button>
        <Input className="searchedInput" placeholder="Search category" onChange={searchInput} />
      </Row>

      <Table
        className="tableCategory"
        columns={tableColumns}
        dataSource={searchedTableData}
        pagination={false}
      />

      <Modal
        className="modalAdd"
        open={modalAddOpen}
        footer={null}
        title="Add Category"
        onCancel={() => {
          setModalAddOpen(false);
        }}
      >
        <Form
          className="formAdd"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={(values) => {
            addCategory(values.categoryName, values.isActive);
            setModalAddOpen(false);
          }}
          initialValues={{ isActive: false }}
        >
          <Form.Item label="Category Name" name="categoryName" required>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} name="isActive" valuePropName="checked">
            <Checkbox>Active</Checkbox>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button type="default" onClick={() => setModalAddOpen(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="modalUpdate"
        open={modalUpdateOpen}
        footer={null}
        title="Update Category"
        onCancel={() => {
          setModalUpdateOpen(false);
        }}
      >
        <Form
          form={formUpdate}
          className="formUpdate"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={(values) => {
            updateCategory(selectCategoryId ?? "0", values.categoryName, values.isActive);
            setSelectCategoryId(null);
            setModalUpdateOpen(false);
          }}
        >
          <Form.Item label="Category Name" name="categoryName">
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} name="isActive" valuePropName="checked">
            <Checkbox>Active</Checkbox>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button
                type="default"
                onClick={() => {
                  setModalUpdateOpen(false);
                  setSelectCategoryId(null);
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="modalDelete"
        open={modalDeleteOpen}
        footer={null}
        title="Delete Category"
        onCancel={() => setModalDeleteOpen(false)}
      >
        <p>Are you sure you want to delete this category?</p>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              deleteCategory(selectCategoryId ?? "0");
              setSelectCategoryId(null);
              setModalDeleteOpen(false);
            }}
            danger
          >
            Yes
          </Button>
          <Button
            type="default"
            onClick={() => {
              setModalDeleteOpen(false);
              setSelectCategoryId(null);
            }}
          >
            No
          </Button>
        </Space>
      </Modal>
    </>
  );
};
