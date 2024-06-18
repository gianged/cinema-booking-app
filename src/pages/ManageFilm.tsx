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
  Table,
  TableColumnsType,
  Upload,
} from "antd";
import { displayImageFromBuffer } from "../convert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faBan, faPlus, faMinus, faUpload } from "@fortawesome/free-solid-svg-icons";
import "./ManageFilm.scss";

interface TableDataType {
  key: React.Key;
  id: number;
  filmName: string;
  filmDescription: string;
  poster: string;
  backdrop: string;
  premiere: Date;
  trailer: string;
  isActive: number;
}

const categoryList = async () => {
  const response = await fetch("http://localhost:4000/activecategory", { method: "GET" });
  const data = await response.json();
  return data;
};

const filmList = async () => {
  const response = await fetch("http://localhost:4000/film", { method: "GET" });
  const data = await response.json();
  return data;
};

const addFilm = async (
  filmName: string,
  filmDescription: string,
  poster: File,
  backdrop: File,
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
    },
  ];

  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const [searchedTableData, setSearchedTableData] = useState<TableDataType[]>([]);
  const [modalAddOpen, setModalAddOpen] = useState<boolean>(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState<boolean>(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [selectFilmId, setSelectFilmId] = useState<string | null>(null);
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
          onFinish={(values) => {
            addFilm(
              values.filmName,
              values.filmDescription,
              values.poster,
              values.backdrop,
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
          <Form.Item wrapperCol={{ span: 6 }} name={"isActive"} valuePropName="checked">
            <Checkbox>Active</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Film
            </Button>
            <Button onClick={() => setModalAddOpen(false)}>Close</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
