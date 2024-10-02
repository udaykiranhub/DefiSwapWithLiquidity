
import './App.css';

import{Row,Col} from  "react-bootstrap";

import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from './home';
import Connect from './connect';
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  return (
    <div className="App">
    <Row>
      <Col>
   <div className='heading'>
   <h3>A Defi Token Swap ETH to MTK And Vice Versa With Liquidity Pool </h3>
   </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />

          <Route path="/connect" element={<Connect/>} />

        </Routes>
      </Router>
      </Col>
    </Row>
    </div>
  );
}

export default App;
