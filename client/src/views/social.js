import React, { useState } from 'react';
import Cards from '../components/cards';
import Layout from './layout';

const Social = (props) => {
  const [filter] = useState({followed: 1});
  return (
    <Layout>
      <Cards
        page='social'
        readonly={true}
        filter={filter}
        showUsername={true}
      />
    </Layout>
  );
};

export default Social;
