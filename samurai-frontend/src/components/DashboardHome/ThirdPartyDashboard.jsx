import axios from "axios";
import { useEffect, useState } from "react";

const ThirdPartyDashboard = () => {
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
};

export default ThirdPartyDashboard;