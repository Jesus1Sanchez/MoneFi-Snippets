import React, { useEffect, useState } from "react";
import sabioDebug from "sabio-debug";
import { Formik, Form, Field } from "formik";
import { Card, Col } from "react-bootstrap";

function LoanCalculator() {
  const _LoanCalculator = sabioDebug.extend("LoanCalculator");

  const [calculator, setCalculator] = useState({
    amount: 0,
    months: 0,
    interestRate: 0,
    loanTotal: 0,
    monthlyPayment: 0,
    numPayments: 0,
  });

  const [details, setDetails] = useState({
    loanTotal: 0,
    loanInterest: 0,
    monthlyPayment: 0,
    yearlyPayment: 0,
  });

  useEffect(() => {
    let loanPrediction = {};

    if (
      !isNaN(calculator.amount) &&
      calculator.interestRate !== Infinity &&
      calculator.months > 0
    ) {
      let interestConversion = calculator.interestRate / 100 / 12;
      let equationNumerator =
        calculator.amount *
        interestConversion *
        Math.pow(Number(1) + Number(interestConversion), calculator.months);
      let equationDenominator =
        Math.pow(Number(1) + Number(interestConversion), calculator.months) -
        Number(1);
      let payment = equationNumerator / equationDenominator;
      let loanTotal = payment * calculator.months;

      loanPrediction = {
        loanInterest: (loanTotal - calculator.amount).toLocaleString(
          undefined,
          { maximumFractionDigits: 2 }
        ),
        loanTotal: loanTotal.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }),
        monthlyPayment: payment.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }),
        yearlyPayment: (payment * 12).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        }),
      };

      setDetails((prevState) => {
        let newMockLoan = { ...prevState };
        newMockLoan = loanPrediction;

        return newMockLoan;
      });
    }
  }, [calculator.months, calculator.amount, calculator.interestRate]);

  const onCalculatorFieldChange = (values) => {
    const target = values.target;
    const nameOfField = target.name;
    const valueOfField = target.value;

    setCalculator((preveState) => {
      let newCalc = { ...preveState };

      newCalc[nameOfField] = valueOfField;
      _LoanCalculator(newCalc);
      return newCalc;
    });
  };
  _LoanCalculator(calculator);

  return (
    <React.Fragment>
      <Card className="h-100">
        <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center">
          <div className="mb-0">
            <h4>Loan Calculator</h4>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="m-0">
            <Formik enableReinitialize={true} initialValues={calculator}>
              <Form className="form-group">
                <label className="mx-2">Loan Amount</label>
                <div className="form-group d-flex mx-2">
                  <Field
                    type="number"
                    className="form-control w-50"
                    value={calculator.amount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                    name="amount"
                    onChange={onCalculatorFieldChange}
                  />
                </div>
                <label className="mx-2">Desired Interest Rate</label>
                <div className="form-group d-flex mx-2">
                  <Field
                    type="number"
                    className="form-control w-50"
                    value={calculator.interestRate.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                    onChange={onCalculatorFieldChange}
                    name="interestRate"
                  />
                </div>
                <label className="mx-2">Loan Duration (in months)</label>
                <div className="form-group d-flex mx-2">
                  <Field
                    type="number"
                    className="form-control w-50"
                    value={calculator.months}
                    onChange={onCalculatorFieldChange}
                    name="months"
                  />
                </div>
              </Form>
            </Formik>
          </div>
          <div className="mx-2 mt-2">
            <h4 className="text-center">Loan Details</h4>
            <div className="row d-flex">
              <Col>
                <div className="col-auto">
                  Interest Rate: {calculator.interestRate}%{" "}
                </div>
                <div className="col-auto">
                  Grand Total: ${details.loanTotal}
                </div>
                <div className="col-auto">
                  Interest Charges: ${details.loanInterest}{" "}
                </div>
              </Col>
              <Col>
                <div className="col-auto">
                  Monthly Payment: ${details.monthlyPayment}{" "}
                </div>
                <div className="col-auto">
                  Yearly Payments: ${details.yearlyPayment}{" "}
                </div>
              </Col>
            </div>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default LoanCalculator;
