import React from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { withFormik } from "formik";
import CollateralLoanConfirmCoard from "./loancards/CollateralLoanConfirmCard";

function LoanApplicationConfirm(props) {
  const {
    values,
    loanProps,
    nextLabel,
    backLabel,
    handleSubmit,
    onBack,
    lookUps,
  } = props;

  const onBackClick = () => {
    onBack(values);
  };
  const isBusiness = () => {
    let bLoan = "No";
    if (values.isBusinessIsBusiness === true) {
      bLoan = "Yes";
    }
    return bLoan;
  };

  const colMap = (arr, index) => {
    const filterType = (indCol) => {
      var result = false;
      if (indCol.id === parseInt(arr.collateralTypeId)) {
        return true;
      }

      return result;
    };

    let colName = lookUps.collateralTypes
      .filter(filterType)
      .map((filteredType) => {
        return (arr.colName = filteredType.name);
      });

    return (
      <CollateralLoanConfirmCoard
        className=" my-2"
        key={index}
        arrProps={arr}
        index={index}
      ></CollateralLoanConfirmCoard>
    );
  };

  return (
    <React.Fragment>
      <Card className="col-md-10 mx-auto p-5">
        <Card.Header className="d-flex">
          <h3>Please confirm the details below are correct </h3>
        </Card.Header>

        <div className="row ">
          <div className="col-6">
            <Card.Header>
              <h5>Loan Term: {values.loanTerm} </h5>
            </Card.Header>
          </div>
          <div className="col-6">
            <Card.Header>
              <h5>Loan Amount: {values.loanAmount}$ </h5>
            </Card.Header>
          </div>
        </div>
        <div className="row ">
          <div className="col-6">
            <Card.Header>
              <h5>Buisness loan: {isBusiness()}</h5>
            </Card.Header>
          </div>
          <div className="col-6">
            <Card.Header>
              <h5>Interest Rate: {values.preferredInterestRate}%</h5>
            </Card.Header>
          </div>
        </div>
        <div className="row ">
          <div className="col-6">
            <Card.Header>
              <h5>Credit Score: </h5>
              <div>{values.creditScore}</div>
            </Card.Header>
          </div>
          <div className="col-6">
            <Card.Header>
              <h5>Loan Type: </h5>
              <div>
                {lookUps.loanTypes
                  .filter(
                    (indvType) => indvType.id === parseInt(values.loanTypeId)
                  )
                  .map((filteredType) => (
                    <div key={filteredType.id}> {filteredType.name}</div>
                  ))}
              </div>
            </Card.Header>
          </div>
          <div className="col-12 text-center">
            <Card.Header>
              <h5>Borrower Collateral</h5>
              <div className="row my-2">
                {values.batchBorrowerCollaterals.map(colMap)}
              </div>
            </Card.Header>
          </div>
        </div>

        <div className="button-group text-center mt-3">
          <button
            type="button"
            className="btn btn-secondary mx-2"
            onClick={onBackClick}
          >
            {backLabel}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            {nextLabel}
          </button>
        </div>
      </Card>
    </React.Fragment>
  );
}

LoanApplicationConfirm.propTypes = {
  loanProps: PropTypes.shape({
    loanTerm: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
    preferredInterestRate: PropTypes.number.isRequired,
    creditScore: PropTypes.number.isRequired,
    isBusinessIsBusiness: PropTypes.bool.isRequired,
  }).isRequired,
  values: PropTypes.shape({
    loanTerm: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
    preferredInterestRate: PropTypes.number.isRequired,
    creditScore: PropTypes.number.isRequired,
    isBusinessIsBusiness: PropTypes.bool.isRequired,
    filesArray: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string.isRequired,
      })
    ),
    batchBorrowerCollaterals: PropTypes.arrayOf(
      PropTypes.shape({
        borrowerId: PropTypes.number.isRequired,
        collateralTypeId: PropTypes.number.isRequired,
        amount: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  lookUps: PropTypes.shape({
    collateralTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    loanTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    loanType: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  backLabel: PropTypes.string.isRequired,
  nextLabel: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

export default withFormik({
  mapPropsToValues: (props) => ({
    creditScore: props.loanProps.creditScore,
    annualIncome: props.loanProps.annualIncome,
    batchBorrowerCollaterals: props.loanProps.batchBorrowerCollaterals,
    batchLoanFiles: props.loanProps.batchLoanFiles,
    filesArray: props.valueGrab.filesArray,
    isBusinessIsBusiness: props.loanProps.isBusinessIsBusiness,
    loanAmount: props.loanProps.loanAmount,
    loanTerm: props.loanProps.loanTerm,
    locationId: props.loanProps.locationId,
    loanTypeId: props.loanProps.loanTypeId,
    preferredInterestRate: props.loanProps.preferredInterestRate,
    sSN: props.loanProps.sSN,
  }),

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(LoanApplicationConfirm);
