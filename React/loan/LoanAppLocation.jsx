import React, { useEffect } from "react";
import { withFormik, Form, ErrorMessage } from "formik";
import { PropTypes } from "prop-types";
import AutoCompleteField from "components/location/AutoComplete";
import locationService from "services/locationService";
import loanApplicationSchema from "schemas/loanApplicationSchemas";

const LoanAppLocation = (props) => {
  const {
    loanProps,
    errors,
    values,
    setValues,
    handleSubmit,
    setFieldValue,
    onNext,
    nextLabel,
    backLabel,
    cantBack,
    isSubmitting,
    onBack,
  } = props;

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
    return notDisabled;
  };
  useEffect(() => {
    if (values.locationId !== "") {
      locationService
        .getById(values.locationId)
        .then(onLocationGetByIdSuccess)
        .catch(onLocationGetByIdError);
    } else if (values?.location) {
      setValues(
        {
          ...values,
          lineOne:
            values?.location?.lineOne +
            " " +
            values.location.city +
            " " +
            values.location.zip,
        },
        [values?.location]
      );
    }
  }, [values?.location]);

  const onLocationGetByIdSuccess = (response) => {
    setFieldValue("location.latitude", response.item.latitude);
    setFieldValue("location.longitude", response.item.longitude);
    setFieldValue("location.lineOne", response.item.lineOne);
    setFieldValue("location.lineTwo", response.item.lineTwo);
    setFieldValue("location.city", response.item.city);
    setFieldValue("location.zip", response.item.zip);
    setFieldValue("location.stateId", response.item.stateId);

    setValues(
      {
        ...values,
        lineOne:
          values?.location?.lineOne +
          " " +
          values.location.city +
          " " +
          values.location.zip,
      },
      [values?.location]
    );
  };
  const onLocationGetByIdError = (error) => {};

  const handleLocation = (data) => {
    setFieldValue("location.latitude", data.latitude);
    setFieldValue("location.longitude", data.longitude);
    setFieldValue("location.lineOne", data.lineOne);
    setFieldValue("location.lineTwo", data.lineTwo);
    setFieldValue("location.city", data.city);
    setFieldValue("location.zip", data.zip);
    setFieldValue("location.stateId", data.stateId);

    const locationPayload = {
      locationTypeId: 3,
      latitude: data.latitude,
      longitude: data.longitude,
      lineOne: data.lineOne,
      lineTwo: data.lineTwo,
      city: data.city,
      zip: data.zip,
      stateId: data.stateId,
    };

    if (values.locationId !== "" || undefined) {
      locationService
        .update(values.locationId, locationPayload)
        .then(onUpdateLocationSuccess)
        .catch(onUpdateLocationError);
    } else {
      locationService
        .add(locationPayload)
        .then(onAddLocationSuccess)
        .catch(onAddLocationError);
    }
  };

  const onAddLocationSuccess = (response) => {
    values.locationId = response.item;

    setFieldValue("locationId", response.item);
  };

  const onAddLocationError = (error) => {};

  const onUpdateLocationSuccess = (response) => {};

  const onUpdateLocationError = (error) => {};

  return (
    <Form onSubmit={handleSubmit} className="p-1 formik-form">
      <div className="row justify-content-center">
        <h1>Location</h1>
        <div className="col-12 col-md-12">
          <div>
            <div>
              <div className="form-group my-5 pb-3 position-relative">
                <label>Location: </label>
                <AutoCompleteField
                  className="form-control"
                  setValues={(data) => handleLocation(data)}
                  id="lineOne"
                  name="lineOne"
                />
                <ErrorMessage
                  name="lineOne"
                  component="div"
                  className="formik-has-error"
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
                className="btn btn-primary mx-2"
                onClick={onNextClick}
                disabled={onDisable}
              >
                {nextLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

LoanAppLocation.propTypes = {
  loanProps: PropTypes.shape({
    creditScore: PropTypes.number.isRequired,
    isBusinessIsBusiness: PropTypes.bool.isRequired,
    preferredInterestRate: PropTypes.number.isRequired,
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
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  nextLabel: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  setFieldValue: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
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

  validationSchema: loanApplicationSchema.locationStep,

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(LoanAppLocation);
