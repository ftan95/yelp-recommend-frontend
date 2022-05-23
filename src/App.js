import placeholder from './placeholder.png';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

function App() {
  const userId = [
    'yhByTmJlswtYvSq9qKrskQ',
    'gBTEAlR4UdxiVOF_3oui0A',
    'Pp-T524lINokAcXw3qODKw',
    'tdNV2Wb0LrFpm1Yfov_Klw',
    'i-dWog1af9Q6WBm68By9Vg',
    'R9FyRhL305takxCWbzstvg',
    'z92s6ue5ql2BFe02W8Q7-A',
    'vlSA47FlfINOpooclRc7VQ',
    'HCFkEJRE2PJkkrIvZDrIOg',
    '-Y0JQ2lorYCZVNkFJFAZAA'
  ];

  // const [busId, setBusId] = useState([]);
  var randomId = userId[Math.floor(Math.random()*userId.length)];;
  const [busInfoList, setBusInfoList] = useState([]);

  useEffect(() => {
    fetchData(randomId);
    // console.log('i fire once');
  }, []);

  function fetchData(randomId) {
    fetch(`http://ec2-52-53-159-85.us-west-1.compute.amazonaws.com:8000/recommend?` + new URLSearchParams({user: randomId}).toString(), {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      console.log(data[0]);
      const transformedId = data[0].map((business, index) => {
        return {
          id: index,
          busId: business
        }
      });
      transformedId.forEach((business) => {
        fetch(`http://52.53.159.85:8000/searchbusiness?` + new URLSearchParams({business: business.busId}).toString(), {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then((data) => {
          // console.log(data);
          const transformedInfo = ({
            id: data[0],
            name: data[5],
            location: data[2] + ", " + data[3],
            reviews: data[4],
            rating: data[6]
          });
          setBusInfoList(prev => [...prev, transformedInfo]);
        })
      })
    });
  }

  return (
    <div className="App">
      <div className="App-header">
        <Container>
          {busInfoList.map(bus => 
            <Row className='recommend' key={bus.id}>
              <Col>
                <img src={placeholder} className="App-logo" alt="logo" />
              </Col>
              <Col>
                  <h1>{bus.name}</h1>
                  <p>Rating: {bus.rating}</p>
                  <p>Location: {bus.location}</p>
                  <p>Reviews: {bus.reviews}</p>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}

export default App;
