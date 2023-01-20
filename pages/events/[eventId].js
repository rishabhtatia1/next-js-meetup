import { Fragment } from "react";
import Head from "next/head";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import { getEventById, getFeaturedEvents } from "../../helpers/api-utils";
import Comments from "../../components/input/comments";

const EventsDetailPage = ({ event }) => {
  if (!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <Fragment>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description} />
      </Head>
      <EventSummary title={event?.title} />
      <EventLogistics
        date={event?.date}
        address={event?.location}
        image={event?.image}
        imageAlt={event?.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
      <Comments eventId={event.id} />
    </Fragment>
  );
};
export const getStaticProps = async context => {
  const eventId = context.params.eventId;
  const event = await getEventById(eventId);
  return { props: { event }, revalidate: 30 };
};
export const getStaticPaths = async () => {
  const allEvents = await getFeaturedEvents();
  const paths = allEvents.map(event => ({
    params: {
      eventId: event.id
    }
  }));
  return {
    paths,
    fallback: "blocking"
  };
};
export default EventsDetailPage;
