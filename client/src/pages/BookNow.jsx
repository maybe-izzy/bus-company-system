import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import { Helmet } from "react-helmet";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";

function BookNow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);

  // Access query parameters 
  const from = params.fromLocation; 
  const to = params.toLocation; 
  const arrival = params.toTime; 
  const departure = params.fromTime; 

  const getBus = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`/api/buses/${params.id}`); 
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(params); 
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  const bookNow = async (transactionId) => {

    try {
      console.log(arrival); 
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `/api/bookings/book-seat/${localStorage.getItem("user_id")}`,
        {
          bus: bus._id,
          seats: selectedSeats,
          from, 
          to, 
          departure,
          arrival,
          transactionId
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const processBooking = async () => {
    const transactionId = uuidv4();
    
    try {
      bookNow(transactionId);
      
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, [getBus]);
  return (
    <>
      <Helmet>
        <title>Book Now</title>
      </Helmet>
      <div>
        {bus && (
          <Row className="m-3 p-5" gutter={[30, 30]}>
            <Col lg={12} xs={24} sm={24}>
              <h1 className="font-extrabold text-2xl text-white">
                {bus.name}
              </h1>
              
              <hr className="border-blue-600" />

              <div className="flex flex-col gap-1 ">
                <h1 className="text-lg">
                  <b className="text-white">From : </b>
                  <span className="text-blue-600">{from}</span>
                </h1>
                <h1 className="text-lg">
                  <b className="text-white">To : </b>
                  <span className="text-blue-600">{to}</span>
                </h1>
                
                <h1 className="text-lg">
                  <b className="text-white">Journey Date : </b>
                  <p className="text-blue-600">{bus.journeyDate}</p>
                </h1>

                <h1 className="text-lg">
                  <b className="text-white">Price :</b> <span className="text-blue-600">{"$"}{""}{bus.price}</span>
                </h1>
                <h1 className="text-lg">
                  <b className="text-white">Departure Time : </b> {" "}
                  <p className="text-blue-600">{moment(departure, "HH:mm").format("hh:mm A")}</p>
                </h1>
                <h1 className="text-lg">
                  <b className="text-white">Arrival Time : </b> <p className="text-blue-600">{" "}
                  {moment(arrival, "HH:mm").format("hh:mm A")}</p>
                </h1>
              </div>
              <hr className="border-blue-600" />

              <div className="flex w-60 flex-col ">
                <h1 className="text-lg mt-2 font-bold">
                  <span className="text-white italic">Capacity : </span>{" "}
                  <span className="text-blue-600">{bus.capacity}</span>
                </h1>
                <h1 className="text-lg font-bold">
                  <span className="text-white">Seats Left : </span>{" "}
                  <span className="text-blue-600">{bus.capacity - bus.seatsBooked.length}</span>
                </h1>
              </div>
              <hr className="border-blue-600" />

              <div className="flex flex-col gap-2 w-48 ">
                <h1 className="text-xl">
                  <b className="text-white">Selected Seats : </b>{" "}
                  <p className="text-blue-600">{selectedSeats.join(", ")}</p>
                </h1>
                <h1 className="text-xl mt-2 mb-3">
                  <b className="text-white"> Price :</b> <p className="text-blue-600">{"$"}{""}
                  {bus.price * selectedSeats.length}</p>
                </h1>

                
                  <button
                    onClick={() => processBooking()}
                    className={`${
                      selectedSeats.length === 0
                        ? "animate-none cursor-not-allowed btn btn-primary py-2 px-5 rounded-full btn-disabled text-white"
                        : "btn btn-primary py-2 px-5 rounded-full bg-blue-600 hover:bg-blue-800 hover:duration-300 text-white"
                    }`}
                  >
                  Book Seat
                  </button>
             
              </div>
            </Col>
            <Col lg={12} xs={24} sm={24}>
              <SeatSelection
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                bus={bus}
              />
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default BookNow;
