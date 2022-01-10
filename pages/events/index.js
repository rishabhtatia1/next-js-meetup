import { Fragment } from "react";
import { useRouter } from "next/router";
import EventList from "../../components/events/event-list";
import EventSearch from "../../components/events/events-search";
import { getAllEvents } from "../../helpers/api-utils";
const EventsPage = ({ events }) => {
  const router = useRouter();
  const findEventsHandler = (year, month) => {
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  };
  return (
    <Fragment>
      <EventSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </Fragment>
  );
};
export const getStaticProps = async () => {
  const featuredEvents = await getAllEvents();
  return { props: { events: featuredEvents }, revalidate: 60 };
};

export default EventsPage;
