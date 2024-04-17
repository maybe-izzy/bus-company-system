import React, { useEffect, useState, useCallback } from "react";
import BusForm from "../../components/BusForm";
import PageTitle from "../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Tag, Table } from "antd";
import { Helmet } from "react-helmet";

function AdminBuses() {
  const dispatch = useDispatch();
  const [showBusForm, setShowBusForm] = useState(false);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [busStops, setBusStops] = useState([]);

  const getBuses = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/buses/get-all-buses", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setBuses(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const deleteBus = async (_id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(`/api/buses/${_id}`, {});

      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBuses();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
    },
    {
      title: "Stops",
      dataIndex: "stops",
      render: (tags) => (
        <>
          {tags
            .map((tag) => {
              return <Tag key={tag}>{tag}</Tag>;
            })
            .reduce((prev, curr) => [prev, ", ", curr])}
        </>
      )
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        if (status === "Completed") {
          return <span className="text-red-500">{status}</span>;
        } else if (status === "running") {
          return <span className="text-yellow-500">{status}</span>;
        } else {
          return <span className="text-green-500">{status}</span>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (actions, record) => (
        <div className="flex gap-3">
          <i
            className="ri-delete-bin-line cursor-pointer text-red-500 text-xl"
            onClick={() => deleteBus(record._id)}
          ></i>

          <i
            className="ri-pencil-line cursor-pointer text-xl"
            onClick={() => {
              setSelectedBus(record);
              setShowBusForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBuses();
  }, [getBuses]);

  return (
    <>
      <Helmet>
        <title>Buses</title>
      </Helmet>
      <div>
        <div className="flex justify-between p-7">
          <PageTitle title="Bus Manager" />
          <button
            type="submit"
            className="relative px-10 py-2.5 transition-all ease-in duration-75 bg-white outline outline-1 hover:bg-zinc-200 rounded-md"
            onClick={() => setShowBusForm(true)}
          >
              Add Bus
          </button>
        </div>
        <div className="p-7">
          <Table
            columns={columns}
            dataSource={buses}
            pagination={{ pageSize: 7 }}
          />
          {showBusForm && (
            <BusForm
              showBusForm={showBusForm}
              setShowBusForm={setShowBusForm}
              type={selectedBus ? "edit" : "add"}
              selectedBus={selectedBus}
              setSelectedBus={setSelectedBus}
              getData={getBuses}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AdminBuses;
