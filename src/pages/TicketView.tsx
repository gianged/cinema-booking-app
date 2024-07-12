import { Card } from "antd";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const getTicket = async (idUser: string) => {
    const response = await fetch(`http://localhost:4000/ticket/userview/${idUser}`);
    const data = await response.json();
    return data;
};

export const TicketView: React.FC = () => {
    const [ticketList, setTicketList] = useState<any[]>([]);
    const [authenticateCookie] = useCookies(["authenticate"]);

    useEffect(() => {
        getTicket(authenticateCookie.authenticate.id).then((data) => {
            setTicketList(data);
        });
    }, [authenticateCookie.authenticate]);

    return (
        <>
            {ticketList.map((ticket) => {
                if (ticket.ShowSchedule) {
                    return (
                        <Card>
                            <h1>{ticket.ShowSchedule.Film.filmName}</h1>
                            <p>{ticket.ShowSchedule.showDay}</p>
                            <p>{`${ticket.ShowSchedule.beginTime} - ${ticket.ShowSchedule.endTime}`}</p>
                        </Card>
                    );
                } else {
                    return null; // or return some default component
                }
            })}
        </>
    );
};
