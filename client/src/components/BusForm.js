import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Row, Col, Form, Button, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import moment from 'moment'; 
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function BusForm({
  showBusForm,
  setShowBusForm,
  type = "add",
  getData,
  selectedBus,
  setSelectedBus,
}) {
  const dispatch = useDispatch();
  const [busStops, setBusStops] = useState([{ name: "", time: "" }]);
  //onst [busStops, setBusStops] = useState([{ name: "" }]); // New state for bus stop times 
  const [busStopsError, setBusStopsError] = useState(false);

// Other states remain the same...
const [form] = Form.useForm();
const firstUpdate = useRef(true); // To prevent useEffect from running on initial render

useEffect(() => {
  // Populate the form with `selectedBus` data when editing
  if (type === "edit" && selectedBus) {
    const formattedStops = selectedBus.stops.map((stop, index) => ({
      name: stop,
      time: selectedBus.stopTimes[index] || "" // Use || "" to handle any undefined cases
    }));
    setBusStops(formattedStops);

    // If not the first render, update form values dynamically
    if (!firstUpdate.current) {
      form.setFieldsValue({
        ...selectedBus,
        stops: formattedStops.map(stop => stop.name) // Assuming you want to show stop names
      });
    }
  } else {
    form.resetFields(); // Reset form fields when not editing
  }

  firstUpdate.current = false; // Mark first update as done
}, [selectedBus, type, form]);


  
  
  const onFinish = async (values) => {
    /* Check bus form for input errors */ 

    // Make sure that all bus stop fields are completely filled 
    const allStopsFilled = busStops.every(stop => stop.name.trim() !== "" && stop.time.trim() !== "");
    if (!allStopsFilled || busStops.length < 2) {
      message.error('Please add at least two bus stops and ensure all bus stop fields are complete before submitting.');
      setBusStopsError(true); // Indicate there's an error with bus stops
      return; 
    }

    // Make sure that the time associated with each location is after
    // the previous time
    let isSequential = true;
    for (let i = 0; i < busStops.length - 1; i++) {
      const currentTime = moment(busStops[i].time, "HH:mm");
      const nextTime = moment(busStops[i + 1].time, "HH:mm");
      if (!nextTime.isAfter(currentTime)) {
        isSequential = false;
        break;
      }
    }

    if (!isSequential) {
      message.error('Each bus stop time must be after the previous time.');
      return; 
    }  

    // Make sure that the value for price is within the valid range 
    const price = values.price; 
    if (price <= 0) {
      message.error("Please enter a valid price.");
      return; // Prevent form submission
    }

    // Make sure that the input price can be represented as a US dollar amount 
    const priceString = price.toString();
    const decimalPosition = priceString.indexOf('.');
    const precision = decimalPosition !== -1 ? priceString.length - decimalPosition - 1 : 0;
    
    if (precision > 2) {
      message.error('Input price cannot have more than two decimal places. Please enter a valid price.');
      return; 
    }
  
    // Make sure that the value for price is within the valid range 
    const capacity = values.capacity; 
    if (capacity <= 0) {
      message.error("Capacity must be greater than or equal to 1.");
      return; // Prevent form submission
    }
    
 try {
    if (busStops.length <= 1) {
      // Display an error message if no bus stops are added
      message.error('Please add at least two bus stops before submitting.');
      return; // Stop the submission process
    }
      dispatch(ShowLoading());
    
      const payload = {   ...values,
        stops: busStops.map(stop => stop.name) , stopTimes: busStops.map(stop => stop.time)}; // Transform busStops for backend
        
      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/api/buses/add-bus", payload);
      } else {
        response = await axiosInstance.put(`/api/buses/${selectedBus._id}`, payload);
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowBusForm(false);
      setSelectedBus(null);
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };


  const addBusStop = () => {
    if (busStops.length < 5) {
      setBusStops([...busStops, { name: "", time: "" }]);
    } else {
      message.warning('You cannot add more than 5 bus stops.');
    }
  };
  
  const removeBusStop = (index) => {
    const newBusStops = [...busStops];
    newBusStops.splice(index, 1);
    setBusStops(newBusStops);
  };

  const handleBusStopChange = (e, index) => {
    const newBusStops = [...busStops];
    newBusStops[index].name = e.target.value;
    setBusStops(newBusStops);
  };


  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Bus" : "Update Bus"}
      visible={showBusForm}
      onCancel={() => {
        setSelectedBus(null);
        setShowBusForm(false);
      }}
      footer={false}
    >
     <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues= {selectedBus ? { ...selectedBus, stops: busStops.map(stop => stop.name) } : {status: "Yet to start"}}
      >
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item
              label="Bus Name"
              name="name"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message:
                    type === "add"
                      ? "Please enter bus name"
                      : "Please enter bus name",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Bus Number"
              name="busNumber"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input bus number!",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Capacity"
              name="capacity"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input bus capacity!",
                },
              ]}
            >
              <input
                type="number"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          
          <Col lg={8} xs={24}>
            <Form.Item
              label="Journey Date"
              name="journeyDate"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input journey date!",
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <input
                min={moment().format('YYYY-MM-DD')} 
                type="date"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input price!",
                },
              ]}
            >
              <input
                type="number"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: type === "add" ? true : true,
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <select
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                name=""
                id=""
              >
                <option value="Yet to start">Yet To Start</option>
                <option value="Running">Running</option>
                <option disabled value="Completed">
                  Completed
                </option>
              </select>
            </Form.Item>
          </Col>
        </Row>
          {/* Dynamic Bus Stops Inputs */}

          {busStops.map((stop, index) => (
  <Row key={index} gutter={10}>
    <Col span={12}>
      <Form.Item
        label={`Bus Stop #${index + 1} Name`}
        validateStatus={busStopsError && !stop.name.trim() ? 'error' : ''}
        help={busStopsError && !stop.name.trim() ? 'Please input bus stop name!' : null}
      >
        <input
          type="text"
          placeholder="Enter bus stop"
          value={stop.name}
          onChange={(e) => {
            const newBusStops = [...busStops];
            newBusStops[index].name = e.target.value;
            setBusStops(newBusStops);
            if (busStopsError) setBusStopsError(false); // Reset error state on change
          }}
          className="block border border-blue-500 w-full p-3 rounded-lg"
        />
      </Form.Item>
    </Col>
    <Col span={12}>
      <Form.Item
        label={`Bus Stop #${index + 1} Time`}
        validateStatus={busStopsError && !stop.time.trim() ? 'error' : ''}
        help={busStopsError && !stop.time.trim() ? 'Please input bus stop time!' : null}
      >
        <input
          type="time"
          placeholder="HH:MM"
          value={stop.time}
          onChange={(e) => {
            const newBusStops = [...busStops];
            newBusStops[index].time = e.target.value;
            setBusStops(newBusStops);
            if (busStopsError) setBusStopsError(false); // Reset error state on change
          }}
          className="block border border-blue-500 w-full p-3 rounded-lg"
        />
      </Form.Item>
    </Col>
    <Col span={24}>
      <Button
        type="danger"
        onClick={() => removeBusStop(index)}
        disabled={busStops.length === 1}
      >
        Remove Stop
      </Button>
    </Col>
  </Row>
))}
        <Button
          type="primary"
          onClick={addBusStop}
          disabled={busStops.length >= 5}
        >
          Add Bus Stop
        </Button>
        <div className="flex justify-end">
          <button
            type="submit"
           className="relative px-10 py-2.5 transition-all ease-in duration-75 bg-white outline outline-1 hover:bg-gray-200 rounded-md"
          >
          
              Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default BusForm;
