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
import InputGroup from 'react-bootstrap/InputGroup';


function TransactionsComp({setUpdateTransactions, editTransaction, setEditTransaction, hideBtn=false}) {
  const router = useRouter()
  const [modalShow, setModalShow] = useState('');
  const [loading, setLoading] = useState('');
  const [amount, setAmount] = useState('');
  const [usernames, setUsernames] = useState('');
  const [category, setCategory] = useState('');
  const categories = ['movie','food','medical'];

  const onHide = () => {
    setModalShow(false);
    if(setEditTransaction){
      setEditTransaction('');
    }
  }

  useEffect(() => {
    if(editTransaction?.id){
      setModalShow(true);
      setAmount(editTransaction.total_amount);
      setUsernames(()=>{
        var s = '';
        editTransaction.shared_users.forEach((u)=>{
          s += u.username + ',';
        })
        return s.slice(0,-1);
      })
      setCategory(()=>{
        return categories.indexOf(editTransaction.category);
      })
    }
  }, [editTransaction?.id]);

  const onSubmit = () => {
    setLoading(true);
    if(editTransaction?.id){
      axios.put(`http://localhost:8000/api/add-transaction`,{
        username_list: usernames,
        amount,
        category: categories[category],
        id: editTransaction?.id
      }).then(()=>{
        setLoading(false);
        setUpdateTransactions(true);
        onHide()
        setUsernames('');
        setAmount('');
        setCategory('');
      }).catch(err=>{
        console.log(err)
      })
    }
    else{
      axios.post(`http://localhost:8000/api/add-transaction`,{
        username_list: usernames,
        amount,
        category: categories[category]
      }).then(()=>{
        setLoading(false);
        setUpdateTransactions(true);
        onHide()
        setUsernames('');
        setAmount('');
        setCategory('');
      }).catch(err=>{
        console.log(err)
      })
    }
  }
 
  const onDelete = () => {
    setLoading(true);
    axios.delete(`http://localhost:8000/api/transaction/${editTransaction?.id}`).then(()=>{
      setLoading(false);
      setUpdateTransactions(true);
      onHide()
      setUsernames('');
      setAmount('');
      setCategory('');
    }).catch(err=>{
      console.log(err)
    })
  }
 
  return (
    <>
      {!hideBtn &&
        <Button onClick={()=>setModalShow(true)} variant="primary" className='me-3'>
          Add transaction
        </Button>
      }
      <Modal
        size="lg"
        show={modalShow}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Expense
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Label htmlFor="basic-url">Enter comma separated usernames</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon3">
              With you and
            </InputGroup.Text>
            <Form.Control value={usernames} onChange={e=>setUsernames(e.target.value)} id="basic-url" aria-describedby="basic-addon3" />
          </InputGroup>

          <InputGroup className="mb-3">
            <InputGroup.Text>₹</InputGroup.Text>
            <Form.Control type='number' value={amount} onChange={e=>setAmount(e.target.value)} aria-label="Amount" />
            <InputGroup.Text>.00</InputGroup.Text>
          </InputGroup>

          <Form.Select value={category}  onChange={e=>setCategory(e.target.value)}>
            <option>Select Category</option>
            {categories.map((c,i)=>(
              <option value={i}>{c}</option>
            ))}
          </Form.Select>
        </Modal.Body>

        <Modal.Footer>
        {editTransaction &&
            <Button variant='danger' disabled={loading} onClick={onDelete}>
              Delete
              {loading &&
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                />
              }
            </Button>
          }
          <Button disabled={loading || !usernames || !amount || category===''} onClick={onSubmit}>
            {editTransaction ?
              'Edit'
            :
              'Submit'
            }
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
    </>
  );
}

export default TransactionsComp;