import React, { useCallback, useState } from 'react';
import Cards from '../components/cards';
import SocialSearch from '../components/socialsearch';
import Layout from './layout';

const Social = () => {
  const [filter, setFilter] = useState({social: 1, _ids: []});

  const search = useCallback((_ids) => {
    setFilter({ social: 1, _ids })
  }, [])

  return (
    <Layout>
      <SocialSearch search={search} />
      <Cards
        page='social'
        readonly={true}
        filter={filter}
      />
    </Layout>
  );
};

export default Social;
