import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import {useState, useEffect} from 'react';
import {useRouter} from "next/router";
import axios from 'axios';

export default function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    axios.post(`http://localhost:8000/api/register`,{
      username, password
    }, {withCredentials: true,}).then(()=>{
      router.push('/');
    }).catch(err=>{
      console.log(err)
      setError(err?.response?.data?.errors[0]?.message || 'error');
    })
  }

  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h4 className="mb-3">Please enter your username and password!</h4>
                  <div className="mb-3">
                    <Form onSubmit={onSubmit}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Username
                        </Form.Label>
                        <Form.Control required onChange={(e)=>setUsername(e.target.value)} type="text" placeholder="Enter Username" />
                        {error ?
                          <Form.Text className='text-danger'>
                            {error}
                          </Form.Text>
                        :
                          <></>
                        }
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control required onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" />
                      </Form.Group>
                      <div>
                        {/* <Button className="mx-3" size='lg' variant="outline-primary" type="submit">
                          Login
                        </Button> */}
                        <Button size='lg' variant="primary" type="submit">
                          Signup/Login
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}