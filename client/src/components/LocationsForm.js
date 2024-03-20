import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Row, Form, Col, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function LocationsForm({
  showLocationsForm,
  setShowLocationsForm,
  type = "add",
  getData,
  selectedLocation,
  setSelectedLocation,
}) {
  const dispatch = useDispatch();
  const [locations, setLocations] = useState([]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/api/locations/add-location", values);
      } else {
        response = await axiosInstance.put(
          `/api/locations/${selectedLocation._id}`,
          values
        );
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowLocationsForm(false);
      setSelectedLocation(null);
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    axiosInstance.post("/api/locations/get-all-locations").then((response) => {
      setLocations(response.data.data);
    });
  }, []);

  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Location" : "Update Location"}
      visible={showLocationsForm}
      onCancel={() => {
        setSelectedLocation(null);
        setShowLocationsForm(false);
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedLocation}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item
              label="Location Name"
              name="location_name"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input location name",
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
        
        </Row>
        <div className="flex justify-end">
          <button
            type="submit"
            className="relative inline-flex items-center justify-start
                px-10 py-3 overflow-hidden font-bold rounded-full
                group"
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
              Save
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default LocationsForm;
