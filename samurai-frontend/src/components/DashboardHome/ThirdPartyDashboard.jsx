import axios from "axios";
import { useEffect, useState } from "react";

const ThirdPartyDashboard = () => {
<<<<<<< HEAD
    return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4 text-center">Third-Party Contractor Dashboard</h1> 

          <div className="overflow-x-auto pb-4">
                <table className="table table-zebra">
                <thead>
                    <tr>
                    <th></th>
                    <th>Company Name</th>
                    <th>Reg. ID</th>
                    <th>Reg. Date</th>
                    <th>TIN</th>
                    <th>Contact number</th>
                    <th>Workforce size</th>
                    <th>Payment per tonnage of waste</th>
                    <th>The required amount of waste per day</th>
                    <th>Contract duration</th>
                    <th>Area of collection</th>
                    <th>Designated STS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td>Reg-No:19</td>
                        <td>5/10/2024</td>
                        <td>5214789652</td>
                        <td>0176666666</td>
                        <td>250</td>
                        <td>150 Tk</td>
                        <td>2 Ton</td>
                        <td>5 years</td>
                        <td>Dhaka Uttara</td>
                        <td>10</td>
                    </tr>
                </tbody>
                </table>
            </div>          
        </div>
    );
=======
  // states
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // load user profile
  useEffect(() => {
    axios.get(`http://localhost:8000/profile?token=${JSON.parse(localStorage.getItem('user'))}`)
      .then(res => {
        setUser(res.data);
      });
  }, []);

  // load user roles
  useEffect(() => {
    axios
      .get("http://localhost:8000/rbac/roles")
      .then((res) => {
        setRoles(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  },[]);



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Third-Party Contractor Dashboard</h1>
    </div>
  );
>>>>>>> 0b8909c069a40225b15650241f4049e16243f2cc
};

export default ThirdPartyDashboard;