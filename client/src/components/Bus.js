import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Bus({ bus }) {
  const navigate = useNavigate();
  

  return (
    <>
      <div className="max-w-full bg-white flex flex-col rounded overflow-hidden shadow-lg">
        <div className="flex flex-row items-baseline flex-nowrap bg-gray-100 p-2">
          <h1 className="ml-2 uppercase font-bold">Journey Date</h1>
          <p className="ml-2 font-base text-gray-500">{bus.journeyDate}</p>
        </div>
        <div className="mt-2 flex justify-start bg-white p-2"></div>
        <div className="mt-2 flex sm:flex-row mx-6 sm:justify-between flex-wrap ">
          <div className="flex flex-row place-items-center p-2">
            <div className="flex flex-col ml-2">
              <p className="text-base font-bold">{bus.bus.name}</p>
            </div>
          </div>

          <div className="flex flex-col p-2">
            <p className="font-bold">Departure Time</p>
            <p className="font-base">
              {moment(bus.departure, "HH:mm").format("hh:mm A")}
            </p>

            <p className="font-bold">From </p>
            <p className="text-gray-500">{bus.from}</p>
          </div>
          <div className="flex flex-col flex-wrap p-2">
            <p className="font-bold">Arrival Time</p>
            <p className="font-base">
              {moment(bus.arrival, "HH:mm").format("hh:mm A")}
            </p>

            <p className="font-bold">To</p>

            <p className="text-gray-500">{bus.to}</p>
          </div>
        </div>
        <div className="mt-4 bg-gray-100 flex flex-row flex-wrap md:flex-nowrap justify-between items-baseline">
          <div className="flex mx-6 py-4 flex-row flex-wrap">
           

            <div className="text-sm mx-2 flex flex-col">
              <p className="font-bold text-base">Price</p>
              <p className="font-base">{bus.bus.price} $</p>
            </div>
          </div>
          <div className="md:border-l-2 mx-6 md:border-dotted flex flex-row py-4 mr-6 flex-wrap">
            <button
              className="relative px-10 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0"
              onClick={() => {
                if (localStorage.getItem("user_id")) {
                  // Pass bus details as query params 
                  navigate(`/book-now/${bus.bus._id}/${bus.departure}/${bus.arrival}/${bus.from}/${bus.to}`); // Here!!
                  //navigate(`/book-now/${bus._id}`); // Here!!
                } else {
                  navigate(`/login`);
                }
                // clear local storage
                localStorage.removeItem("idTrip");
                // set id trip local storage
                localStorage.setItem("idTrip", bus._id);
              }}
            >
                Book Now
        
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Bus;
