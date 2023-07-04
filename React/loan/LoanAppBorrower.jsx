import React from "react";
import { Form, Field, ErrorMessage, withFormik } from "formik";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import loanApplicationSchema from "schemas/loanApplicationSchemas";

const _logger = debug.extend("LoanAppS1");

const LoanAppBorrower = (props) => {
  const {
    loanProps,
    errors,
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    onNext,
    nextLabel,
    backLabel,
    cantBack,
    isSubmitting,
    onBack,
  } = props;
  false && _logger(loanProps);

  const onNextClick = () => {
    onNext(values);
  };
  const onBackClick = () => {
    onBack(values);
  };

  const onDisable = () => {
    let notDisabled = false;
    if (errors === "") {
      notDisabled = true;
    }
    _logger(notDisabled, "disable");
    return notDisabled;
  };

  _logger("values", values);

  return (
    <Form onSubmit={handleSubmit} className="p-1 formik-form">
      <div className="row justify-content-center">
        <h1>Borrower Information</h1>
        <div className="col-12 col-md-12">
          <div className="form-group my-5">
            <label>Social Security Number: </label>
            <Field
              className="form-control"
              type="text"
              name="sSN"
              id="sSN"
              value={values.sSN}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage
              name="sSN"
              component="div"
              className="formik-has-error"
            />
          </div>

          <div className="form-group my-5">
            <label>Annual Income </label>
            <Field
              className="form-control"
              type="text"
              name="annualIncome"
              id="annualIncome"
              value={values.annualIncome}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage
              name="annualIncome"
              component="div"
              className="formik-has-error"
            />
          </div>

          <div className="button-group text-center mt-3">
            <button
              type="button"
              className="btn btn-secondary mx-2"
              onClick={onBackClick}
              disabled={isSubmitting || cantBack}
            >
              {backLabel}
            </button>
            <button
              type="submit"
              className="btn btn-primary ml-1"
              disabled={onDisable}
              onClick={onNextClick}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
};

LoanAppBorrower.propTypes = {
  loanProps: PropTypes.shape({
    loanTerm: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
  }).isRequired,

  values: PropTypes.shape({
    annualIncome: PropTypes.number.isRequired,
    isBusinessIsBusiness: PropTypes.bool.isRequired,
    loanAmount: PropTypes.number.isRequired,
    locationId: PropTypes.number.isRequired,
    loanTerm: PropTypes.number.isRequired,
    loanTermTypes: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
    preferredInterestRate: PropTypes.number.isRequired,
    sSN: PropTypes.number.isRequired,
    filesArray: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string.isRequired,
      })
    ),
    batchLoanFiles: PropTypes.arrayOf(
      PropTypes.shape({
        fileId: PropTypes.number.isRequired,
        loanFileTypeId: PropTypes.number.isRequired,
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
    location: PropTypes.shape({
      id: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      zip: PropTypes.string,
      stateId: PropTypes.number,
    }).isRequired,
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
    loanTermTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }),
  backLabel: PropTypes.string.isRequired,
  cantBack: PropTypes.func,
  errors: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  nextLabel: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
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

  validationSchema: loanApplicationSchema.borrowerInfo,

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(LoanAppBorrower);
