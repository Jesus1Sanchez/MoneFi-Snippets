import React, { useState, useEffect } from "react";
import { Form, withFormik } from "formik";
import debug from "sabio-debug";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import loanApplicationSchema from "schemas/loanApplicationSchemas";
import UploadFile from "components/files/UploadFile";
import { FaFileAlt } from "react-icons/fa";

const _logger = debug.extend("LoanAppS3");

const LoanAppStep3 = (props) => {
  const [fileArray, setFileArray] = useState({
    fileNameArr: [],
    fileNameDiv: [],
  });

  _logger(fileArray);
  const {
    values,
    onNext,
    nextLabel,
    handleSubmit,
    backLabel,
    cantBack,
    setFieldValue,
    isSubmitting,
    onBack,
  } = props;

  const onNextClick = () => {
    onNext(values);
  };
  const onBackClick = () => {
    onBack(values);
  };

  useEffect(() => {
    if (values?.documentName) {
      setFileArray((prevstate) => {
        const pd = { ...prevstate };
        pd.fileNameArr.push({ fileName: values.documentName });
        values.filesArray = pd.fileNameArr;
        setFieldValue("filesArray", pd.fileNameArr);
        _logger("documentName", values.documentName);
        pd.fileNameDiv = values.filesArray.map(mapFiles);

        _logger("before return", values.filesArray);
        return pd;
      });

      _logger("fileArray", values.filesArray);
    }
  }, [values?.documentName || values.filesArray]);

  const mapFiles = (file) => {
    _logger("file mapper firing", file);
    return (
      <Card className="my-2">
        <div>
          <FaFileAlt />
          {file.fileName}
        </div>
      </Card>
    );
  };

  const batchLoanFilesMapper = (indvFile) => {
    _logger("Mapper", indvFile);
    const newFileData = {
      fileId: indvFile.fileId,
      loanFileTypeId: values.loanTypeId,
    };
    indvFile.loanFileTypeId = values.loanTypeId;
    _logger("newFileData", newFileData);
    return newFileData;
  };
  _logger("New Values", values);

  return (
    <Form onSubmit={handleSubmit} className="p-1 formik-form">
      <div className="row justify-content-center">
        <div className="col-12 col-md-12">
          <div className="button-group text-center mt-3">
            <div className="row">
              <div className="col-6 my-2">
                <UploadFile
                  getResponseName={(arr) => {
                    _logger("fileResponse name", arr);

                    arr.map((ind) => {
                      setFieldValue("documentName", ind.name);
                      return ind.name;
                    });
                  }}
                  getResponseFile={(arr) => {
                    _logger("fileResponse", arr);
                    values.batchLoanFiles = arr.map(batchLoanFilesMapper);
                    setFieldValue("url", arr[0].url);
                  }}
                />
              </div>
              <div className="col-6">
                <div>
                  <div>{values.filesArray.map(mapFiles)}</div>
                </div>
              </div>
            </div>

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
              disabled={isSubmitting}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
};

LoanAppStep3.propTypes = {
  values: PropTypes.shape({
    fileNames: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    documentName: PropTypes.string.isRequired,
    preferredInterestRate: PropTypes.number.isRequired,
    creditScore: PropTypes.number.isRequired,
    isBusinessIsBusiness: PropTypes.bool.isRequired,
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
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,

  handleBlur: PropTypes.func.isRequired,
  backLabel: PropTypes.string.isRequired,
  nextLabel: PropTypes.string.isRequired,
  onNext: PropTypes.func,
  getResponseFile: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,

  isSubmitting: PropTypes.bool.isRequired,
  cantBack: PropTypes.func,
  onBack: PropTypes.func,
  loanProps: PropTypes.shape({
    preferredInterestRate: PropTypes.number.isRequired,
    creditScore: PropTypes.number.isRequired,
    isBusinessIsBusiness: PropTypes.bool.isRequired,
  }).isRequired,
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

  validationSchema: loanApplicationSchema.step2,

  handleSubmit: (values, { props }) => {
    props.onNext(values);
  },
})(LoanAppStep3);
