import React, { useState, useEffect } from "react";
import Loki from "react-loki";
import "./loanApp.css";
import { Card } from "react-bootstrap";
import LoanAppBorrower from "./LoanAppBorrower";
import LoanAppStep1 from "./LoanAppStep1";
import LoanAppStep2 from "./LoanAppLocation";
import LoanAppCollateral from "./LoanAppCollateral";
import LoanAppStep3 from "./LoanAppStep3";
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
        <LoanAppStep2
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
    if (response.item)
      setLookUpTypes({
        loanTypes: response.item.loanTypes,
        collateralTypes: response.item.collateralTypes,
        creditRangeType: response.item.creditRangeType,
        loanTermTypes: response.item.loanTermTypes,
      });
  };
  const onGetTypesError = (error) => {};

  const mergeValues = (values) => {
    setValueGrabber((prevState) => {
      const pd = { ...prevState };

      pd.filesArray = values.filesArray;
      return pd;
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
      return pd;
    });
  };

  const onFinishLoki = () => {
    loanAppsService
      .add(loanApplicationData)
      .then(onLoanAppAddSuccess)
      .catch(onLoanAppAddError);
  };
  const onLoanAppAddSuccess = (response) => {
    toastr.success("Success", "Loan Has Been Submitted");
  };
  const onLoanAppAddError = (error) => {
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
