import { useEffect, useState } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { MdOutlinePendingActions } from "react-icons/md";
import Swal from "sweetalert2";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/app/feedback").then((res) => {
      console.log(res.data);
      setNotifications(res.data.reverse());
    });
  }, [refetch]);

  const updateSeenStatus = (feedbackId) => {
    // Step-1: make a network call to update the seen status
    axios
      .post(`http://localhost:8000/thirdparties/changeseenstatus`, {
        feedbackId: feedbackId,
      })
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          title: "Marked as read!",
          icon: "success",
        });
        setRefetch(!refetch);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
        <h1 className="text-2xl font-semibold mb-4">Notifications</h1>
      </div>

      <div className="flex flex-col gap-3">
        {notifications &&
          notifications.map((noti) => {
            return (
              <div key={noti._id} className="card w-full bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-end">
                    {noti && !noti.seen_status ? (
                      <div className="flex gap-2">
                        <span className="badge badge-warning">Pending</span>
                        <button className="badge badge-info" onClick={() => updateSeenStatus(noti._id)}>Mark as read</button>
                      </div>
                    ) : (
                      <>
                        <span className="badge badge-success">Marked as read</span>
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-2 mb-3">
                    <h3>
                      <span className="font-semibold">Notification Type:</span>{" "}
                      {noti.type}
                    </h3>
                    <h3>
                      <span className="font-semibold">User's Email:</span>{" "}
                      {noti.user_email}
                    </h3>
                    <h3>
                      <span className="font-semibold">User's Profession:</span>{" "}
                      {noti.role}
                    </h3>
                    <h3>
                      <span className="font-semibold">User's Location:</span>{" "}
                      {noti.location}
                    </h3>
                  </div>
                  <h3>
                    <span className="font-semibold">Description:</span>{" "}
                    {noti.description}
                  </h3>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Notifications;
