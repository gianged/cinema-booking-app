import React, { useState, useEffect } from "react";
import "./ManageFilm.scss";
import { Blob } from "buffer";
import { Table, TableColumnsType } from "antd";
import { displayImageFromBuffer } from "../convert";

interface TableDataType {
  key: React.Key;
  id: number;
  filmName: string;
  filmDescription: string;
  poster: string;
  backdrop: string;
  premiere: Date;
  trailer: string;
  isActive: boolean;
}

const filmList = async () => {
  const response = await fetch("http://localhost:4000/film", { method: "GET" });
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

  const [tableList, setTableList] = useState<TableDataType[]>([]);
  const [searchedTableList, setSearchedTableList] = useState<TableDataType[]>([]);

  useEffect(() => {
    filmList().then((data: any) => {
      data.forEach((item: any) => {
        item.poster = displayImageFromBuffer(item.poster.data);
        item.backdrop = displayImageFromBuffer(item.backdrop.data);
      });
      setTableList(data);
      setSearchedTableList(data);
    });
  }, []);

  return (
    <>
      <Table columns={tableColumns} dataSource={searchedTableList} />
    </>
  );
};
