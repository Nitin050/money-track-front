import styles from '../styles/Home.module.css'
import { Container,Button } from "react-bootstrap";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useRouter} from "next/router";
import Friends from '../components/friends';
import Transactions from '../components/transactions';
import AddTransaction from '../components/addTransaction';
import {useState, useEffect} from 'react';

export default function Home() {
  const [updateTransactions, setUpdateTransactions] = useState(true);

  return (
    <div className='home'>

      <Navbar expand="lg">
        <Container>
          <Navbar.Brand>Dashboard</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
            <AddTransaction
              setUpdateTransactions={setUpdateTransactions}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Transactions 
        updateTransactions={updateTransactions}
        setUpdateTransactions={setUpdateTransactions}
      />
      <Friends />
    </div>
  )
}
