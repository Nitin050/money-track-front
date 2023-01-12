import {useRouter} from "next/router";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {useState, useEffect} from 'react';
import { Button } from "react-bootstrap";
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';


function FriendsComp({user}) {
  const router = useRouter()
  const [modalShow, setModalShow] = useState('');
  const [show, setShow] = useState(false);
  const [data, setData] = useState('');
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const onHide = () => {
    setModalShow(false);
  }

  const updateFriends = () => {
    axios.get(`http://localhost:8000/api/get-friends`, {withCredentials: true,}).then((res)=>{
      setFriends([...res.data])
    }, ).catch(err=>{
      console.log(err)
    })
  }

  useEffect(() => {
    updateFriends();
  }, []);

  const onSubmit = () => {
    setLoading(true);
    axios.post(`http://localhost:8000/api/add-friends`,{
      username_list: data
    }).then(()=>{
      updateFriends();
      setLoading(false);
      onHide()
      setData('');
      setShow(true);
    }).catch(err=>{
      console.log(err)
    })
  }
 
  return (
    <div className='mt-5' style={{textAlign:'center'}}>
      <h3>Add friends</h3>
      <Button onClick={()=>setModalShow(true)} variant="primary" className='px-5'>
          Add friends here
      </Button>

      <Modal
        size="lg"
        show={modalShow}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add friends
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Enter usernames separated by comma</h5>
          <Form.Control onChange={(e)=>setData(e.target.value)} as="textarea" rows={2} />
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} onClick={onSubmit}>
            Submit
            {loading &&
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
              />
            }
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" className="p-3">
        <Toast bg='success' delay={2000} autohide onClose={() => setShow(false)} show={show}>
        <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body style={{color: '#fff'}}>
            Friends Added.
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <Card style={{ width: '18rem', margin:'1rem auto' }}>
        <Card.Header>Existing Friends</Card.Header>
        <ListGroup variant="flush">
        {friends.map((f)=>(
          <ListGroup.Item>{f.username}</ListGroup.Item>
        ))}
        </ListGroup>
      </Card>
    </div>
  );
}

export default FriendsComp;