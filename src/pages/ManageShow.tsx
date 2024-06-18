import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
  TimePicker,
  Tooltip,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faBan, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import "./ManageShow.scss";
import dayjs, { Dayjs } from "dayjs";
import FormItem from "antd/es/form/FormItem";
import { log } from "console";

interface TableDataType {
  key: React.Key;
  id: number;
  filmName: string;
  showPrice: number;
  showDay: Date;
  beginTime: Date;
  endTime: Date;
  room: string;
  isActive: number;
}

const showList = async () => {
  const response = await fetch("http://localhost:4000/show", { method: "GET" });
  const data = await response.json();
  return data;
};

const getOneShow = async (id: string) => {
  const response = await fetch(`http://localhost:4000/show/${id}`, { method: "GET" });
  const data = await response.json();
  return data;
};

const activeFilmList = async () => {
  const response = await fetch("http://localhost:4000/film/active", { method: "GET" });
  const data = await response.json();
  return data;
};

const addShow = async (
  film: string,
  showPrice: number,
  showDay: Date,
  beginTime: Date,
  room: string,
  isActive: number
) => {
  const response = await fetch("http://localhost:4000/show", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ film, showPrice, showDay, beginTime, room, isActive }),
  });
  const data = await response.json();
  return data;
};

const updateShow = async (
  id: string,
  film: string,
  showPrice: number,
  showDay: Date,
  beginTime: Date,
  room: string,
  isActive: number
) => {
  const response = await fetch(`http://localhost:4000/show/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ film, showPrice, showDay, beginTime, room, isActive }),
  });
  const data = await response.json();
  return data;
};

const deleteShow = async (id: string) => {
  const response = await fetch(`http://localhost:4000/show/${id}`, { method: "DELETE" });
  const data = await response.json();
  return data;
};

export const ManageShow: React.FC = () => {
  const tableColumns: TableColumnsType<TableDataType> = [
    {
      title: "Id",
      width: 50,
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Film",
      dataIndex: "filmName",
      key: "filmName",
    },
    {
      title: "Show Price",
      dataIndex: "showPrice",
      key: "showPrice",
      render: (text: number) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "VND" }).format(text),
    },
    {
      title: "Show Day",
      dataIndex: "showDay",
      key: "showDay",
    },
    {
      title: "Begin Time",
      dataIndex: "beginTime",
      key: "beginTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
    },
    {
      title: "Action",
      key: "action",
      render: (values: any) => (
        <Space>
          <a
            onClick={() => {
              setSelectShowId(values.id);
              setFormUpdateData(values.id);
              setModalUpdateOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </a>
          <a
            onClick={() => {
              setSelectShowId(values.id);
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
  const [selectShowId, setSelectShowId] = useState<string | null>(null);
  const [formUpdate] = Form.useForm();
  const [filmList, setFilmList] = useState<any[]>([]);
  const [showTime, setShowTime] = useState<Dayjs>();

  useEffect(() => {
    showList().then((data: any) => {
      setTableData(data);
      setSearchedTableData(data);
    });
  }, [modalAddOpen, modalUpdateOpen, modalDeleteOpen]);

  useEffect(() => {
    activeFilmList().then((data: any) => {
      setFilmList(data);
    });
  }, []);

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const data = tableData.filter((tableData) => {
      return tableData.filmName.toLowerCase().includes(value.toLowerCase());
    });
    setSearchedTableData(data);
  };

  const setFormUpdateData = async (id: string) => {
    const data = await getOneShow(id);
    if (Object.keys(data).length > 0) {
      formUpdate.setFieldsValue({
        filmName: data.film,
        showPrice: data.showPrice,
        showDay: dayjs(data.showDay),
        showTime: dayjs(data.beginTime),
        room: data.room,
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
          Add Show
        </Button>
        <Input className="searchedInput" placeholder="Search show film" onChange={searchInput} />
      </Row>

      <Table
        className="table"
        columns={tableColumns}
        dataSource={searchedTableData}
        pagination={false}
      />

      <Modal
        className="modalAdd"
        open={modalAddOpen}
        footer={null}
        title="Add Show"
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
            await addShow(
              values.filmName,
              values.showPrice,
              values.showDay,
              showTime?.toDate() as Date,
              values.room,
              values.isActive
            );
            setModalAddOpen(false);
          }}
          initialValues={{ showDay: dayjs() }}
        >
          <Form.Item label="Film Name" name={"filmName"} required>
            <Select>
              {filmList.map((film) => (
                <Select.Option key={film.id} value={film.id}>
                  {film.filmName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Show Day" name={"showDay"} required>
            <DatePicker
              disabledDate={(currentDate) => {
                return currentDate && currentDate < dayjs().startOf("day");
              }}
            />
          </Form.Item>
          <Form.Item label="Show Time" name={"showTime"} required>
            <TimePicker
              needConfirm={false}
              disabledTime={() => {
                const hours: number[] = [];
                for (let i = 0; i < 6; i++) {
                  hours.push(i);
                }
                for (let i = 21; i < 24; i++) {
                  hours.push(i);
                }
                return {
                  disabledHours: () => hours,
                  disabledMinutes: () => [],
                  disabledSeconds: () => [],
                };
              }}
              format={"HH:00"}
              hideDisabledOptions={true}
              onChange={(time) => {
                setShowTime(time);
              }}
            />
            <Tooltip
              placement="topRight"
              title="Each show having 2 hours time, so the input here is the beginning time. it will automatical insert database ending time."
            >
              <FontAwesomeIcon className="tooltip-icon" icon={faCircleQuestion} />
            </Tooltip>
          </Form.Item>
          <FormItem label="Room" name={"room"} required>
            <Select>
              <Select.Option value="1">Room 1</Select.Option>
              <Select.Option value="2">Room 2</Select.Option>
              <Select.Option value="3">Room 3</Select.Option>
              <Select.Option value="4">Room 4</Select.Option>
            </Select>
          </FormItem>
          <Form.Item label="Show Price" name={"showPrice"} required>
            <InputNumber
              step={10000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              min={50000}
            />
          </Form.Item>
          <Form.Item label="Is Active" name={"isActive"} valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button onClick={() => setModalAddOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        className="modalUpdate"
        open={modalUpdateOpen}
        footer={null}
        title="Update Show"
        onCancel={() => {
          setModalUpdateOpen(false);
          setSelectShowId(null);
        }}
      >
        <Form
          form={formUpdate}
          className="formUpdate"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={async (values) => {
            updateShow(
              selectShowId ?? "0",
              values.filmName,
              values.showPrice,
              values.showDay,
              showTime?.toDate() as Date,
              values.room,
              values.isActive
            );
            setModalUpdateOpen(false);
            setSelectShowId(null);
          }}
        >
          <Form.Item label="Film Name" name={"filmName"}>
            <Select>
              {filmList.map((film) => (
                <Select.Option key={film.id} value={film.id}>
                  {film.filmName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Show Day" name={"showDay"}>
            <DatePicker
              disabledDate={(currentDate) => {
                return currentDate && currentDate < dayjs().startOf("day");
              }}
            />
          </Form.Item>
          <Form.Item label="Show Time" name={"showTime"}>
            <TimePicker
              needConfirm={false}
              disabledTime={() => {
                const hours: number[] = [];
                for (let i = 0; i < 6; i++) {
                  hours.push(i);
                }
                for (let i = 21; i < 24; i++) {
                  hours.push(i);
                }
                return {
                  disabledHours: () => hours,
                  disabledMinutes: () => [],
                  disabledSeconds: () => [],
                };
              }}
              format={"HH:00"}
              hideDisabledOptions={true}
              onChange={(time) => {
                setShowTime(time);
              }}
            />
            <Tooltip
              placement="topRight"
              title="Each show having 2 hours time, so the input here is the beginning time. it will automatical insert database ending time."
            >
              <FontAwesomeIcon className="tooltip-icon" icon={faCircleQuestion} />
            </Tooltip>
          </Form.Item>
          <FormItem label="Room" name={"room"}>
            <Select>
              <Select.Option value="1">Room 1</Select.Option>
              <Select.Option value="2">Room 2</Select.Option>
              <Select.Option value="3">Room 3</Select.Option>
              <Select.Option value="4">Room 4</Select.Option>
            </Select>
          </FormItem>
          <Form.Item label="Show Price" name={"showPrice"}>
            <InputNumber
              step={10000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              min={50000}
            />
          </Form.Item>
          <Form.Item label="Is Active" name={"isActive"} valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => setModalAddOpen(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={modalDeleteOpen}
        footer={null}
        title="Delete Show"
        onCancel={() => setModalDeleteOpen(false)}
      >
        <p>Are you sure you want to delete this show?</p>
        <Space>
          <Button
            type="primary"
            onClick={async () => {
              await deleteShow(selectShowId ?? "0");
              setModalDeleteOpen(false);
            }}
          >
            Yes
          </Button>
          <Button
            type="default"
            onClick={() => {
              setModalDeleteOpen(false);
              setSelectShowId(null);
            }}
          >
            No
          </Button>
        </Space>
      </Modal>
    </>
  );
};
