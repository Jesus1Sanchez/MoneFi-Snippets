import React, { useState, useEffect } from "react";
import Loki from "react-loki";
import "./loanApp.css";
import { Card } from "react-bootstrap";
import LoanAppBorrower from "./LoanAppBorrower";
import LoanAppStep1 from "./LoanAppStep1";
import LoanAppLocation from "./LoanAppLocation";
import LoanAppCollateral from "./LoanAppCollateral";
import LoanAppStep3 from "./LoanAppStep3";
import debug from "sabio-debug";
import lookUpService from "services/lookUpService";
import LoanApplicationConfirm from "./LoanApplicationConfirm";
import loanAppsService from "../../services/loanApplicationsService";
import toastr from "toastr";
import {
  FaMoneyBill,
  FaBusinessTime,
  FaPaperPlane,
  FaRegFolder,
  FaHouseUser,
  FaMapMarkedAlt,
} from "react-icons/fa";
const _logger = debug.extend("LoanApp");
function LoanApplication() {
  const [loanApplicationData, setLoanApplicationData] = useState({
    sSN: "",
    annualIncome: "",
    locationId: "",
    loanTerm: "",
    statusId: "3",
    borrowerStatusId: "3",
    loanAmount: "",
    loanTypeId: "",
    creditScore: "",
    preferredInterestRate: "",
    isBusinessIsBusiness: false,
    batchLoanFiles: [],
    batchBorrowerCollaterals: [],
  });
  const [lookUpTypes, setLookUpTypes] = useState({
    loanTypes: [],
    collateralTypes: [],
    loanTermTypes: [],
    creditRangeType: [],
  });
  const [valueGrabber, setValueGrabber] = useState({
    filesArray: [],
  });

  _logger("lookUpTypes Array", lookUpTypes);

  const LoanAppSteps = [
    {
      label: "Step 1",
      icon: <FaBusinessTime className="mt-3" />,
      component: (
        <LoanAppBorrower
          valueGrab={valueGrabber}
          loanProps={loanApplicationData}
          lookUps={lookUpTypes}
        />
      ),
    },
    {
      label: "Location",
      icon: <FaMapMarkedAlt className="mt-3" />,
      component: (
        <LoanAppLocation
          valueGrab={valueGrabber}
          loanProps={loanApplicationData}
          lookUps={lookUpTypes}
        />
      ),
    },
    {
      label: "Step 2",
      icon: <FaMoneyBill className="mt-3" />,
      component: (
        <LoanAppStep1
          valueGrab={valueGrabber}
          loanProps={loanApplicationData}
          lookUps={lookUpTypes}
        />
      ),
    },
    {
      label: "Collateral",
      icon: <FaHouseUser className="mt-3" />,
      component: (
        <LoanAppCollateral
          valueGrab={valueGrabber}
          loanProps={loanApplicationData}
          lookUps={lookUpTypes}
        />
      ),
    },
    {
      label: "Step 4",
      icon: <FaRegFolder className="mt-3" />,
      component: (
        <LoanAppStep3
          valueGrab={valueGrabber}
          loanProps={loanApplicationData}
          lookUps={lookUpTypes}
        />
      ),
    },
    {
      label: "ConfirmPage",
      icon: <FaPaperPlane className="mt-3" />,
      component: (
        <LoanApplicationConfirm
          valueGrab={valueGrabber}
          loanProps={loanApplicationData}
          lookUps={lookUpTypes}
        />
      ),
    },
  ];

  useEffect(() => {
    lookUpService
      .getTypes([
        "LoanTypes",
        "CollateralTypes",
        "CreditRangeType",
        "LoanTermTypes",
      ])
      .then(onGetTypesSuccess)
      .catch(onGetTypesError);
  }, []);

  const onGetTypesSuccess = (response) => {
    _logger("onGetTypesSuccess", response.item);
    if (response.item)
      setLookUpTypes({
        loanTypes: response.item.loanTypes,
        collateralTypes: response.item.collateralTypes,
        creditRangeType: response.item.creditRangeType,
        loanTermTypes: response.item.loanTermTypes,
      });
  };
  const onGetTypesError = (error) => {
    _logger("onGetTyppesError", error);
  };

  const mergeValues = (values) => {
    _logger("Aplication Values being passed", values);
    _logger(valueGrabber);

    setValueGrabber((prevState) => {
      const filepd = { ...prevState };

      filepd.filesArray = values.filesArray;
      _logger("inside valueGrabber", filepd);
      return filepd;
    });

    setLoanApplicationData((prevState) => {
      const pd = { ...prevState };

      pd.sSN = values.sSN;
      pd.annualIncome = values.annualIncome;
      pd.locationId = values.locationId;
      pd.loanTerm = values.loanTerm;
      pd.loanAmount = values.loanAmount;
      pd.loanTypeId = values.loanTypeId;
      pd.creditScore = values.creditScore;
      pd.preferredInterestRate = values.preferredInterestRate;
      pd.isBusinessIsBusiness = values.isBusinessIsBusiness;
      pd.batchLoanFiles = values.batchLoanFiles;
      pd.batchBorrowerCollaterals = values.batchBorrowerCollaterals;

      _logger("pd", pd);
      return pd;
    });
    _logger("OnMerge App Data", loanApplicationData, valueGrabber);
  };

  const onFinishLoki = () => {
    _logger("finish BTN CLicked", loanApplicationData);
    loanAppsService
      .add(loanApplicationData)
      .then(onLoanAppAddSuccess)
      .catch(onLoanAppAddError);
  };
  const onLoanAppAddSuccess = (response) => {
    _logger("yay!", response);
    toastr.success("Success", "Loan Has Been Submitted");
  };
  const onLoanAppAddError = (error) => {
    _logger("error boooooooo", error);
    toastr.error("Error", "Check values and try again");
  };

  return (
    <React.Fragment>
      <div className="d-flex justify-content-center p-5">
        <div className="col-lg-6 col-md-10 col-sm-10 col-12">
          <Card className="p-5 loan-Loki">
            <Loki
              steps={LoanAppSteps}
              onNext={mergeValues}
              onBack={mergeValues}
              onFinish={onFinishLoki}
              noActions
            />
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LoanApplication;