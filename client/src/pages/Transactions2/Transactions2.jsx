import DarkModeContext from '../../contexts/DarkModeContext'
import { Row, Col } from 'react-bootstrap'
import { useContext } from 'react'

const Transactions = () => {

  const darkMode = useContext(DarkModeContext);

  console.log(darkMode)

  return (
    <div>
      <Row className='m-5'>
        <Col>
          <h1>Transactions</h1>
          {
            darkMode
              ? <p>Dark mode is ON</p>
              : <p>Dark mode is OFF</p>
          }
        </Col>
      </Row>
    </div>

  )
}

export default Transactions