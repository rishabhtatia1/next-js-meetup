import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";
import useSWR from "swr";
import { fetcher } from "../../helpers/api-utils";

const FilteredEventsPage = () => {
  const router = useRouter();
  const filteredData = router.query.slug;
  const { data, error } = useSWR(
    "https://nextjs-events-20725-default-rtdb.asia-southeast1.firebasedatabase.app/events.json",
    fetcher
  );
  const [loadedEvents, setLoadedEvents] = useState();
  useEffect(() => {
    if (data) {
      const events = [];
      for (let key in data) {
        events.push({
          id: key,
          ...data[key]
        });
      }
      setLoadedEvents(events);
    }
  }, [data]);
  if (!loadedEvents) {
    return <p className="center">Loading...</p>;
  }
  const numYear = +filteredData[0];
  const numMonth = +filteredData[1];
  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12 ||
    error
  ) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>Invalid Filter: Please adjust your values</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }
  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents?.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }
  const formatedDate = new Date(numYear, numMonth - 1);
  return (
    <Fragment>
      <ResultsTitle date={formatedDate} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
};

export default FilteredEventsPage;
