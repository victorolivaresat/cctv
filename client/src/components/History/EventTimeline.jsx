import { Chrono } from "react-chrono";
import PropTypes from "prop-types";

const EventTimeline = ({ events }) => {
  const items = events.map(event => {
    let details;
    try {
      details = JSON.parse(event.details);
    } catch (error) {
      console.error("Error parsing event details:", error);
      details = { previousStatus: "unknown", newStatus: "unknown" };
    }

    return {
      title: new Date(event.created_at).toLocaleString(),
      cardTitle: event.action,
      cardSubtitle: `Model: ${event.model}`,
      cardDetailedText: `Previous Status: ${details.previousStatus}\nNew Status: ${details.newStatus}`,
      media: {
        type: "IMAGE",
        source: {
          url: `https://loremflickr.com/1280/720`,
          alt: event.action,
        },
      },
    };
  });

  return (
    <Chrono items={items} mode="VERTICAL" />
  );
};

EventTimeline.propTypes = {
  events: PropTypes.array.isRequired,
};

export default EventTimeline;