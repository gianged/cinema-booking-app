import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
  Upload,
} from "antd";
import { convertBlobToBase64, displayImageFromBuffer, fileToBase64 } from "../convert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faBan, faPlus, faMinus, faUpload } from "@fortawesome/free-solid-svg-icons";
import "./ManageFilm.scss";
import dayjs from "dayjs";

interface TableDataType {
  key: React.Key;
  id: number;
  filmName: string;
  filmDescription: string;
  categories: string;
  poster: string;
  backdrop: string;
  premiere: Date;
  trailer: string;
  isActive: number;
}

const categoryList = async () => {
  const response = await fetch("http://localhost:4000/category/active", { method: "GET" });
  const data = await response.json();
  return data;
};

const filmList = async () => {
  const response = await fetch("http://localhost:4000/film", { method: "GET" });
  const data = await response.json();
  return data;
};

const getOneFilm = async (id: number) => {
  const response = await fetch(`http://localhost:4000/film/${id}`, { method: "GET" });
  const data = await response.json();
  return data;
};

const addFilm = async (
  filmName: string,
  filmDescription: string,
  poster: unknown,
  backdrop: unknown,
  categories: number[],
  premiere: Date,
  trailer: string,
  isActive: number
) => {
  const response = await fetch("http://localhost:4000/film", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filmName: filmName,
      filmDescription: filmDescription,
      poster: poster,
      backdrop: backdrop,
      categories: categories,
      premiere: premiere,
      trailer: trailer,
      isActive: isActive,
    }),
  });
  const data = await response.json();
  return data;
};

const updateFilm = async (
  id: number,
  filmName: string,
  filmDescription: string,
  categories: number[],
  premiere: Date,
  trailer: string,
  isActive: number
) => {
  const response = await fetch(`http://localhost:4000/film/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filmName: filmName,
      filmDescription: filmDescription,
      categories: categories,
      premiere: premiere,
      trailer: trailer,
      isActive: isActive,
    }),
  });
  const data = await response.json();
  return data;
};

const deleteFilm = async (id: number) => {
  const response = await fetch(`http://localhost:4000/film/${id}`, { method: "DELETE" });
  const data = await response.json();
  return data;
};

export const ManageFilm: React.FC = () => {
  const tableColumns: TableColumnsType<TableDataType> = [
    {
      title: "Id",
      width: 50,
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Film Name",
      width: 100,
      dataIndex: "filmName",
      key: "filmName",
    },
    {
      title: "Film Description",
      dataIndex: "filmDescription",
      key: "filmDescription",
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
    },
    {
      title: "Poster",
      width: 100,
      dataIndex: "poster",
      key: "poster",
      render: (text: string, record: TableDataType) => {
        return <img src={record.poster} alt="No image" width="100" />;
      },
    },
    {
      title: "Backdrop",
      width: 100,
      dataIndex: "backdrop",
      render: (text: string, record: TableDataType) => {
        return <img src={record.backdrop} alt="No image" width="100" />;
      },
    },
    {
      title: "Premiere",
      width: 100,
      dataIndex: "premiere",
      key: "premiere",
    },
    {
      title: "Trailer",
      width: 100,
      dataIndex: "trailer",
      key: "trailer",
    },
    {
      title: "Is Active",
      width: 100,
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
              setSelectFilmId(values.id);
              setModalUpdateOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </a>
          <a
            onClick={() => {
              setSelectFilmId(values.id);
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
  const [selectFilmId, setSelectFilmId] = useState<number | null>(null);
  const [categorySelectList, setCategorySelectList] = useState<any[]>([]);
  const [formUpdate] = Form.useForm();

  useEffect(() => {
    filmList().then((data: any) => {
      data.forEach((item: any) => {
        item.poster = item.poster?.data ? displayImageFromBuffer(item.poster.data) : null;
        item.backdrop = item.backdrop?.data ? displayImageFromBuffer(item.backdrop.data) : null;
      });
      setTableData(data);
      setSearchedTableData(data);
    });
  }, [modalAddOpen, modalUpdateOpen, modalDeleteOpen]);

  useEffect(() => {
    categoryList().then((data: any) => {
      setCategorySelectList(data);
    });
  }, []);

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const filterTableData = tableData.filter((data) => {
      return data.filmName.toLowerCase().includes(value);
    });
    setSearchedTableData(filterTableData);
  };

  const setFormUpdateData = async (id: number) => {
    const data = await getOneFilm(id);
    if (Object.keys(data).length > 0) {
      formUpdate.setFieldsValue({
        filmName: data.filmName,
        filmDescription: data.filmDescription,
        premiere: dayjs(data.premiere),
        categories: data.FilmCategories.map((category: any) => category.Category.id),
        trailer: data.trailer,
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
          Add Film
        </Button>
        <Input className="searchedInput" placeholder="Search film" onChange={searchInput} />
      </Row>

      <Table columns={tableColumns} dataSource={searchedTableData} pagination={false} />
      <Modal
        className="modalAdd"
        open={modalAddOpen}
        footer={null}
        title="Add Film"
        onCancel={() => {
          setModalAddOpen(false);
        }}
      >
        <Form
          className="formAdd"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={async (values) => {
            const posterBase64 = values.poster
              ? await fileToBase64(values.poster.file.originFileObj)
              : null;
            const backdropBase64 = values.backdrop
              ? await fileToBase64(values.backdrop.file.originFileObj)
              : null;
            addFilm(
              values.filmName,
              values.filmDescription,
              posterBase64,
              backdropBase64,
              values.categories,
              values.premiere,
              values.trailer,
              values.isActive
            );
            setModalAddOpen(false);
          }}
        >
          <Form.Item label="Film Name" name={"filmName"} required>
            <Input />
          </Form.Item>
          <Form.Item label="Film Description" name={"filmDescription"} required>
            <Input />
          </Form.Item>
          <Form.Item label="Category" name={"categories"}>
            <Select mode="multiple" placeholder="Select category">
              {categorySelectList.map((category) => {
                return (
                  <Select.Option key={category.id} value={category.id}>
                    {category.categoryName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Poster" name={"poster"}>
            <Upload className="upload-image" maxCount={1} multiple={false}>
              <FontAwesomeIcon className="icon" icon={faUpload} />
              Upload
            </Upload>
          </Form.Item>
          <Form.Item label="Backdrop" name={"backdrop"}>
            <Upload className="upload-image" maxCount={1} multiple={false}>
              <FontAwesomeIcon className="icon" icon={faUpload} />
              Upload
            </Upload>
          </Form.Item>
          <Form.Item label="Premiere" name={"premiere"}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Trailer" name={"trailer"}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} name={"isActive"} valuePropName="checked">
            <Checkbox>Active</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Film
              </Button>
              <Button onClick={() => setModalAddOpen(false)}>Close</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="modalUpdate"
        open={modalUpdateOpen}
        footer={null}
        title="Update Film"
        onCancel={() => {
          setModalUpdateOpen(false);
        }}
      >
        <Form
          className="formUpdate"
          form={formUpdate}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={(values) => {
            console.log(values);
            updateFilm(
              selectFilmId ?? 0,
              values.filmName,
              values.filmDescription,
              values.categories,
              values.premiere,
              values.trailer,
              values.isActive
            );
            setModalUpdateOpen(false);
            setSelectFilmId(null);
          }}
        >
          <Form.Item label="Film Name" name={"filmName"}>
            <Input />
          </Form.Item>
          <Form.Item label="Film Description" name={"filmDescription"}>
            <Input />
          </Form.Item>
          <Form.Item label="Category" name={"categories"}>
            <Select mode="multiple" placeholder="Select category">
              {categorySelectList.map((category) => {
                return (
                  <Select.Option key={category.id} value={category.id}>
                    {category.categoryName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="Poster" name={"poster"}>
            <Upload className="upload-image" maxCount={1} multiple={false}>
              <FontAwesomeIcon className="icon" icon={faUpload} />
              Upload
            </Upload>
          </Form.Item>
          <Form.Item label="Backdrop" name={"backdrop"}>
            <Upload className="upload-image" maxCount={1} multiple={false}>
              <FontAwesomeIcon className="icon" icon={faUpload} />
              Upload
            </Upload>
          </Form.Item>
          <Form.Item label="Premiere" name={"premiere"}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Trailer" name={"trailer"}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6 }} name={"isActive"} valuePropName="checked">
            <Checkbox>Active</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button
                onClick={() => {
                  setModalUpdateOpen(false);
                  setSelectFilmId(null);
                }}
              >
                Close
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="modalDelete"
        open={modalDeleteOpen}
        footer={null}
        title="Delete Film"
        onCancel={() => setModalDeleteOpen(false)}
      >
        <p>Are you sure you want to delete this film?</p>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              deleteFilm(selectFilmId ?? 0);
              setSelectFilmId(null);
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
              setSelectFilmId(null);
            }}
          >
            No
          </Button>
        </Space>
      </Modal>
    </>
  );
};

//TODO: File upload to server is not working
