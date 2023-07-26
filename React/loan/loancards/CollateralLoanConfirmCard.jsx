import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";

function CollateralLoanConfirmCoard(props) {
  return (
    <React.Fragment>
      <div className="col-6 my-2">
        <Card>
          <h6>Colateral {props.index + 1}</h6>
          <div>{props.arrProps.amount}</div>
          <div>{props.arrProps.colName}</div>
          <div>{props.arrProps.quantity}</div>
        </Card>
      </div>

      {/* <div>
        {props.typeProps.colName.map((arr) => {
          return arr.name;
        })}
      </div> */}
    </React.Fragment>
  );
}

CollateralLoanConfirmCoard.propTypes = {
  arrProps: PropTypes.number.isRequired,
  typeProps: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default CollateralLoanConfirmCoard;
