import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, ClickAwayListener, InputAdornment, TextField } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications';
import api from '../api';
import SocialLogo from '../components/Logo/social';
import './socialsearch.scss';
import { Star, StarOutline } from '@material-ui/icons';
import utils from '../utils';

const SocialSearch = ({ search }) => {
  const { addToast } = useToasts();
  
  const [showList, setShowList] = useState(false);
  const [value, setValue] = useState('');
  const [users, setUsers] = useState([]);

  const showToast = useCallback((message, appearance = 'error') => {
    addToast(message, { appearance, autoDismiss: true });
  }, [addToast])

  const fetchSocialStatus = useCallback(() => {
    api.getSocialStatus()
      .then(data => {
        const following = data.following;
        const users = data.users || [];
        setUsers(users.map(user => {
          if(following.includes(user._id)) user.following = true;
          else user.following = false;
          user.username = utils.getUsername(user);
          user.filtered = user.selected = user.following;
          return user;
        }))
        setUsers(users);
      })
      .catch(err => showToast(err.message))
  }, [showToast])

  useEffect(() => {
    fetchSocialStatus();
  }, [fetchSocialStatus]);

  useEffect(() => {
    if(!users.length) return;
    const _ids = users.filter(user => user.selected).map(user => user._id);
    search(_ids);
  }, [users, search])

  const onChange = (e) => {
    const val = e.target.value;
    if (!val) {
      for (let i = 0; i < users.length; i ++) {
        users[i].filtered = users[i].selected || users[i].following;
      }
    } else {
      for (let i = 0; i < users.length; i ++) {
        users[i].filtered = users[i].selected || users[i].username.toLocaleLowerCase().includes(val.toLocaleLowerCase());
      }
    }
    setValue(val);
  }

  const selectUser = (idx, value) => {
    users[idx].selected = value;
    setUsers([...users]);
  }

  const followUser = (user) => {
    if(user.following) {
      api.unFollowUser(user._id)
      .then(() => {
        user.following = false;
        setUsers([...users]);
      })
      .catch(err => showToast(err.message))
    } else {
      api.followUser(user._id)
      .then(() => {
        user.following = true;
        setUsers([...users]);
      })
      .catch(err => showToast(err.message))
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setShowList(false)}>
      <div className='social-search-wraper'>
        <TextField
          className='social-search-text'
          label="Social Search"
          variant='outlined'
          value={value}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SocialLogo />
              </InputAdornment>
            ),
          }}
          onChange={onChange}
          onFocus={() => setShowList(true)}
        />
        <div className={'social-list' + (showList ? ' show' : '')}>
          <div className='social-users'>
            {users.map((user, idx) => user.filtered && (
              <div key={user._id} className='social-user'>
                <Checkbox checked={user.selected} onChange={(e) => {selectUser(idx, e.target.checked)}} />
                <div className='user-name'>{user.username}</div>
                <div className='user-follow' onClick={() => followUser(user)}>
                  {user.following ? <Star className='star' /> : <StarOutline />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default SocialSearch;
