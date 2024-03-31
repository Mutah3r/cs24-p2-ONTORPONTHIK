import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  config => {
    // Intercept request before it is sent
    const token = JSON.parse(localStorage.getItem('user'));
    axios.get(`http://localhost:8000/profile?token=${token}`).then(res => {
        console.log('from axios interceptor')    
        console.log(res.data);
        if(!res.data?.email || !res.data?.role || !res.data?.id){
            // logout user
            localStorage.removeItem('user');
            window.location = '/login';
            console.log('session expired')
        }
    })
    .catch(() => {
        console.log('from axios interceptor')    
        // logout user
        localStorage.removeItem('user');
        window.location = '/login';
        console.log('session expired')
    })
    return config;
},
    error => {
      console.log('from axios interceptor')    
    // logout user
    localStorage.removeItem('user');
    window.location = '/login';
    console.log('session expired')
    return Promise.reject(error);
  }
);

export default axiosInstance;
