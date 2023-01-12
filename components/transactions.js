import {useRouter} from "next/router";
import {useState, useEffect,useRef} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import AddTransaction from './addTransaction';
import Form from 'react-bootstrap/Form';


function TransactionsComp({updateTransactions, setUpdateTransactions}) {
  const router = useRouter()
  const [modalShow, setModalShow] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [oweTransactions, setOweTransactions] = useState([]);
  const [filteredOweTransactions, setFilteredOweTransactions] = useState([]);
  const [oweAmount, setOweAmount] = useState(0);
  const [owedAmount, setOwedAmount] = useState(0);
  const [editTransaction, setEditTransaction] = useState('');
  const [category2, setCategory2] = useState('');
  const [from2, setFrom2] = useState('');
  const [to2, setTo2] = useState('');
  const [showFilter2, setShowFilter2] = useState(false);
  const [category1, setCategory1] = useState('');
  const [from1, setFrom1] = useState('');
  const [to1, setTo1] = useState('');
  const [showFilter1, setShowFilter1] = useState(false);
  const categories = ['movie','food','medical'];

  const updateTransactionsFunc = () => {
    axios.get(`http://localhost:8000/api/get-transactions`, {withCredentials: true,}).then((res)=>{
      setUpdateTransactions(false);
      setTransactions([...res.data.transactions])
      setOweTransactions([...res.data.owe_transactions])
      
      setOwedAmount(()=>{
        var amount = 0;
        res.data.transactions.forEach(t=>{
          amount += parseFloat(t.amount_per_person) * (parseFloat(t.shared_users.length))
        })
        return amount
      });
      setOweAmount(()=>{
        var amount = 0;
        res.data.owe_transactions.forEach(t=>{
          amount += parseFloat(t.amount_per_person)
        })
        return amount
      });
    }, {withCredentials: true}).catch(err=>{
      console.log(err)
    })
  }

  useEffect(() => {
    if(updateTransactions){
      updateTransactionsFunc();
    }
  }, [updateTransactions]);


  useEffect(() => {
    console.log(category1)
    if(category1){
      var copy = [];
      setShowFilter1(true);
      oweTransactions.forEach(t=>{
        if(t.category==category1){
          copy.push({...t})
        }
      })
      setFilteredOweTransactions([...copy]);
    }
  }, [category1]);

  const onFilter1 = () => {
    var copy = [];
    setShowFilter1(true);
    oweTransactions.forEach(t=>{
      var date = new Date(t.created_at).toISOString().split('T')[0]
      if(date>=from1 && date<=to1){
        copy.push({...t})
      }
    })
    setFilteredOweTransactions([...copy]);
  }

  const onClear1 = () => {
    setShowFilter1(false);
    setCategory1('');
    setFilteredOweTransactions([]);
  }
 
  useEffect(() => {
    if(category2){
      var copy = [];
      setShowFilter2(true);
      transactions.forEach(t=>{
        if(t.category==category2){
          copy.push({...t})
        }
      })
      setFilteredTransactions([...copy]);
    }
  }, [category2]);

  const onFilter2 = () => {
    var copy = [];
    setShowFilter2(true);
    transactions.forEach(t=>{
      var date = new Date(t.created_at).toISOString().split('T')[0]
      if(date>=from2 && date<=to2){
        copy.push({...t})
      }
    })
    setFilteredTransactions([...copy]);
  }

  const onClear2 = () => {
    setShowFilter2(false);
    setCategory2('');
    setFilteredTransactions([]);
  }
 
  return (
    <div>
      <div className="d-flex">
        <div className="p-2 bg-secondary text-white flex-fill">
          Total: ₹ {owedAmount - oweAmount}
        </div>
        <div className="p-2 bg-secondary text-white flex-fill">
          You owe: ₹ {oweAmount}
        </div>
        <div className="p-2 bg-secondary text-white flex-fill">
          You are owed: ₹ {owedAmount}
        </div>
      </div>
      <div className="d-flex">
        <div className="p-2 flex-fill" style={{borderRight: '1px solid gray', maxWidth:'50%'}}>
          <ListGroup variant="flush">
            <ListGroup.Item variant="dark">You owe</ListGroup.Item>
            
            <Form.Select value={category1}  onChange={e=>setCategory1(e.target.value)}>
              <option>Filter by category</option>
              {categories.map((c)=>(
                <option value={c}>{c}</option>
              ))}
            </Form.Select>
            <form style={{textAlign:'left'}}>
              <label className="mt-2" htmlFor="from">from: </label>
              <input value={from1} onChange={e=>setFrom1(e.target.value)} type="date" id="from" name="from"/><br/>
              <label className="mt-2" htmlFor="to">to: </label>
              <input value={to1} onChange={e=>setTo1(e.target.value)} type="date" id="to" name="to"/>
              <Button onClick={onFilter1} className='ms-2' variant="primary" size="sm">
                filter
              </Button>
              <Button onClick={onClear1} className='ms-1' variant="secondary" size="sm">
                clear
              </Button>
            </form>
            
            {(showFilter1 ? filteredOweTransactions : oweTransactions).map((t)=>(
                <ListGroup.Item>
                  <Card.Title style={{fontSize: '16px'}}>{t.user.username}</Card.Title>
                  <Card.Subtitle className="text-muted">
                    ₹ {t.amount_per_person} &nbsp; ({t.category})
                  </Card.Subtitle>
                  <Card.Text style={{fontSize: '13px', color:'gray'}}>
                    {new Date(t.created_at).toLocaleDateString()}
                  </Card.Text>
                </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <div className="p-2 flex-fill" style={{borderRight: '1px solid gray', maxWidth:'50%'}}>
          <ListGroup variant="flush">
            <ListGroup.Item variant="dark">You are owed</ListGroup.Item>

            <Form.Select value={category2}  onChange={e=>setCategory2(e.target.value)}>
              <option>Filter by category</option>
              {categories.map((c)=>(
                <option value={c}>{c}</option>
              ))}
            </Form.Select>
            <form style={{textAlign:'left'}}>
              <label className="mt-2" htmlFor="from">from: </label>
              <input value={from2} onChange={e=>setFrom2(e.target.value)} type="date" id="from" name="from"/><br/>
              <label className="mt-2" htmlFor="to">to: </label>
              <input value={to2} onChange={e=>setTo2(e.target.value)} type="date" id="to" name="to"/>
              <Button onClick={onFilter2} className='ms-2' variant="primary" size="sm">
                filter
              </Button>
              <Button onClick={onClear2} className='ms-1' variant="secondary" size="sm">
                clear
              </Button>
            </form>
            
            {(showFilter2 ? filteredTransactions : transactions).map((t)=>{
              return t.shared_users.map((user,i)=>(
                <ListGroup.Item style={{position:'relative'}}>
                  <Card.Title style={{fontSize: '16px'}}>{user.username}</Card.Title>
                  <Card.Subtitle className="text-muted">
                    ₹ {t.amount_per_person} &nbsp; ({t.category})
                  </Card.Subtitle>
                  <Card.Text style={{fontSize: '13px', color:'gray'}}>
                    {new Date(t.created_at).toLocaleDateString()}
                  </Card.Text>
                  <div className='editBtn' onClick={()=>setEditTransaction({...t})} >
                    edit/delete
                  </div>
                </ListGroup.Item>
              ))
            })}
          </ListGroup>
        </div>
      </div>
      
      <AddTransaction
        setUpdateTransactions={setUpdateTransactions}
        editTransaction={editTransaction}
        setEditTransaction={setEditTransaction}
        hideBtn={true}
      />
    </div>
  );
}

export default TransactionsComp;