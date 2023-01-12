import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/header';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {useRouter} from "next/router";

export default function App({ Component, pageProps, user }) {
  const router = useRouter()

  useEffect(() => {
    axios.defaults.withCredentials = true;
    if(!user){
      router.push('/login');
    }
  }, []);


  return (
    <>
      <Header user={user} />
      <Component {...pageProps} />
    </>
  )
}


App.getInitialProps = async({ctx}) => {
    if (typeof window === 'undefined') {
      const {data} = await axios.get(`http://localhost:8000/api/currentuser`,{
        withCredentials: true,
        headers: {
            Cookie: ctx.req.headers.cookie
        }
      })
      return {user: data.user}
    }else{
      const {data} = await axios.get(`http://localhost:8000/api/currentuser`,{
        withCredentials: true,
      })
      return {user: data.user}
    }
};