import React from "react";
import { Form, withFormik, FieldArray } from "formik";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import loanApplicationSchema from "schemas/loanApplicationSchemas";
import CollateralLoanCards from "./loancards/CollateralLoanCards";

const _logger = debug.extend("LoanAppCollateral");

const LoanAppCollateral = (props) => {
  const {
    loanProps,
    errors,
    values,
    handleSubmit,
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

  const mapCollateralTypes = (type) => (
    <option key={type.id} value={type.id}>
      {type.name}
    </option>
  );

  const onDisable = () => {
    let notDisabled = false;
    if (errors === "") {
      notDisabled = true;
    }
    _logger(notDisabled, "disable");
    return notDisabled;
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialvalues={values.batchBorrowerCollaterals}
      className="p-1 formik-form"
    >
      <div className="row justify-content-center">
        <h1>Loan Collaterals</h1>
        <div className="col-12 col-md-12">
          <FieldArray name="batchBorrowerCollaterals">
            {(fieldArrayProps) => {
              const { push, remove, form } = fieldArrayProps;
              const { values } = form;
              const { batchBorrowerCollaterals } = values;
              return (
                <div>
                  {batchBorrowerCollaterals &&
                  batchBorrowerCollaterals.length > 0 ? (
                    batchBorrowerCollaterals.map((collaterals, index) => (
                      <div key={index}>
                        <CollateralLoanCards
                          colIndex={index}
                          colRemove={remove}
                          colPush={push}
                          colType={mapCollateralTypes}
                          colTypes={props.lookUps.collateralTypes}
                        />
                      </div>
                    ))
                  ) : (
                    <button
                      className="btn btn-primary ml-1"
                      type="button"
                      onClick={() => push("")}
                    >
                      AddCollateral
                    </button>
                  )}
                </div>
              );
            }}
          </FieldArray>

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

LoanAppCollateral.propTypes = {
  loanProps: PropTypes.shape({
    loanTerm: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
  }).isRequired,
  values: PropTypes.shape({
    loanTerm: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
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
  }),
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  backLabel: PropTypes.string.isRequired,
  nextLabel: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setValues: PropTypes.func.isRequired,
  cantBack: PropTypes.func,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  errors: PropTypes.string,
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

  validationSchema: loanApplicationSchema.colateral,

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(LoanAppCollateral);
