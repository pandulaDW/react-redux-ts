import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../redux/store";
import {
  UserEvent,
  selectUserEventsArray,
  loadUserEvents,
} from "../redux/user-events";
import { createDateKey } from "../lib/utils";
import "../styles/Calendar.css";

interface Props extends PropsFromRedux {}
type EventGroups = Record<string, UserEvent[]>;

const groupEventsByDay = (events: UserEvent[]): EventGroups => {
  const groups: EventGroups = {};

  const addToGroup = (dateKey: string, event: UserEvent) => {
    if (groups[dateKey] === undefined) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
  };

  events.forEach((event) => {
    const dateStartKey = createDateKey(new Date(event.dateStart));
    const dateEndKey = createDateKey(new Date(event.dateEnd));

    addToGroup(dateStartKey, event);

    if (dateEndKey !== dateStartKey) {
      addToGroup(dateEndKey, event);
    }
  });

  return groups;
};

const Calendar: React.FC<Props> = (props) => {
  const { events, loadUserEvents } = props;

  useEffect(() => {
    loadUserEvents();
    // eslint-disable-next-line
  }, []);

  let groupedEvents: EventGroups | undefined;
  let sortedGroupKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date1) - +new Date(date2)
    );
  }

  return groupedEvents && sortedGroupKeys ? (
    <div className="calendar">
      <div className="calendar-day">
        <div className="calendar-day-label">
          <span>1 February</span>
        </div>
        <div className="calendar-events">
          <div className="calendar-event">
            <div className="calendar-event-info">
              <div className="calendar-event-time">10.00 - 12.00</div>
              <div className="calendar-event-title">Learning Typescript</div>
            </div>
            <button className="calendar-event-delete-button">&times;</button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

const mapStateToProps = (state: RootState) => ({
  events: selectUserEventsArray(state),
});

const mapDispatchToProps = {
  loadUserEvents,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Calendar);
