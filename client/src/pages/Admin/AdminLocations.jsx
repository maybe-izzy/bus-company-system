import React, { useEffect, useState, useCallback } from "react";
import LocationsForm from "../../components/LocationsForm";
import PageTitle from "../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import { Helmet } from "react-helmet";

function AdminLocations() {
  const dispatch = useDispatch();
  const [showLocationsForm, setShowLocationsForm] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const getLocations = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/api/locations/get-all-locations", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setLocations(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const deleteLocation = async (_id) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(`/api/locations/${_id}`, {});

      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getLocations();
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
      title: "Location Name",
      dataIndex: "location_name",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (actions, record) => (
        <div className="flex gap-3">
          <i
            className="ri-delete-bin-line cursor-pointer text-red-500 text-xl"
            onClick={() => deleteLocation(record._id)}
          ></i>

          <i
            className="ri-pencil-line cursor-pointer text-xl"
            onClick={() => {
              setSelectedLocation(record);
              setShowLocationsForm(true);
            }}
          ></i>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getLocations();
  }, [getLocations]);

  return (
    <>
      <Helmet>
        <title>Locations</title>
      </Helmet>
      <div>
        <div className="flex justify-between p-7">
          <PageTitle title="Locations" />
          <button
            type="submit"
            className="relative inline-flex items-center justify-start
                px-10 py-3 overflow-hidden font-bold rounded-full
                group"
            onClick={() => setShowLocationsForm(true)}
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
              Add Location
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
        </div>
        <div className="p-7">
          <Table
            columns={columns}
            dataSource={locations}
            pagination={{ pageSize: 7 }}
          />
          {showLocationsForm && (
            <LocationsForm
              showLocationsForm={showLocationsForm}
              setShowLocationsForm={setShowLocationsForm}
              type={selectedLocation ? "edit" : "add"}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              getData={getLocations}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AdminLocations;

