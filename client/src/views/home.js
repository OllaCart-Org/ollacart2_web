import React from 'react';
import Layout from './layout';
import Cards from '../components/cards';

const Main = () => {
  return (
    <Layout>
      <Cards page='home' hideThumbs={true} />
    </Layout>
  )
};

export default Main;
