import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
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
  let pageHeaderData = (
    <Head>
      <title>Filtered Events</title>
      <meta name="description" content={`List of filtered events`} />
    </Head>
  );
  if (!loadedEvents) {
    return (
      <Fragment>
        {pageHeaderData}
        <p className="center">Loading...</p>
      </Fragment>
    );
  }
  pageHeaderData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`All events for ${numMonth}/${numYear}.`}
      />
    </Head>
  );
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
        {pageHeaderData}
        <ErrorAlert>
          <p>Invalid Filter: Please adjust your values</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }
  const filteredEvents = loadedEvents.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents?.length === 0) {
    return (
      <Fragment>
        {pageHeaderData}
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
      {pageHeaderData}
      <ResultsTitle date={formatedDate} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
};

export default FilteredEventsPage;
