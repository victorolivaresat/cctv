
// BankButtons.jsx


import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./BankButtons.css";

const BankButtons = () => {
  return (
    <div className="bank-buttons-container">
      <Button as={Link} to="/transactions/bcp" variant="primary" className="mb-2">
        BCP
      </Button>
      <Button as={Link} to="/transactions/interbank" variant="primary" className="mb-2">
        Interbank
      </Button>
      <Button as={Link} to="/transactions/bbva" variant="primary" className="mb-2">
        BBVA
      </Button>
    </div>
  );
};

export default BankButtons;