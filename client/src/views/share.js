import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from "react-redux"
import copy from 'copy-to-clipboard';
import { FileCopyOutlined, Favorite, FavoriteBorder } from '@material-ui/icons';
import { useToasts } from 'react-toast-notifications';
import Layout from './layout';
import api from '../api';
import Cards from '../components/cards';
import EmailModal from '../components/Modals/EmailModal';

const SHARE_URL = process.env.REACT_APP_PUBLIC_URL + '/share';

const Share = (props) => {
  const [sharedId, setSharedId] = useState('');
  const [filter, setFilter] = useState({shared: 1, _id: null});
  const [followStatus, setFollowStatus] = useState(false);
  const [followedCount, setFollowedCount] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const { _id } = useSelector(state => state.auth);
  const { addToast } = useToasts();
  
  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast])

  const fetchFollowingStatus = useCallback(() => {
    if (!sharedId) return;
    setFilter({ shared: 1, _id: sharedId });
    api.getFollowStatus(sharedId)
      .then(data => {
        setFollowStatus(data.status);
        setFollowedCount(data.count);
      })
      .catch(err => showToast(err.message))
  }, [sharedId, showToast])

  useEffect(() => {
    const userid = props.match.params.userid;
    setSharedId(userid);
  }, [props]);

  useEffect(() => {
    if (!sharedId) return
    fetchFollowingStatus();
  }, [sharedId, fetchFollowingStatus]);

  const copyShareUrl = () => {
    copy(`${SHARE_URL}/${_id}`);
  }

  const followUser = () => {
    api.followUser(sharedId)
      .then(fetchFollowingStatus)
      .catch(err => showToast(err.message))
  }

  const followUserWithEmail = (email) => {
    api.followUser(sharedId, email)
      .then(() => {
        setShowEmailModal(false);
        fetchFollowingStatus();
      })
      .catch(err => showToast(err.message))
  }

  const unFollowUser = () => {
    api.unFollowUser(sharedId)
      .then(fetchFollowingStatus)
      .catch(err => showToast(err.message))
  }

  const followClicked = () => {
    if (sharedId === _id) return;
    if (!_id) {
      setShowEmailModal(true);
      return;
    }
    if (!followStatus) followUser();
    else unFollowUser();
  }

  return (
    <Layout>
      {sharedId === _id && _id && <div className='shared-header'>
        <div className='shared-url'>ollacart.com/share/{_id}<FileCopyOutlined onClick={copyShareUrl}/></div>
      </div>}
      <div className='follow-button' onClick={followClicked}>
        <span>Followers: {followedCount}</span>
        {sharedId !== _id && !followStatus && <FavoriteBorder /> }
        {sharedId !== _id && followStatus && <Favorite /> }
      </div>
      {filter._id &&
        <Cards
          page='share'
          readonly={!_id || sharedId !== _id}
          filter={filter}
        />}
      {!_id && <EmailModal open={showEmailModal} onClose={() => setShowEmailModal(false)} title='Follow Cart' onSubmit={followUserWithEmail} />}
    </Layout>
  );
};

export default Share;
