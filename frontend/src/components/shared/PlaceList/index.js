import React, { useContext } from 'react'

import Card from '../Card';
import PlaceItem from './PlaceItem';
import { AuthContext } from '../../../context/auth-context';
import Button from '../Button';

function PlaceList({ items, id, home }) {
  const { userId } = useContext(AuthContext)

  let content = null;
  if (items.length === 0 && userId !== id && !home) {
    content = (
      <div style={{ textAlign: 'center' }} className="place-list">
        <Card style={{ padding: '2rem', width: '100%' }}>
          User has no places.
        </Card>
      </div>
    )
  } else if (home && items.length === 0) {
    content = (
      <div style={{ textAlign: 'center' }} className="place-list">
        <Card style={{ padding: '2rem', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
          <p style={{ marginBottom: '3rem', width: '100%' }}>Your home page is empty. Explore and follow new users and create your places.</p>
          <Button to='/users' className='btn--green'>Explore users</Button><Button to='/places/new' className='btn--green'>Create place</Button>
        </Card>
      </div>
    )
  }
  else {
    function compare(a, b) {
      if (!a.date || !b.date) {
        return;
      }
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      let comparison = 0;
      if (dateA > dateB) {
        comparison = -1;
      } else if (dateA < dateB) {
        comparison = 1;
      }
      return comparison;
    }

    items.sort(compare);
    content = (
      <ul className="place-list">
        {userId === id && <div style={{ textAlign: 'center', marginBottom: '3rem' }}><Button className='btn--green' to={'/places/new'}>Create Place</Button></div>}
        {items.map((item => (
          <PlaceItem
            key={item.id ? item.id : item._id}
            id={item.id ? item.id : item._id}
            image={item.image}
            title={item.title}
            description={item.description}
            address={item.address}
            creatorId={item.creator}
            coordinates={item.location}
            likes={item.likes}
            comments={item.comments.length}
            date={item.date}
          />
        )))}
      </ul>
    )
  }

  return content;
}

export default PlaceList
