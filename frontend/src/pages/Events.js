import { useEffect, useState } from 'react';

import EventsList from '../components/EventsList';

function EventsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedEvents, setFetchedEvents] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/items');

      if (!response.ok) {
        setError('Fetching events failed.');
      } else {
        const resData = await response.json();
        console.log(resData);
        setFetchedEvents(resData);
      }
      setIsLoading(false);
    }

    fetchEvents();
  }, []);
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
      </div>
      {! fetchedEvents && <p>No data</p>}
      {!isLoading && fetchedEvents && <EventsList events={fetchedEvents} />}
    </>
  );
}

export default EventsPage;