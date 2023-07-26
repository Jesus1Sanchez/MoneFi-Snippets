import axios from "axios";
import * as helper from "./serviceHelpers";

const endpoint =  `${helper.API_HOST_PREFIX}/api/loanapplications`;

const getLoanApps = (pageIndex, pageSize) =>{
    const config = {
      method: "GET",
      url: `${endpoint}/paginated/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" }
    };
  
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

  const searchByTypeLoanApps = (pageIndex, pageSize, typeId) =>{
    const config = {
      method: "GET",
      url: `${endpoint}/type/?pageIndex=${pageIndex}&pageSize=${pageSize}&loanTypeId=${typeId}`,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

  const searchByuser = (query,pageIndex, pageSize) =>{
    const config = {
      method: "GET",
      url: `${endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  };

  const add = (payload) => {
    const config = {
      method: "POST", 
      url: `${endpoint}`,
      data: payload,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };

    return axios(config)
    .then(helper.onGlobalSuccess).catch(helper.onGlobalError);
  }; 

  const loanAppsService = {getLoanApps, searchByTypeLoanApps, add,searchByuser};

  export default loanAppsService;