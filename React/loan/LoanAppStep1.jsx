import React from "react";
import { Form, Field, ErrorMessage, withFormik } from "formik";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import loanApplicationSchema from "schemas/loanApplicationSchemas";

const _logger = debug.extend("LoanAppS1");

const LoanAppStep1 = (props) => {
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

  const mapTypes = (type) => (
    <option key={type.id} value={type.id}>
      {type.name}
    </option>
  );

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
        <h1>Loan Data</h1>
        <div className="col-12 col-md-12">
          <div className="form-group my-5">
            <label htmlFor="loanTerm">Loan Term: </label>
            <Field
              as="select"
              className="form-control"
              name="loanTerm"
              id="loanTerm"
              value={values.loanTerm}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value=""> Select...</option>
              {props.lookUps.loanTermTypes.map(mapTypes)}
            </Field>
            <ErrorMessage
              name="loanTerm"
              component="div"
              className="formik-has-error"
            />
          </div>

          <div className="form-group my-5">
            <label>Loan Amount: </label>
            <Field
              className="form-control"
              type="text"
              name="loanAmount"
              id="loanAmount"
              value={values.loanAmount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage
              name="loanAmount"
              component="div"
              className="formik-has-error"
            />
          </div>

          <div className="form-group my-5">
            <label>Loan Type: </label>
            <Field
              as="select"
              className="form-control"
              name="loanTypeId"
              id="loanTypeId"
              value={values.loanTypeId}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select...</option>
              {props.lookUps.loanTypes.map(mapTypes)}
            </Field>
            <ErrorMessage
              name="loanTypeId"
              component="div"
              className="formik-has-error"
            />
          </div>
          <div className="form-group my-5">
            <label htmlFor="preferredInterestRate">
              Prefered Interest Rate:{" "}
            </label>
            <Field
              className="form-control"
              type="text"
              name="preferredInterestRate"
              id="preferredInterestRate"
              value={values.preferredInterestRate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage
              name="preferredInterestRate"
              component="div"
              className="formik-has-error"
            />
          </div>

          <div className="form-group my-5">
            <label>Credidit Score: </label>
            <Field
              as="select"
              className="form-control"
              name="creditScore"
              id="creditScore"
              value={values.creditScore}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select...</option>
              {props.lookUps.creditRangeType.map(mapTypes)}
            </Field>
            <ErrorMessage
              name="creditScore"
              component="div"
              className="formik-has-error"
            />
          </div>

          <div className="form-group my-5">
            <div className="form-check">
              <label
                htmlFor="isBusinessIsBusiness"
                className="form-check-label"
              >
                For a Business Loan
              </label>
              <Field
                type="checkbox"
                name="isBusinessIsBusiness"
                className="form-check-input"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
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

LoanAppStep1.propTypes = {
  loanProps: PropTypes.shape({
    loanTerm: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
  }).isRequired,
  values: PropTypes.shape({
    locationId: PropTypes.number.isRequired,
    loanTerm: PropTypes.number.isRequired,
    loanTermTypes: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
    preferredInterestRate: PropTypes.number.isRequired,
    creditScore: PropTypes.number.isRequired,
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
  }).isRequired,

  lookUps: PropTypes.shape({
    loanTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    collateralTypes: PropTypes.arrayOf(
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
    creditRangeType: PropTypes.arrayOf(
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
  handleSubmit: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
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

  validationSchema: loanApplicationSchema.step1,
})(LoanAppStep1);
