import React from "react";
import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";

function CollateralLoanCards(props) {
  const { colIndex, colRemove, colPush, colType, colTypes } = props;
  return (
    <div>
      <h3 className="form-group text-center">Collateral Form {colIndex + 1}</h3>

      <div className="form-group my-5">
        <label>Collateral Type: </label>
        <Field
          as="select"
          className="form-control"
          name={`batchBorrowerCollaterals[${colIndex}].collateralTypeId`}
        >
          <option value="">Select...</option>
          {colTypes.map(colType)}
        </Field>
        <ErrorMessage
          name={`batchBorrowerCollaterals[${colIndex}].collateralTypeId`}
          component="div"
          className="formik-has-error"
        />
      </div>
      <div className="form-group my-5">
        <label>Amount: </label>
        <Field
          className="form-control"
          type="text"
          name={`batchBorrowerCollaterals[${colIndex}].amount`}
        />
        <ErrorMessage
          name={`batchBorrowerCollaterals[${colIndex}].amount`}
          component="div"
          className="formik-has-error"
        />
      </div>
      <div className="form-group my-5">
        <label>Quantity: </label>
        <Field
          className="form-control"
          type="text"
          name={`batchBorrowerCollaterals[${colIndex}].quantity`}
        />
        <ErrorMessage
          name={`batchBorrowerCollaterals[${colIndex}].quantity`}
          component="div"
          className="formik-has-error"
        />
      </div>
      <div className="row">
        <button
          className="btn btn-danger mx-2"
          type="button"
          onClick={() => colRemove(colIndex)}
        >
          Delete
        </button>
      </div>
      <div className="button-group mt-3">
        <button
          className="btn btn-secondary ml-1"
          type="button"
          onClick={() => colPush("")}
        >
          Add another
        </button>
      </div>
    </div>
  );
}

CollateralLoanCards.propTypes = {
  loanProps: PropTypes.shape({
    loanTerm: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
  }).isRequired,
  values: PropTypes.shape({
    loanTerm: PropTypes.number.isRequired,
    loanAmount: PropTypes.number.isRequired,
    loanTypeId: PropTypes.number.isRequired,
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
  colIndex: PropTypes.number,
  colRemove: PropTypes.func,
  colPush: PropTypes.func,
  colType: PropTypes.func,
  colTypes: PropTypes.func,
  cantBack: PropTypes.func,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  errors: PropTypes.string,
};

export default CollateralLoanCards;
