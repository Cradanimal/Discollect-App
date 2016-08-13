import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';


const optimisticSetItems = (items) => (
  {
    type: 'GET_INITIAL_ITEMS',
    items,
  }
);

export const saveUpload = (data_uri, filename, filetype) => (
  {
    type: 'ON_UPLOAD',
    data_uri,
    filename,
    filetype,
  }
);

const itemActions = {
  getLatestListings: () => (
    (dispatch) => {
      const url = 'http://localhost:3000/api/getAllListings';
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((response) => {
        console.log('~~~~~~~~~~~~~~~~~~~',response);
        dispatch(optimisticSetItems(response));
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  ),
  postNewListing: (listingData) => (
    (dispatch) => {
      const photoUrl = 'http://photohelper.herokuapp.com/api/createNewListing';
      const url = 'http://localhost:3000/api/createNewListing'
      if (listingData.picReference === undefined) {
        console.log('picRef is undefined')
        dispatch(itemActions.postListingAfterPhoto(listingData));
      } else {
        console.log('picref is good')
        fetch(photoUrl, {
          method: 'POST',
          body: JSON.stringify(listingData),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.json())
        .then((response) => {
          console.log(response)
          listingData.picReference = response;
          console.log(listingData);
          dispatch(itemActions.postListingAfterPhoto(listingData));
        })
      }
    }
  ),

  postListingAfterPhoto: (data) =>
    (dispatch) => {
    console.log('postListingAfterPhoto');
    const url = 'http://localhost:3000/api/createNewListing';
    console.log(data)
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      dispatch(itemActions.getLatestListings());
      browserHistory.push('/');
    })
    .catch(err => {
      console.log(err);
    });
  },

  searchItem: (query) => (
    (dispatch) => {
      const url = 'http://localhost:3000/api/getFilteredListings';
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((res) => {
        console.log('Search Success: ', res);
        dispatch(optimisticSetItems(res));
        browserHistory.push('/');
      })
      .catch(err => {
        console.log('Search Error: ', err);
      });
    }
  ),

  updateListingStatus: (details) => (
    (dispatch) => {
      console.log('1st step details: ', details);
      var num = JSON.stringify(details);
      const url = 'http://localhost:3000/api/update';
      fetch(url, {
        method: 'PUT',
        body: num,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((res) => {
        console.log('updated listing thingy!: ', res);
        dispatch(itemActions.getLatestListings());
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  ),

  closeListing: (listingID, userID) => (
    (dispatch) => {
      console.log('details >> ', listingID);
      const url = 'http://localhost:3000/api/closeListing';
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify({ listingID }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(res => res.json())
      .then(res => {
        console.log('///////', userID, '/////', res);
        // itemActions.getUsersListings(res.giverId);
        // browserHistory.push('/');
        // browserHistory.push('/dashboard');
        dispatch({
          type: 'GET_USERS_LISTINGS',
          usersListings: res,
        });
      })
      .catch(err => {
        console.log(err);
      });
    }
  ),


  getUsersListings: () => (
    // get listings associated with user at userID
    (dispatch) => {
      const url = 'http://localhost:3000/api/getUsersListings';
      const userID = 'fjfjf';
      fetch(url, {
        method: 'PUT',
        body: JSON.stringify({ userID }),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((response) => {
        dispatch({
          type: 'GET_USER_HISTORY',
          history: [{
            category: "all-categories",
            condition: 5,
            createdAt: "2016-08-13T02:18:34.000Z",
            description: "They are apples.",
            giverId: 2,
            id: 43,
            picReference: null,
            status: 0,
            takerId: null,
            title: "Apples",
            updatedAt: "2016-08-13T02:18:34.000Z",
            zipcode: 12345,
          }],
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  ),

  getUsersListings: (userId) => (
    (dispatch) => {
      const url = `http://localhost:3000/api/getUsersListings?userid=${userId}`;
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((response) => {
        let active = [];
        let pending = [];
        let waiting = [];
        for (let item of response) {
          if (item.giverId === userId && item.status === 0) {
            active.push(item);
          } else if (item.giverId === userId && item.status === 1) {
            pending.push(item);
          } else if (item.takerId === userId && item.status === 1) {
            waiting.push(item);
          }
        }
        dispatch({
          type: 'GET_USERS_LISTINGS',
          active: active || [],
          pending: pending || [],
          waiting: waiting || [],
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
    }),

  removeListing: (listingID) => (
    (dispatch) => {
      const url = 'http://localhost:3000/api/removeListing?listingID='+listingID;
      fetch(url, {
        method: 'DELETE',
      })
      .then(res=> {
        browserHistory.push('/')
        browserHistory.push('/dashboard')
      })
    }
  ),

};

export default itemActions;
