import { Table, TableColumnsType } from "antd";
import React, { useEffect } from "react";

interface TableDataType {
    key: React.Key;
    id: number;
    username: string;
    filmName: string;
    ticketAmount: number;
    totalPrice: number;
}

const TicketList = async () => {
    const response = await fetch("http://localhost:4000/ticket");
    const data = await response.json();
    return data;
};

export const ManageTicket: React.FC = () => {
    const tableColumns: TableColumnsType<TableDataType> = [
        {
            title: "Id",
            width: 50,
            dataIndex: "idTicket",
            key: "id",
        },
        {
            title: "Username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Film Name",
            dataIndex: "filmName",
            key: "filmName",
        },
        {
            title: "Ticket Amount",
            dataIndex: "ticketAmount",
            key: "ticketAmount",
        },
        {
            title: "Total Price",
            dataIndex: "totalPrice",
            key: "totalPrice",
        },
    ];

    const [data, setData] = React.useState<TableDataType[]>([]);

    useEffect(() => {
        TicketList().then((data) => {
            setData(data);
        });
    }, []);

    return (
        <>
            <Table columns={tableColumns} dataSource={data} pagination={false} />
        </>
    );
};
