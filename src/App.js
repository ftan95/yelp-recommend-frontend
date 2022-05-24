import placeholder from './placeholder.png';
import './App.css';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import test_users from "./test_users_only.json";

function App() {
  // const [busId, setBusId] = useState([]);
  var randomId = test_users[Math.floor(Math.random()*test_users.length)];
  const [busInfoList, setBusInfoList] = useState([]);
  const [user, setUser] = useState({});
  const [show, setShow] = useState(true);

  useEffect(() => {
    fetchUserData(randomId);
    fetchData(randomId);
    console.log('i fire once');
  }, []);

  function fetchUserData(randomId) {
    fetch(`https://cors-everywhere.herokuapp.com/http://ec2-3-101-62-92.us-west-1.compute.amazonaws.com:8000/searchuser?` + new URLSearchParams({user: randomId}).toString(), {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      const transformedUser = ({
        name: data[1],
        yelp_since: data[2],
        review_count: data[3]
      })
      setUser(transformedUser);
      console.log(transformedUser);
    })
  }

  function fetchData(randomId) {
    fetch(`http://ec2-3-101-62-92.us-west-1.compute.amazonaws.com:8000/recommend?` + new URLSearchParams({user: randomId}).toString(), {
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
        fetch(`http://ec2-3-101-62-92.us-west-1.compute.amazonaws.com:8000/searchbusiness?` + new URLSearchParams({business: business.busId}).toString(), {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
        })
        .then(response => response.json())
        .then((data) => {
          console.log(data);
          const transformedInfo = ({
            id: data[0],
            name: data[5],
            location: data[2] + ", " + data[3],
            reviews: data[4],
            rating: data[6]
          });

          fetch(`http://ec2-3-101-62-92.us-west-1.compute.amazonaws.com:8000/reviews?` + new URLSearchParams({business: business.busId}).toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
          })
          .then(response => response.json())
          .then((data) => {
            console.log("review data ", data);
            transformedInfo.summary = data;
          });
          setBusInfoList(prev => [...prev, transformedInfo]);
        })
      })
    });
  }

  const buttonHandler = () => {
    setShow(false);
  }

  const backHandler = () => {
    setShow(true);
    setBusInfoList(prev => []);
    randomId = test_users[Math.floor(Math.random()*test_users.length)];
    fetchUserData(randomId);
    fetchData(randomId);
  }

  return (
    <div className="App">
      <div style={{display: show ? "block" : "none"}}>
        <h1>Yelp Recommendation Engine</h1>
        <button onClick={buttonHandler}>Generate Recommendations</button>
      </div>
      <div className="App-container" style={{display: show ? "none" : "flex"}}>
        <div>
          <h1>{user.name}</h1>
          <h2>Yelping since: {user.yelp_since}</h2>
          <h2>Reviews made: {user.review_count}</h2>
          <button onClick={backHandler}>Back</button>
        </div>
        <Container>
          <h1>Recommendations</h1>
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
                  <div className='recommend-review'>
                    <p>{bus.summary}</p>
                  </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}

export default App;
